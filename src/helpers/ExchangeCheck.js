// cSpell: ignore proofpoint
import { proofpointAction } from "./proofpointStatus.js";

export const ExchangeCheck = (exchangeMails, proofpointMails) => {
    const result = [];

    proofpointMails.forEach(pp => {
        const existsInExchange = exchangeMails.find(
            ex => ex.PrimaryEmail === pp.title);

        if (!existsInExchange) {
            const action =
                pp.type === 'organization_admin' || pp.type === 'end_user'
                    ? proofpointAction.account.user.remove
                    : pp.type === 'functional_account'
                    ? proofpointAction.account.functional.remove
                    : '';

            result.push({
                name: pp.name,
                primaryEmail: pp.title,
                mailboxType: 'undefined',
                proofpointType: pp.type,
                alias: [],
                actions: action,
            });
        }
    });

    return result;
};
