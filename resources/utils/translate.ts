import { createIntl, createIntlCache, IntlShape } from "react-intl";

let currentLocale = "en"; // default locale
let intl: IntlShape;

// Create a cache for the Intl provider
const cache = createIntlCache();

const initIntl = (locale: string, messages: any) => {
  currentLocale = locale;
  intl = createIntl({ locale, messages }, cache);
};

const t = (id: string, values?: Record<string, any>): string => {
  if (!intl) {
    throw new Error("Intl is not initialized. Call setLocale first.");
  }
  return intl.formatMessage({ id }, values);
};

const setLocale = (locale: string, messages: any) => {
  initIntl(locale, messages);
};

export { t, setLocale };
