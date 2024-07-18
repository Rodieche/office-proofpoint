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

    const domain = primaryMail.split('@')[1];
    
    let info = [];

    let proofpointAliases = proofpointMails.filter(r => r.email == primaryMail);
    proofpointAliases = proofpointAliases.map(p => p.alias);
    let maliases = mailboxAliases.filter(r => (r != primaryMail && r.split('@')[1] == domain));

    info = [...new Set([...maliases, ...proofpointAliases])];
    
    info = info.map(alias => {
        return {
            primaryMail,
            alias,
            proofpointInfo: check(alias, maliases, proofpointAliases),
        }
    });

    return info;
}