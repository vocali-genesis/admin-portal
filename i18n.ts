const fs = require("fs").promises;
const yargs = require("yargs");
const yup = require("yup");
const path = require("path");
const _ = require("lodash");
const { ChatGPTAPI } = require("fix-esm").require("chatgpt");
require("dotenv").config();
const DEFAULT_LANG = "en";

type Translation = Record<string, Record<string, string>>;
type MissingTranslations = Record<string, string[]>;

// Existing code...
const chatGPT = new ChatGPTAPI({
  apiKey: process.env.CHAT_GPT,
  completionParams: {
    temperature: 0.7,
    // max_tokens: 100,
    model: "gpt-3.5-turbo-0125", // Specify the cheapest engine here
  },
});

const config_schema = yup.object().shape({
  services: yup.array().of(yup.string()).required("Services Array required"),
  modules: yup.array().of(yup.string()).required("Modules Array required"),
});

async function readConfigJSON(jsonFilePath: string) {
  const data = await fs.readFile(jsonFilePath, "utf8");
  const jsonData = JSON.parse(data);
  try {
    config_schema.validateSync(jsonData);
    return jsonData;
  } catch (error) {
    console.error(
      "JSON Validation Error: " + (error as unknown as Error).message
    );
    return "";
  }
}

async function readLangJSON(langFolder: string, language: string) {
  try {
    const enData = await fs.readFile(
      path.join(langFolder, `${language}.json`),
      "utf8"
    );
    const jsonData = JSON.parse(enData);
    return jsonData;
  } catch (error) {
    console.error(
      "JSON Validation Error: " + (error as unknown as Error).message
    );
    return {};
  }
}

async function getMissingKeys({
  languages,
  langFolder,
  enData,
}: {
  languages: string[];
  langFolder: string;
  enData: Translation;
}) {
  const promises = languages.map(async (file) => {
    const langData = await readLangJSON(langFolder, file);
    return Object.keys(enData).reduce((acc, group) => {
      acc[group] = Object.keys(enData[group]).filter(
        (key) => !langData[group] || !(key in langData[group])
      );
      return acc;
    }, {} as MissingTranslations);
  });
  const missingKeysByLanguage = await Promise.all(promises);
  // Merge all missing keys from different languages into a single object without duplicates in a simpler way
  const missingKeys = missingKeysByLanguage.reduce((acc, languageKeys) => {
    for (const group in languageKeys) {
      acc[group] = _.uniq([...(acc[group] || []), ...languageKeys[group]]);
    }
    return acc;
  }, {} as MissingTranslations);

  // Return the list of languages that need translations, skipping those they dont
  const missingLanguages = languages.reduce((acc, lang, index) => {
    const hasMissingKeys =
      Object.values(missingKeysByLanguage[index]).flat().length > 0;
    // If has, add him, if not remove the item
    hasMissingKeys
      ? acc.push(lang)
      : (missingKeysByLanguage[index] =
          undefined as unknown as MissingTranslations);
    return acc;
  }, [] as string[]);

  return {
    missingKeys,
    missingKeysByLanguage: missingKeysByLanguage.filter((item) => !!item),
    missingLanguages,
  } as {
    missingKeys: MissingTranslations;
    missingKeysByLanguage: MissingTranslations[];
    missingLanguages: string[];
  };
}
async function compareLangFiles(modulesPath: string) {
  /**
   * Get the basic values and languages
   */
  const langFolder = path.join(modulesPath, "langs");
  const files = (await fs.readdir(langFolder)) as string[];
  const enData = (await readLangJSON(langFolder, DEFAULT_LANG)) as Translation;
  const languages = files
    .filter((file) => !file.includes(DEFAULT_LANG) && file.endsWith(".json"))
    .map((fileName) => fileName.replace(".json", ""));

  /**
   * Calculate the missing keys for each lang
   */
  const { missingKeys, missingKeysByLanguage, missingLanguages } =
    await getMissingKeys({ languages, langFolder, enData });

  // Collect all missing keys in English
  const inputData = generateSourceTranslation({ missingKeys, enData });
  if (!Object.keys(inputData).length) {
    console.info(`[${modulesPath}]: Nothing to translate`);
    return;
  }

  /**
   * Translate them with chat GPT (magic here)
   */
  const translations = await translateKeys({
    inputData,
    languages: missingLanguages,
  });
  if (!translations || !Object.keys(translations)) {
    return;
  }
  /**
   * Update the JSON files :D
   */
  const writePromises = missingLanguages.map(async (language, index) => {
    const missingKeys = missingKeysByLanguage[index];
    // IF is only 1 language, he will return the direct translation
    const langTranslation = translations[language] || translations;
    await updateLangFiles({
      translation: langTranslation,
      missingKeys,
      langFolder,
      language,
    });
  });

  await Promise.all(writePromises);
}

