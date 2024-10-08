import axios from "axios";
import consoleEmojis from 'console-emojis';

const baseURL = 'https://us4.proofpointessentials.com/api/v1'

export const fetchEndpoint = async (endpoint, username, password, method = 'GET', dataInput = null) => {
    if(!endpoint){
        throw new Error('No endpoint');
    }
    const url = `${baseURL}${endpoint}`;
    try{
        const { data } = await axios(url, {
            method,
            data: dataInput,
            headers: {
                'X-user': username,
                'X-password': password
            }
        });
        return data;
    }catch(e){
        console.error('Internal Error');
        throw new Error('Internal Error');
    }
}