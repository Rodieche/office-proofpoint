import { configDotenv } from "dotenv"

configDotenv();

export const enviromentVars = {
    domain: process.env.DOMAIN,
    proofpointCredentials: process.env.PROOFPOINT_CREDENTIALS
}