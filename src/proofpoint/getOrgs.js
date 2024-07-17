import { fetchEndpoint } from "../plugins/axios.plugin.js";
import { enviromentVars } from "../plugins/enviroments.js"

export const getOrgs = async (username, password) => {
    let orgs = await fetchEndpoint(`/billing/${enviromentVars.domain}/orgs`, username, password);
    return orgs.map(o => {
        return {
            title: o.name,
            value: o.primary_domain,
            description: `Active users: ${o.active_users} - Domain: ${o.primary_domain}` 
        }    
    });
}