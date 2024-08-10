// Enable translations
import "@/core/i18n";

window.open = () => {
  return null;
};

/**
 * Global Mocks
 */
// Router
export const RouterMock = {
  push: jest.fn,
  replace: jest.fn,
  query: { slug: "" },
  isReady: true,
};
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue(RouterMock),
}));
// Toast
export const ToastMock = { success: jest.fn, error: jest.fn };
jest.mock("react-hot-toast", () => ToastMock);
// i18n

export const TranslationMock = {
  t: (str: string) => str,
  i18n: {
    language: "en",
    changeLanguage: () => new Promise(() => {}),
  },
};
jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return TranslationMock;
  },
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));
