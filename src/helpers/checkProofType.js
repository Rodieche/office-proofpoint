export const checkProofType = (mailType, proofType) => {
    // console.log(mailType, proofType);
    if(proofType == 'organization_admin' || proofType == 'end_user'){
        if(mailType == 'SharedMailbox'){
            return 'Needs to change as Functional Account';
        }else if( mailType == 'UserMailbox' ){
            return 'OK';
        }else{
            return 'Needs review'
        }
    }else if( proofType == 'functional_account' ){
        if(mailType == 'SharedMailbox'){
            return 'OK';
        }else if( mailType == 'UserMailbox' ){
            return 'Needs to change as End User';
        }else{
            return 'Needs review'
        }
    }else if(proofType == 'Not in proofpoint'){
        if(mailType == 'SharedMailbox'){
            return 'Needs to be added as Functional Account';
        }else if( mailType == 'UserMailbox' ){
            return 'Needs to be added as End User';
        }else{
            return 'Needs review'
        }
    }else{
        return 'Needs review'
    }
}