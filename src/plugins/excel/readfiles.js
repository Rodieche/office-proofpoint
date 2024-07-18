import path from 'path';
import xlsx from 'xlsx';

const { utils, readFile } = xlsx;

export const getDataFromExcel = (fileName) => {

    const mypath = path.join(process.cwd(), 'output', fileName); 

    const file = readFile(mypath);

    let data = [];

    const sheets = file.SheetNames 
    
    for(let i = 0; i < sheets.length; i++) 
    { 
    const temp = utils.sheet_to_json( 
        file.Sheets[file.SheetNames[i]]) 
        temp.forEach((res) => { 
        data.push(res) 
    }) 
    } 
    
    return data;
}