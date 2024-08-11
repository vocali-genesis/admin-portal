import { Mock } from "node:test";
// Enable translations
import "@/core/i18n";

/**
 * Global Mocks
 */
URL.createObjectURL = jest.fn(() => "");

// Router
export const RouterMock = {
  push: jest.fn(),
  replace: jest.fn(),
  query: { slug: "" },
  isReady: true,
};
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue(RouterMock),
}));
// Toast -- Is a default function and a object at the same time
export const ToastMock = jest.fn() as Mock & { success: Mock; error: Mock };
ToastMock.success = jest.fn();
ToastMock.error = jest.fn();

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

// Media
export const MediaDevicesMock = {
  getUserMedia: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  enumerateDevices: jest.fn().mockReturnValue([]),
};

Object.defineProperty(global.navigator, "mediaDevices", {
  value: MediaDevicesMock,
});

// Window
window.open = jest.fn();
const mockResponse = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    assign: mockResponse,
  },
  writable: true,
});
