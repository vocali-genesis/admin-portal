import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoreComponent, GlobalCore } from "@/core/module/module.types";
import "./index";
import "@/services/auth/auth-mock.service";
import { AuthService } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";
import { RouterMock, ToastMock, TranslationMock } from "@/jest-setup";
import MessageHandler from "@/core/message-handler";
import React from "react";

const getInput = (container: HTMLElement, inputName: string) => {
  return container.querySelector(`input[name="${inputName}"]`) as Element;
};
describe("=====  SAAS LOGIN =====", () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = GlobalCore.manager.getComponent(
      "service",
      "oauth"
    ) as AuthService;
  });

  describe("Login Page", () => {
    let Login: CoreComponent;
    beforeAll(() => {
      const LoginComponent = GlobalCore.manager.getComponent("auth", "login");
      expect(LoginComponent).not.toBeUndefined();
      Login = LoginComponent as CoreComponent;
    });
    it("Login is Mounted", () => {
      const { container } = render(<Login />);

      expect(getInput(container, "email")).not.toBeNull();
      expect(getInput(container, "password")).not.toBeNull();

      expect(screen.getByText("auth.forgot-password")).toHaveAttribute(
        "href",
        "/auth/reset-password"
      );
      expect(screen.getByTestId("submitLogin")).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "auth.register" })
      ).toHaveAttribute("href", "/auth/register");
    });

    it("Login SSO Google", async () => {
      const url = faker.internet.url();
      jest
        .spyOn(authService, "oauth")
        .mockReturnValueOnce(Promise.resolve(url));
      jest.spyOn(window, "open");
      render(<Login />);

      const googleButton = screen.getByTestId("google");
      googleButton.click();

      await waitFor(() => expect(window.open).toHaveBeenCalledWith(url));
    });

    it("Login Fields are required", async () => {
      render(<Login />);

      act(() => screen.getByTestId("submitLogin").click());

      await waitFor(() => {
        expect(screen.getByText("auth.email-required")).toBeInTheDocument();
        expect(
          screen.getByText("auth.password-min-length")
        ).toBeInTheDocument();
      });
      //
    });

    it("Login Fields are invalid", async () => {
      const { container } = render(<Login />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");

      // Makes the form dirty
      act(() => screen.getByTestId("submitLogin").click());

      await userEvent.type(emailInput, "wrong-email");
      await userEvent.type(passwordInput, "123");

      await waitFor(() => {
        expect(
          screen.getByText("auth.invalid-email-format")
        ).toBeInTheDocument();
        expect(
          screen.getByText("auth.password-min-length")
        ).toBeInTheDocument();
      });
    });

    it("Login Success full", async () => {
      const spy = jest.spyOn(RouterMock, "push");

      const { container } = render(<Login />);

      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");

      await userEvent.type(emailInput, faker.internet.email());
      await userEvent.type(
        passwordInput,
        faker.internet.password({ length: 10 })
      );

      act(() => screen.getByTestId("submitLogin").click());

      await waitFor(() => expect(spy).toHaveBeenCalledWith("/app/dashboard"));
    });

    it("Login User don't exists", async () => {
      jest.spyOn(authService, "loginUser").mockImplementationOnce(() => {
        MessageHandler.get().handleError("User Don`t exists");
        return Promise.resolve(null);
      });
      const toastSpy = jest.spyOn(ToastMock, "error");

      const { container } = render(<Login />);

      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");

      await userEvent.type(emailInput, faker.internet.email());
      await userEvent.type(
        passwordInput,
        faker.internet.password({ length: 10 })
      );

      act(() => screen.getByTestId("submitLogin").click());
      await waitFor(() =>
        expect(toastSpy).toHaveBeenCalledWith("User Don`t exists")
      );
    });
  });

  describe("Reset Password Page", () => {
    let ResetPassword: CoreComponent;
    beforeAll(() => {
      ResetPassword = GlobalCore.manager.getComponent(
        "auth",
        "reset-password"
      ) as CoreComponent;
      expect(ResetPassword).not.toBeUndefined();
    });
    it("Reset Password is Mounted", () => {
      const { container } = render(<ResetPassword />);

      expect(getInput(container, "email")).not.toBeNull();
      expect(screen.getByTestId("resetPassword")).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "auth.register" })
      ).toHaveAttribute("href", "/auth/register");
    });

    it("Reset Password Fields are required", async () => {
      render(<ResetPassword />);

      act(() => screen.getByTestId("resetPassword").click());

      await waitFor(() => {
        expect(screen.getByText("auth.email-required")).toBeInTheDocument();
      });
      //
    });

    it("Reset Password Fields are invalid", async () => {
      const { container } = render(<ResetPassword />);
      const emailInput = container.querySelector(
        'input[name="email"]'
      ) as Element;

      // Makes the form dirty
      act(() => screen.getByTestId("resetPassword").click());

      await userEvent.type(emailInput, "wrong-email");

      await waitFor(() => {
        expect(
          screen.getByText("auth.invalid-email-format")
        ).toBeInTheDocument();
      });
    });

    it("Reset Password Success full", async () => {
      const spy = jest.spyOn(RouterMock, "push");
      const toastSpy = jest.spyOn(ToastMock, "success");

      const { container } = render(<ResetPassword />);

      const emailInput = container.querySelector(
        'input[name="email"]'
      ) as Element;

      await userEvent.type(emailInput, faker.internet.email());

      act(() => screen.getByTestId("resetPassword").click());

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith("/auth/login");
        expect(toastSpy).toHaveBeenCalledTimes(1);
      });
    });

    it("Reset Password Email not found", async () => {
      jest.spyOn(authService, "resetPassword").mockImplementationOnce(() => {
        MessageHandler.get().handleError("Email Not Found");
        return Promise.resolve(false);
      });

      const toastSpy = jest.spyOn(ToastMock, "error");

      const { container } = render(<ResetPassword />);
      const emailInput = container.querySelector(
        'input[name="email"]'
      ) as Element;

      await userEvent.type(emailInput, faker.internet.email());

      act(() => screen.getByTestId("resetPassword").click());
      await waitFor(() =>
        expect(toastSpy).toHaveBeenCalledWith("Email Not Found")
      );
    });
  });

  describe("Registration Page", () => {
    let Register: CoreComponent;
    beforeAll(() => {
      const RegisterComponent = GlobalCore.manager.getComponent(
        "auth",
        "register"
      );
      expect(RegisterComponent).not.toBeUndefined();
      Register = RegisterComponent as CoreComponent;
    });

    it("Register is Mounted", () => {
      const { container } = render(<Register />);

      expect(getInput(container, "email")).not.toBeNull();
      expect(getInput(container, "password")).not.toBeNull();
      expect(getInput(container, "confirm_password")).not.toBeNull();

      expect(screen.getByText("auth.login")).toHaveAttribute(
        "href",
        "/auth/login"
      );
      expect(screen.getByTestId("submitRegistration")).toBeInTheDocument();
    });

    it("Register SSO Google", async () => {
      const url = faker.internet.url();
      jest
        .spyOn(authService, "oauth")
        .mockReturnValueOnce(Promise.resolve(url));
      jest.spyOn(window, "open");
      render(<Register />);

      const googleButton = screen.getByTestId("google");
      googleButton.click();

      await waitFor(() => expect(window.open).toHaveBeenCalledWith(url));
    });

    it("Register Fields are required", async () => {
      render(<Register />);

      act(() => screen.getByTestId("submitRegistration").click());

      await waitFor(() => screen.getByText("auth.email-required"));

      expect(screen.getByText("auth.email-required")).toBeInTheDocument();
      expect(screen.getByText("auth.password-min-length")).toBeInTheDocument();
      expect(
        screen.getByText("auth.confirm-password-required")
      ).toBeInTheDocument();
    });

    it("Register Fields are invalid", async () => {
      const { container } = render(<Register />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");
      const confirmPassword = getInput(container, "confirm_password");

      // Makes the form dirty
      act(() => screen.getByTestId("submitRegistration").click());

      await userEvent.type(emailInput, "wrong-email");
      await userEvent.type(passwordInput, "123");
      await userEvent.type(confirmPassword, "Different");

      await waitFor(() => screen.getByText("auth.invalid-email-format"));

      expect(screen.getByText("auth.invalid-email-format")).toBeInTheDocument();
      expect(screen.getByText("auth.password-min-length")).toBeInTheDocument();
      expect(screen.getByText("auth.password-dont-match")).toBeInTheDocument();
    });

    it("Register Successful", async () => {
      const spy = jest.spyOn(RouterMock, "push");

      const { container } = render(<Register />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");
      const confirmPassword = getInput(container, "confirm_password");

      const password = faker.internet.password({ length: 10 });
      await userEvent.type(emailInput, faker.internet.email());
      await userEvent.type(passwordInput, password);
      await userEvent.type(confirmPassword, password);

      act(() => screen.getByTestId("submitRegistration").click());

      await waitFor(() => expect(spy).toHaveBeenCalledWith("/auth/login"));
    });

    it("Register User already registered", async () => {
      jest.spyOn(authService, "registerUser").mockImplementationOnce(() => {
        MessageHandler.get().handleError("User already registered");
        return Promise.resolve(null);
      });
      const toastSpy = jest.spyOn(ToastMock, "error");

      const { container } = render(<Register />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");
      const confirmPassword = getInput(container, "confirm_password");

      const password = faker.internet.password({ length: 10 });
      await userEvent.type(emailInput, faker.internet.email());
      await userEvent.type(passwordInput, password);
      await userEvent.type(confirmPassword, password);

      act(() => screen.getByTestId("submitRegistration").click());
      await waitFor(() =>
        expect(toastSpy).toHaveBeenCalledWith("User already registered")
      );
    });
  });

  describe("Update Settings", () => {
    let Settings: CoreComponent;
    beforeAll(() => {
      const SettingsComponent = GlobalCore.manager.getComponent(
        "settings",
        "settings"
      );
      expect(SettingsComponent).not.toBeUndefined();
      Settings = SettingsComponent as CoreComponent;

      authService.loginUser();
    });

    afterAll(() => {
      authService.logout();
    });

    it("Register is Mounted", () => {
      const { container } = render(<Settings />);

      expect(getInput(container, "email")).not.toBeNull();
      expect(getInput(container, "password")).not.toBeNull();
      expect(getInput(container, "confirm_password")).not.toBeNull();

      expect(screen.getByTestId("updateSettings")).toBeInTheDocument();

      expect(container.querySelector('select[name="language"]')).not.toBeNull();
    });

    it.skip("Rovoke SSO Google", async () => {});

    it("Update Settings Fields are required", async () => {
      render(<Settings />);

      act(() => screen.getByTestId("updateSettings").click());

      await waitFor(() => screen.getByText("auth.email-required"));

      expect(screen.getByText("auth.email-required")).toBeInTheDocument();
      expect(screen.getByText("auth.password-min-length")).toBeInTheDocument();
      expect(
        screen.getByText("auth.confirm-password-required")
      ).toBeInTheDocument();
    });

    it("Update Settings Fields are invalid", async () => {
      const { container } = render(<Settings />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");
      const confirmPassword = getInput(container, "confirm_password");

      // Makes the form dirty
      act(() => screen.getByTestId("updateSettings").click());
      await act(async () => {
        await userEvent.type(emailInput, "wrong-email");
        await userEvent.type(passwordInput, "123");
        await userEvent.type(confirmPassword, "Different");
      });

      await waitFor(() => screen.getByText("auth.invalid-email-format"));

      expect(screen.getByText("auth.invalid-email-format")).toBeInTheDocument();
      expect(screen.getByText("auth.password-min-length")).toBeInTheDocument();
      expect(screen.getByText("auth.password-dont-match")).toBeInTheDocument();
    });

    it("Update Settings Successful", async () => {
      const toastSpy = jest.spyOn(ToastMock, "success");

      const { container } = render(<Settings />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");
      const confirmPassword = getInput(container, "confirm_password");

      const password = faker.internet.password({ length: 10 });
      await act(async () => {
        await userEvent.type(emailInput, faker.internet.email());
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPassword, password);

        screen.getByTestId("updateSettings").click();
      });

      expect(toastSpy).toHaveBeenCalledTimes(1);
    });

    it("Update Settings Api Error", async () => {
      jest.spyOn(authService, "updateUser").mockImplementationOnce(() => {
        MessageHandler.get().handleError("Error Updating the user");
        return Promise.resolve(null);
      });
      const toastSpy = jest.spyOn(ToastMock, "error");

      const { container } = render(<Settings />);
      const emailInput = getInput(container, "email");
      const passwordInput = getInput(container, "password");
      const confirmPassword = getInput(container, "confirm_password");

      const password = faker.internet.password({ length: 10 });
      await act(async () => {
        await userEvent.type(emailInput, faker.internet.email());
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPassword, password);

        screen.getByTestId("updateSettings").click();
      });
      await waitFor(() =>
        expect(toastSpy).toHaveBeenCalledWith("Error Updating the user")
      );
    });

    it("Select Language Change", async () => {
      const { container } = render(<Settings />);

      const langSpy = jest.spyOn(TranslationMock.i18n, "changeLanguage");
      const select = container.querySelector(
        'select[name="language"]'
      ) as Element;

      await act(async () => {
        await userEvent.selectOptions(select, "es");
      });
      expect(langSpy).toHaveBeenCalledWith("es");

      await act(async () => {
        await userEvent.selectOptions(select, "ca");
      });
      expect(langSpy).toHaveBeenCalledWith("ca");

      await act(async () => {
        await userEvent.selectOptions(select, "pt");
      });
      expect(langSpy).toHaveBeenCalledWith("pt");

      await act(async () => {
        await userEvent.selectOptions(select, "en");
      });
      expect(langSpy).toHaveBeenCalledWith("en");
    });
  });
});
