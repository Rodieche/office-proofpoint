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
    console.log('=============================================================');
    console.log('|                  PROOFPOINT AUTHENTICATION                |');
    console.log('=============================================================');
    const responses = await prompt(questions);
    username = responses.user;
    password = responses.pwd;
    orgs = await getOrgs(username, password);
    selectedOrg = await selectOrg();
    console.log(`Selected customer: ${selectedOrg}`);
    users = await getUsersFromOrgs(selectedOrg, username, password);
    console.log('=============================================================');
    console.log('|                  GENERATING EXCEL FILE                    |');
    console.log('=============================================================');
    console.log('Generating Excel file...')
    createExcelSheet(selectedOrg, users);
    users.forEach(function(user){
        if(!user.alias) return
        user.alias.forEach(function(a){
            const newAlias = {
                email: user.title,
                alias: a
            }
        aliases_data.push(newAlias);
        })
    });
    console.log('Checking Aliases...')
    updateExcelSheet(selectedOrg, aliases_data);
    console.log('Export complete');

    console.log('=============================================================');
    console.log('|                   MERGING INFORMATION                     |');
    console.log('=============================================================');

    console.log('Checking files...');
    const existMailbox = fs.existsSync(path.join(process.cwd(),'output', 'Mailboxes-office.csv'));
    if(existMailbox){
        console.log('Microsoft 365 Exchange Export file found');
    }else{
        console.log('Please run the next command on Powershell (as admin) first: .\\src\\powershell\\v2Exchange.ps1 ');
        return;
    }

    let mailsExchange = getDataFromExcel('Mailboxes-office.csv');
    mailsExchange = mailsExchange.map(ex => {
        let newAlias = [];
        const {Aliases, ...data} = ex;
        Aliases.split(';').forEach(function(a){
            newAlias.push(a.split(':')[1]);
        })
        return {
            ...data, Aliases: newAlias
        }
    })

    // users = Proofpoint user
    // {
    //     title: 'aaa@asdds.com',
    //     type: 'user',
    //     mail: 'Rudolf Echenique'
    // }
    // aliases_data = Proofpoint aliases
    // {
    //     email: 'email@domain.com',
    //     alias: 'alias@domain.com'
    // }
    // mailsExchange = Mailbox emails
    // {
    //     DisplayName: 'Blade_Purchasing',
    //     PrimaryEmail: 'blade_purchasing@propellor.com',
    //     RecipientType: 'UserMailbox',
    //     Aliases: [ 'blade_purchasing@propellor.com' ]
    // }

    // console.log(mailsExchange);

    let newInfo = [];

    mailsExchange.forEach(function(mail){
        let data = {
            name: mail.DisplayName,
            primaryEmail: mail.PrimaryEmail,
            mailboxType: mail.RecipientType,
            proofpointType: checkProofpoint(mail.PrimaryEmail, users),
            alias: checkAliases(mail.PrimaryEmail, mail.Aliases, aliases_data)
        };
        newInfo.push(data);
    });

    console.log(newInfo);

    return;
}

console.clear();
setVars();