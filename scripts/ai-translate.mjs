import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const menuDataPath = path.resolve(__dirname, '../artifacts/digital-menu/src/data/menuData.json');

const rawData = fs.readFileSync(menuDataPath, 'utf8');
const menuData = JSON.parse(rawData);

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  console.error("Please set GEMINI_API_KEY environment variable");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const newLangCode = process.argv[2];
const newLangName = process.argv[3];

const targetLanguagesText = newLangCode && newLangName
  ? `${newLangName} (${newLangCode})`
  : `Spanish (es), Portuguese (pt), French (fr), and German (de)`;

// Output struct constraints
const titleDescFormat = newLangCode ? `"${newLangCode}": "..."` : `"es": "...", "pt": "...", "fr": "...", "de": "..."`;
const ingredientsFormat = newLangCode ? `"${newLangCode}": ["..."]` : `"es": ["..."], "pt": ["..."], "fr": ["..."], "de": ["..."]`;

async function translateItems() {
  console.log(`Starting translation for ${menuData.length} items to ${newLangCode ? newLangName : 'default languages'}...`);

  // Create chunks of 30 items to significantly reduce the number of API requests
  // This helps avoid the free tier "15 requests per minute" rate limit
  const chunkSize = 30;
  for (let i = 0; i < menuData.length; i += chunkSize) {
    const chunk = menuData.slice(i, i + chunkSize);
    console.log(`Translating chunk ${i / chunkSize + 1} of ${Math.ceil(menuData.length / chunkSize)}...`);

    // Prepare input JSON for this chunk
    const chunkInput = chunk.map(item => ({
      id: item.id,
      title: item.title?.en || item.title || "",
      description: item.description?.en || item.description || "",
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : (item.ingredients?.en || [])
    }));

    const prompt = `You are a professional culinary translator specialized in Peruvian cuisine.
Your task is to translate the title, description, and ingredients of the following menu items into ${targetLanguagesText}.
Make sure culinary terms are localized properly (e.g. 'Aji amarillo' can be kept as 'Aji amarillo' with context if needed, or properly translated if a standard translation exists).
Return ONLY a valid JSON array matching the exact structure below. Do not add markdown formatting like \`\`\`json.
Input:
${JSON.stringify(chunkInput, null, 2)}

Required output structure for each item in the array:
[
  {
    "id": same as input id,
    "title": { ${titleDescFormat} },
    "description": { ${titleDescFormat} },
    "ingredients": {
      ${ingredientsFormat}
    }
  }
]
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      });

      let responseText = response.text || "";
      const translatedChunk = JSON.parse(responseText);

      // Update original menuData safely by merging objects so we don't overwrite existing languages
      for (const translated of translatedChunk) {
        const index = menuData.findIndex(item => item.id === translated.id);
        if (index !== -1) {
          if (typeof menuData[index].title === 'string') {
            menuData[index].title = { en: menuData[index].title };
          }
          if (typeof menuData[index].description === 'string') {
            menuData[index].description = { en: menuData[index].description };
          }
          if (Array.isArray(menuData[index].ingredients)) {
            menuData[index].ingredients = { en: menuData[index].ingredients };
          }

          Object.assign(menuData[index].title, translated.title);
          Object.assign(menuData[index].description, translated.description);
          Object.assign(menuData[index].ingredients, translated.ingredients);
        }
      }

      // Save progressively in case it crashes
      fs.writeFileSync(menuDataPath, JSON.stringify(menuData, null, 4), 'utf8');

    } catch (e) {
      console.error(`Failed to handle chunk ${i / chunkSize + 1}:`, e.message);
    }

    // Delay 5 seconds between chunks to strictly respect the RPM limits
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log("Translation complete!");
}

translateItems();
