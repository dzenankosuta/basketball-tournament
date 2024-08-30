import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "./Logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __baseDir = process.env.PWD;

export function loadJSONFile(filePath) {
  try {
    const fullPath = path.resolve(__baseDir, filePath);
    const jsonData = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    Logger.error(`Error loading JSON file from ${filePath}: ${error.message}`);
    throw error;
  }
}

export function saveJSONFile(filePath, data) {
  try {
    const fullPath = path.resolve(__baseDir, filePath);
    const dirPath = path.dirname(fullPath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
    Logger.info(`Data saved to ${filePath}`);
  } catch (error) {
    Logger.error(`Error saving JSON file to ${filePath}: ${error.message}`);
    throw error;
  }
}

export function loadGroups() {
  return loadJSONFile("data/groups.json");
}

export function saveResultsToFile(filename, data) {
  saveJSONFile(`results/${filename}.json`, data);
}
