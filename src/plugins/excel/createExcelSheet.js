import fs from 'fs';
import path from 'path';
import { utils, writeFile } from 'xlsx';

export const createExcelSheet = (companyName, data) => {
    const outputDir = path.join(process.cwd(), 'output');

    // Check if the directory exists, if not create it
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const newBook = utils.book_new();
    const newSheet = utils.json_to_sheet(data);
    utils.book_append_sheet(newBook, newSheet, "Proofpoint");
    writeFile(newBook, path.join(outputDir, `${companyName}_digest.xlsx`));

    return;
};
