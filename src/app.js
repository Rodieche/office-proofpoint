// cSpell: ignore Proofpoint readfiles enviroment enviroments
import { configDotenv } from 'dotenv';
import prompts from 'prompts';
import fs from 'fs';
import path from 'path';

import { getOrgs } from './proofpoint/getOrgs.js';
import { getUsersFromOrgs } from './proofpoint/getUsersFromOrg.js';
import { createExcelSheet } from './plugins/excel/createExcelSheet.js';
import { updateExcelSheet } from './plugins/excel/updateExcelSheet.js';
import { getDataFromExcel } from './plugins/excel/readfiles.js';
import { checkProofpoint } from './helpers/proofpointCheck.js';
import { checkAliases } from './helpers/aliasesCheck.js';
import { checkProofType } from './helpers/checkProofType.js';
import { checkDomains, getDomains, matchDomain } from './helpers/CheckDomains.js';
import { ExchangeCheck } from './helpers/ExchangeCheck.js';
import { enviromentVars } from './plugins/enviroments.js';

configDotenv();

const questions = [
  {
    type: 'text',
    name: 'user',
    message: 'Proofpoint username (email address):',
    validate: value => /\S+@\S+\.\S+/.test(value) || 'Enter a valid email address',
  },
  {
    type: 'text',
    style: 'password',
    name: 'pwd',
    message: 'Proofpoint password:',
    mask: '*',
  },
];

const logBanner = (title) => {
  console.warn('='.repeat(60));
  console.warn(`|${title.padStart((title.length + 56) / 2).padEnd(58)}|`);
  console.warn('='.repeat(60));
};

async function getCredentials() {
  if (!enviromentVars.proofpointCredentials) {
    const { user, pwd } = await prompts(questions);
    return { username: user, password: pwd };
  }
  const [username, password] = atob(enviromentVars.proofpointCredentials).split(':');
  console.log('Credentials file found');
  return { username, password };
}

function checkMailboxFile() {
  const filePath = path.join(process.cwd(), 'output', 'Mailboxes-with-licenses.csv');
  if (!fs.existsSync(filePath)) {
    console.error('Missing Exchange data file.');
    console.error('Run PowerShell as admin: .\\src\\powershell\\v2Exchange.ps1');
    return false;
  }
  return true;
}

async function setVars() {
  console.clear();
  logBanner('PROOFPOINT AUTHENTICATION');

  if (!checkMailboxFile()) return;

  const { username, password } = await getCredentials();

  const orgs = await getOrgs(username, password);
  let exchangeMails = getDataFromExcel('Mailboxes-with-licenses.csv');
  const domain = getDomains(exchangeMails);
  const selectedOrg = matchDomain(orgs, domain);

  console.log(`Selected customer: ${selectedOrg}`);
  const users = await getUsersFromOrgs(selectedOrg, username, password);

  logBanner('GENERATING EXCEL FILE');
  console.log('Generating initial Excel file...');
  createExcelSheet(users);

  const aliasesData = users.flatMap(user =>
    (user.alias || []).map(a => ({
      email: user.title,
      alias: a.toLowerCase(),
    }))
  );

  console.log('Checking Aliases...');
  updateExcelSheet(aliasesData);
  console.log('Alias export complete.');

  logBanner('MERGING INFORMATION');
  const isDomainOk = checkDomains(exchangeMails, selectedOrg);

  if (!isDomainOk) {
    logBanner('DOMAINS ERROR');
    console.error('Proofpoint Domain and Exchange Domain do not match.');
    return;
  }

  logBanner('DOMAINS MATCH');
  console.log('Proofpoint and Exchange domains are compatible.');

  exchangeMails = exchangeMails.map(({ Aliases, PrimaryEmail, ...data }) => ({
    PrimaryEmail: PrimaryEmail.toLowerCase(),
    Aliases: Aliases.split(';').map(a => a.split(':')[1]?.toLowerCase() || ''),
    ...data,
  }));

  const onlyOnProofpoint = ExchangeCheck(exchangeMails, users);

  let finalData = exchangeMails.map(mail => {
    const pptType = checkProofpoint(mail.PrimaryEmail, users);
    return {
      name: mail.DisplayName,
      primaryEmail: mail.PrimaryEmail,
      mailboxType: mail.RecipientType,
      proofpointType: pptType,
      hasExchangeLicense: mail.HasExchangeLicense,
      alias: checkAliases(mail.PrimaryEmail, mail.Aliases, aliasesData),
      actions: checkProofType(mail.RecipientType, pptType, mail.HasExchangeLicense),
    };
  });

  finalData = [...finalData, ...onlyOnProofpoint];

  const exportData = finalData.map(({ alias, ...rest }) => rest);
  const allAliases = finalData.flatMap(d => d.alias || []);

  const timestamp = new Date().getMilliseconds();
  const fileName = `${selectedOrg}_${timestamp}.xlsx`;
  const digestPath = 'digestFile.txt';

  if (fs.existsSync(digestPath)) fs.unlinkSync(digestPath);
  fs.writeFileSync(digestPath, fileName);

  createExcelSheet(exportData, fileName);
  updateExcelSheet(allAliases, fileName);

  logBanner('VERIFICATION COMPLETED');
  console.log(`Check ${fileName} in: ${path.join(process.cwd(), 'output')}`);
  console.warn('Digest file will be overwritten on next run. Move it if needed.');
}

setVars();
