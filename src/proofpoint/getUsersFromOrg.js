import { fetchEndpoint } from "../plugins/axios.plugin.js";

export const getUsersFromOrgs = async (domain, username, password) => {
    console.log(domain);
    const { users } = await fetchEndpoint(`/orgs/${domain}/users`, username, password);
    return users.map(user => {
        return {
            title: user.primary_email.toLowerCase(),
            type: user.type,
            name: `${user.firstname} ${user.surname}`,
            alias: user.alias_emails
        }    
    });
}