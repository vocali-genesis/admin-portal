import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import coreEn from "@/core/langs/en.json";
import coreEs from "@/core/langs/es.json";
import coreCa from "@/core/langs/ca.json";
import corePT from "@/core/langs/pt.json";
import { ModuleManager } from "./module/module.manager";

/**
 * Load all the langs of the selected modules
 */
const finalLangs = ModuleManager.get().components.langs.reduce(
  (lang, item) => {
    Object.keys(lang).forEach(
      (langCode) => (lang[langCode] = { ...lang[langCode], ...item[langCode] })
    );
    return lang;
  },
  { en: coreEn, es: coreEs, ca: coreCa, pt: corePT } as Record<
    string,
    Record<string, object>
  >
);

console.log({ langs: ModuleManager.get().components.langs });

const resources = Object.keys(finalLangs).reduce(
  (lang, langCode) => ({
    ...lang,
    [langCode]: { translation: finalLangs[langCode] },
  }),
  {}
);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
