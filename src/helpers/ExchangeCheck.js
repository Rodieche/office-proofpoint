import { proofpointAction } from "./proofpointStatus.js";

export const ExchangeCheck = (exchangeMails, proofpointMails) => {

    let newReturn = [];

    proofpointMails.forEach(function(pp){
        const exist = exchangeMails.filter(ex => ex['PrimaryEmail'] == pp.title)[0];
        if(!exist){
            let actions = '';
            if(pp.type == 'organization_admin' || pp.type == 'end_user'){
                actions = proofpointAction.account.user.remove;
            }else if( pp.type == 'functional_account' ){
                actions = proofpointAction.account.functional.remove
            }
            
            const user = {
                name: pp.name,
                primaryEmail: pp.title,
                mailboxType: 'undefined',
                proofpointType: pp.type,
                alias: [],
                actions
            };

            newReturn.push(user);
        }
    });

    return newReturn;
}