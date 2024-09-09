import { configDotenv } from 'dotenv'; 
import prompts from 'prompts';
import fs from 'fs';

import { getOrgs } from './proofpoint/getOrgs.js';
import { getUsersFromOrgs } from './proofpoint/getUsersFromOrg.js';
import { createExcelSheet } from './plugins/excel/createExcelSheet.js';
import { updateExcelSheet } from './plugins/excel/updateExcelSheet.js';
import path from 'path';
import { getDataFromExcel } from './plugins/excel/readfiles.js';
import { checkProofpoint } from './helpers/proofpointCheck.js';
import { checkAliases } from './helpers/aliasesCheck.js';
import { checkProofType } from './helpers/checkProofType.js';
import { checkDomains, getDomains, matchDomain } from './helpers/CheckDomains.js';
import { ExchangeCheck } from './helpers/ExchangeCheck.js';
import { enviromentVars } from './plugins/enviroments.js';

const { prompt } = prompts;
configDotenv();

let username;
let password;
let orgs;
export let selectedOrg;
let users;
let aliases_data = [];

const questions = [
    {
        type: 'text',
        name: 'user',
        message: 'Proofpoint username (email address):',
        validate: value => /\S+@\S+\.\S+/.test(value) ? true : 'Please enter a valid email address'
    },
    {
        type: 'text',
        style: 'password',
        name: 'pwd',
        message: 'Proofpoint password:',
        mask: '*'
    }
]

const selectOrg = async() => {
    const response = await prompt({
        type: 'select',
        name: 'org',
        message: 'Choose customer',
        choices: orgs,
        initial: 1
    });
    return response.org;
}

export const setVars = async () => {
    console.warn('=============================================================');
    console.warn('|                  PROOFPOINT AUTHENTICATION                |');
    console.warn('=============================================================');
    console.log('Checking files...');
    const existMailbox = fs.existsSync(path.join(process.cwd(),'output', 'Mailboxes-office.csv'));
    if(!existMailbox){
        console.error('Please run the next command on Powershell (as admin) first: .\\src\\powershell\\v2Exchange.ps1 ');
        return;
    }
    if(!enviromentVars.proofpointCredentials){
        const responses = await prompt(questions);
        username = responses.user;
        password = responses.pwd;
    }else{
        const credentials = atob(enviromentVars.proofpointCredentials).split(":");
        username = credentials[0];
        password = credentials[1];
        console.log('Credentials file found')
    }
    orgs = await getOrgs(username, password);
    let mailsExchange = getDataFromExcel('Mailboxes-office.csv');
    const domain = getDomains(mailsExchange);

    //selectedOrg = await selectOrg();
    selectedOrg = matchDomain(orgs, domain);
    
    console.log(`Selected customer: ${selectedOrg}`);
    users = await getUsersFromOrgs(selectedOrg, username, password);
    console.warn('=============================================================');
    console.warn('|                  GENERATING EXCEL FILE                    |');
    console.warn('=============================================================');
    console.log('Generating Excel file...')
    createExcelSheet(users);
    users.forEach(function(user){
        if(!user.alias) return
        user.alias.forEach(function(a){
            const newAlias = {
                email: user.title,
                alias: a.toLowerCase()
            }
        aliases_data.push(newAlias);
        })
    });
    console.log('Checking Aliases...')
    updateExcelSheet(aliases_data);
    console.log('Export complete');

    console.warn('=============================================================');
    console.warn('|                   MERGING INFORMATION                     |');
    console.warn('=============================================================');


    console.log('Please wait...')


    const isDomainOk = checkDomains(mailsExchange, selectedOrg);

    if(!isDomainOk){
        console.l
        console.warn('=============================================================');
        console.warn('|                      DOMAINS ERROR                        |');
        console.warn('=============================================================');
        console.error('Proofpoint Domain and Exchange Domain are not the same');
        return;
    }else{
        console.warn('=============================================================');
        console.warn('|                      DOMAINS MATCH                        |');
        console.warn('=============================================================');
        console.log('Proofpoint Domain and Exchange Domain are not the same');
    }

    mailsExchange = mailsExchange.map(ex => {
        let newAlias = [];
        const {Aliases, PrimaryEmail, ...data} = ex;
        Aliases.split(';').forEach(function(a){
            newAlias.push(a.split(':')[1].toLowerCase());
        })
        return {
            PrimaryEmail: PrimaryEmail.toLowerCase(),
            Aliases: newAlias,
            ...data
        }
    });

    const onlyOnProofpoint = ExchangeCheck(mailsExchange, users);

    let newInfo = [];

    mailsExchange.forEach(function(mail){
        const ppt = checkProofpoint(mail.PrimaryEmail, users);
        let data = {
            name: mail.DisplayName,
            primaryEmail: mail.PrimaryEmail,
            mailboxType: mail.RecipientType,
            proofpointType: ppt,
            alias: checkAliases(mail.PrimaryEmail, mail.Aliases, aliases_data),
            actions: checkProofType(mail.RecipientType, ppt)
        };
        newInfo.push(data);
    });

    console.log('Creating digest...')
    
    newInfo = [...newInfo, ...onlyOnProofpoint];

    const mails_to_export = newInfo.map(m => {
        const { alias, ...dataMail } = m;
        return dataMail;
    })
    
    let finalAliasArray = [];
    newInfo.forEach(function(m){
        const { alias, ...dataMail } = m;
        finalAliasArray.push(...alias);
    })

    // console.log(finalAliasArray);

    const fileName = `${selectedOrg}_${new Date().getMilliseconds()}.xlsx`;
    const file = 'digestFile.txt';

    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    fs.writeFileSync(file, fileName, (err) => {
        if (err) {
            console.error("An error occurred while writing the file:", err);
            return;
        }
        console.log(`${file} has been created successfully!`);});

        createExcelSheet(mails_to_export, fileName);
    updateExcelSheet(finalAliasArray, fileName);

    console.warn('=============================================================');
    console.warn('|                  VERIFICATION COMPLETED                    |');
    console.warn('=============================================================');

    console.log(`Check Digest.xlsx file on ${path.join(process.cwd(), 'output')}`);
    console.warn('Move Digest file if you need the information, it will be deleted if run the app again');

    return;
}

console.clear();
setVars();