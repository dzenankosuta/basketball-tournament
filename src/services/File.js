import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from './Logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __baseDir = process.env.PWD;

export function loadGroups() {
    const dataPath = path.join(__dirname, '../../data/groups.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const groups = JSON.parse(jsonData);
    return groups;
}

export function saveResultsToFile(filename, data) {
    const filePath = path.join(__dirname, `../../results/${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    Logger.info(`Results saved to ${filename}.json`);
}
