export const checkProofType = (mailType, proofType) => {
    console.log(mailType, proofType);
    if(proofType == 'organization_admin' || proofType == 'end_user'){
        if(mailType == 'UserMailbox'){
            return 'OK';
        }else{
            return 'Needs to change as Functional Account';
        }
    }else{
        if(mailType == 'UserMailbox'){
            return 'Needs to change as End User';
        }else{
            return 'OK';
        }
    }
}