// Proofpoint aliases
// {
//     email: 'email@domain.com',
//     alias: 'alias@domain.com'
// }

// Mailbox Aliases
// [ 'blade_purchasing@propellor.com' ]


export const checkAliases = (primaryMail, mailboxAliases, proofpointMails) => {

    const check = (alias, mailboxex, proofpointboxes) => {
        const existOnProof = proofpointboxes.includes(alias);
        const existOnMail = mailboxAliases.includes(alias);
        if(existOnMail && existOnProof){
            return 'OK'
        }else if(existOnMail && !existOnProof){
            return 'Need to add proofpoint';
        }else if(!existOnMail && existOnProof){
            return 'Needs to remove from proofpoint';
        }else if(!existOnMail && !existOnProof){
            return 'Needs to check on both';
        }
    }
    
    let info = [];

    let proofpointAliases = proofpointMails.filter(r => r.email == primaryMail);
    proofpointAliases = proofpointAliases.map(p => p.alias);

    info = [...new Set([...mailboxAliases, ...proofpointAliases])];
    
    info = info.map(alias => {
        return {
            alias,
            proofpointInfo: check(alias, mailboxAliases, proofpointAliases),
        }
    });

    return info;
}