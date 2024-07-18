import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const { utils, writeFile, readFile } = xlsx;

export const updateExcelSheet = (data, fileName=`Mailboxes-proofpoint.xlsx`) => {
    const mypath = path.join(process.cwd(), 'output', fileName); 
    const workbook = readFile(mypath);
    const newSheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, newSheet, "Proofpoint_Aliases");
    // utils.sheet_add_json(workbook.Sheets["Aliases"], data);
    writeFile(workbook, mypath)
}