//cSpell: ignore proofpoint
import { proofpointAction } from "./proofpointStatus.js";

export const checkProofType = (mailType, proofType, hasLicense) => {
    const isLicensed = hasLicense === true || hasLicense.toLowerCase() === 'true';
    const isUnlicensed = hasLicense === false || hasLicense.toLowerCase() === 'false';

    switch (proofType) {
        case 'organization_admin':
        case 'end_user':
            if (isUnlicensed || mailType === 'SharedMailbox') {
                return proofpointAction.account.functional.change;
            } else if (mailType === 'UserMailbox') {
                return proofpointAction.account.ok;
            }
            break;

        case 'functional_account':
            if (isUnlicensed || mailType === 'SharedMailbox') {
                return proofpointAction.account.ok;
            } else if (mailType === 'UserMailbox' && isLicensed) {
                return proofpointAction.account.user.change;
            }
            break;

        case 'Not in proofpoint':
            if (isUnlicensed) {
                return proofpointAction.account.ok;
            } else if (mailType === 'SharedMailbox') {
                return proofpointAction.account.functional.add;
            } else if (mailType === 'UserMailbox' && isLicensed) {
                return proofpointAction.account.user.add;
            }
            break;
    }

    return proofpointAction.account.needReview;
};
