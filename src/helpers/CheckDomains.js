export const checkDomains = (exchangeMailList = [], domain) => {
    if(exchangeMailList.length == 0) return false;

    let exchangeDomain = exchangeMailList.map(mail => {
        return mail.PrimaryEmail.split('@')[1];
    });

    exchangeDomain = [...new Set(exchangeDomain)];

    if(exchangeDomain.includes(domain)){
        return true;
    }else{
        return false;
    }
}

export const getDomains = (exchangeMails) => {
    if(!exchangeMails){
        throw new Error('No Exchange File');
    }

    const mails = exchangeMails.map(ex => ex.PrimaryEmail.split('@')[1]);
    const domains = [...new Set(mails)];
    return domains
}

export const matchDomain = (proofpointDomains, exchangeDomains) => {
    // console.log(exchangeDomains);
    
    const ppDomains = proofpointDomains.map(ppD => ppD.value);
    // console.log(ppDomains);

    let matchedDomainStr = null;
    for (const exD of exchangeDomains) {
        if (ppDomains.includes(exD)) {
            matchedDomainStr = exD;
            break; // Exit the loop as soon as a match is found
        }
    }
    // console.log(matchedDomainStr);
    return matchedDomainStr;
};