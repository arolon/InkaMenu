import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuDataPath = path.resolve(__dirname, '../artifacts/digital-menu/src/data/menuData.json');

const rawData = fs.readFileSync(menuDataPath, 'utf8');
const menuData = JSON.parse(rawData);

const migrateString = (str) => {
  return {
    en: str || "",
    es: str || "",
    pt: str || "",
    fr: str || "",
    de: str || ""
  };
};

const migratedData = menuData.map(item => {
  return {
    ...item,
    title: migrateString(item.title),
    description: migrateString(item.description)
  };
});

fs.writeFileSync(menuDataPath, JSON.stringify(migratedData, null, 4), 'utf8');
console.log('Successfully migrated menuData.json!');
