import { configDotenv } from 'dotenv'; 
import prompts from 'prompts';

import { getOrgs } from './proofpoint/getOrgs.js';
import { spinner } from './plugins/ora.plugin.js';
import { getUsersFromOrgs } from './proofpoint/getUsersFromOrg.js';
import { createExcelSheet } from './plugins/excel/createExcelSheet.js';
import { updateExcelSheet } from './plugins/excel/updateExcelSheet.js';

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
    console.log(aliases_data);
    updateExcelSheet(selectedOrg, aliases_data);
}

console.clear();
setVars();