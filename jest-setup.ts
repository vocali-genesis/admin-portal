// Enable translations
import "@/core/i18n";

window.open = () => {
  return null;
};

/**
 * Global Mocks
 */
// Router
export const RouterMock = { push: jest.fn };
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue(RouterMock),
}));
// Toast
export const ToastMock = { success: jest.fn, error: jest.fn };
jest.mock("react-hot-toast", () => ToastMock);