async function updateLangFiles({
  missingKeys,
  language,
  langFolder,
  translation,
}: {
  translation: Translation;
  missingKeys: MissingTranslations;
  language: string;
  langFolder: string;
}) {
  try {
    const langData = await readLangJSON(langFolder, language);
    for (const group in missingKeys) {
      missingKeys[group].forEach((key) => {
        if (!langData[group]) {
          langData[group] = {};
        }
        // Avoid to replace the values already written
        if (!langData[group][key]) {
          langData[group][key] = translation[group][key];
        }
      });
    }
    const updatedLangData = JSON.stringify(langData, null, 2);
    const file = `${langFolder}/${language}.json`;
    fs.writeFile(file, updatedLangData, "utf8");
    console.info(`Updated ${file}`);
  } catch (err) {
    console.error(`Error reading ${language}.json: ${err}`);
    console.error(err);
  }
}

/**
 * Matches the missing keys object with the translation in english
 */
function generateSourceTranslation({
  missingKeys,
  enData,
}: {
  missingKeys: MissingTranslations;
  enData: Translation;
}) {
  return Object.keys(missingKeys || {})
    .filter((group) => missingKeys[group].length)
    .reduce((acc, group) => {
      acc[group] = missingKeys[group].reduce((groupAcc, key) => {
        if (!groupAcc[key]) {
          groupAcc[key] = enData[group]?.[key];
        }
        return groupAcc;
      }, {} as Record<string, string>);
      return acc;
    }, {} as Translation);
}

async function translateKeys({
  inputData,
  languages,
}: {
  inputData: Translation;
  languages: string[];
}) {
  const inputJSON = JSON.stringify(inputData);
  const prompt = `I give you a JSON file in the language ${DEFAULT_LANG}, you need to translate them in the languages ${languages}. Return a JSON object where the first key is the language the, don\`t add extra words. The json is \n${inputJSON}`;
  console.time("gpt");

  // TODO: If the code is too big, we need to do a call per language
  const translation = (await chatGPT.sendMessage(prompt)) as {
    text: string;
    detail: { usage: object };
  };

  try {
    // Remove the header and footer
    const resultJSON = translation.text
      .replace(`\`\`\`json`, "")
      .replace(`\`\`\``, "");

    const result = JSON.parse(resultJSON) as Record<string, Translation>;
    // If is only a module, the IA ommits it on the JSON
    if (Object.keys(inputData).length === 1) {
      const key = Object.keys(inputData)[0];
      Object.keys(result).forEach((lang) => {
        // Here Chat GPT confused the type return
        const translations = result[lang] as unknown as Record<string, string>;
        delete result[lang];
        result[lang] = { [key]: translations } as Translation;
      });
    }
    console.log({ result: JSON.stringify(result, null, 4), inputJSON });
    return result;
  } catch (err) {
    console.info({ prompt, response: translation.text });
    console.error(err);
    return {};
  } finally {
    console.info({ usage: translation.detail.usage });
    console.timeEnd("gpt");
  }
}

async function main(jsonFilePath: string) {
  const jsonData = await readConfigJSON(jsonFilePath);

  await compareLangFiles("core");
  // We don`t use map, we go one by one for more control
  for (const modulePath of jsonData.modules) {
    await compareLangFiles(`modules/${modulePath}`);
  }
}

const argv = yargs
  .usage("Usage: $0 --file <path>")
  .demandOption(["file"])
  .describe("file", "Path to the JSON configuration file").argv;

main(argv.file);
