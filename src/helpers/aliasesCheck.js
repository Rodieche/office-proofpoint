import { proofpointAction } from "./proofpointStatus.js";

export const checkAliases = (primaryMail, mailboxAliases, proofpointMails) => {

    const check = (alias, mailboxex, proofpointboxes) => {
        const existOnProof = proofpointboxes.includes(alias);
        const existOnMail = mailboxAliases.includes(alias);
        if(existOnMail && existOnProof){
            return proofpointAction.alias.ok
        }else if(existOnMail && !existOnProof){
            return proofpointAction.alias.add
        }else if(!existOnMail && existOnProof){
            return proofpointAction.alias.remove;
        }else if(!existOnMail && !existOnProof){
            return proofpointAction.alias.notSure;
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