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