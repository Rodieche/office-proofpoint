import { proofpointAction } from "./proofpointStatus.js";

export const checkProofType = (mailType, proofType) => {
    // console.log(mailType, proofType);
    if(proofType == 'organization_admin' || proofType == 'end_user'){
        if(mailType == 'SharedMailbox'){
            return proofpointAction.account.functional.add;
        }else if( mailType == 'UserMailbox' ){
            return proofpointAction.account.ok;
        }else{
            return proofpointAction.account.needReview;
        }
    }else if( proofType == 'functional_account' ){
        if(mailType == 'SharedMailbox'){
            return proofpointAction.account.ok
        }else if( mailType == 'UserMailbox' ){
            return proofpointAction.account.user.add;
        }else{
            return proofpointAction.account.needReview;
        }
    }else if(proofType == 'Not in proofpoint'){
        if(mailType == 'SharedMailbox'){
            return proofpointAction.account.functional.add;
        }else if( mailType == 'UserMailbox' ){
            return proofpointAction.account.user.add;
        }else{
            return proofpointAction.account.needReview;
        }
    }else{
        return proofpointAction.account.needReview;
    }
}