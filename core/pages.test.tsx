import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { GlobalCore } from "@/core/module/module.types";
import "@/services/auth/auth-mock.service";
import "@/services/subscriptions/subscriptions-mock.service";

import { AuthService } from "@/core/module/services.types";
import { RouterMock } from "@/jest-setup";
import React from "react";

import AppSlug from "@/pages/app/[slug]";
import SettingSlug from "@/pages/settings/[slug]";
import AuthSlug from "@/pages/auth/[slug]";

import { SubscriptionService } from "../../core/module/services.types";

describe("===== DYNAMIC PATHS =====", () => {
  let authService: AuthService;
  let subscriptionServices: SubscriptionService;

  beforeAll(() => {
    authService = GlobalCore.manager.getComponent(
      "service",
      "oauth"
    ) as AuthService;
    subscriptionServices = GlobalCore.manager.getComponent(
      "service",
      "subscriptions"
    ) as SubscriptionService;
  });

  describe("App Slug", () => {
    beforeAll(() => {
      GlobalCore.manager.app("demo", () => (
        <div>
          <span data-testid="demo">Demo</span>
        </div>
      ));
    });

    beforeEach(() => {
      jest.replaceProperty(RouterMock, "query", { slug: "demo" });
    });
    it("App is Mounted", async () => {
      render(<AppSlug />);
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("User not logged", async () => {
      const spy = jest.spyOn(RouterMock, "push");
      render(<AppSlug />);
      await waitFor(() => expect(spy).toHaveBeenCalledWith("/auth/login"));
    });

    it.skip("Login without subscription module", async () => {
      // Now is enable by default the mock one
    });
    it("User without subscription", async () => {
      authService.loginUser();
      jest
        .spyOn(subscriptionServices, "getActiveSubscription")
        .mockReturnValueOnce(Promise.resolve(null));

      const spy = jest.spyOn(RouterMock, "push");
      jest.replaceProperty(RouterMock, "query", { slug: "wrong-name" });

      render(<AppSlug />);

      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith("/app/subscriptions")
      );
    });

    it("App User with subscription expired", async () => {
      authService.loginUser();
      jest
        .spyOn(subscriptionServices, "getActiveSubscription")
        .mockReturnValueOnce(Promise.resolve({ status: "expired" }));

      const spy = jest.spyOn(RouterMock, "push");
      jest.replaceProperty(RouterMock, "query", { slug: "wrong-name" });

      render(<AppSlug />);

      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith("/app/subscriptions")
      );
    });

    it("App Component not found", async () => {
      authService.loginUser();
      const spy = jest.spyOn(RouterMock, "replace");
      jest.replaceProperty(RouterMock, "query", { slug: "wrong-name" });

      render(<AppSlug />);

      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith("/errors/not-found")
      );
    });

    it("App Load component successfully", async () => {
      authService.loginUser();

      render(<AppSlug />);

      await waitFor(() =>
        expect(screen.getByTestId("demo")).toBeInTheDocument()
      );
    });

    it("App Load the menu", async () => {
      GlobalCore.manager.menu({
        label: "demo-menu",
        icon: "./public/user.svg",
        url: "/demo",
        order: 0,
      });
      authService.loginUser();
      const spy = jest.spyOn(RouterMock, "push");

      render(<AppSlug />);

      await waitFor(() =>
        expect(screen.getByTestId("demo")).toBeInTheDocument()
      );

      const item = screen.getByText("demo-menu");
      expect(item).toBeInTheDocument();
      act(() => item.click());

      expect(spy).toHaveBeenCalledWith("/demo");
    });
  });

  describe("Settings Slug", () => {
    beforeAll(() => {
      GlobalCore.manager.settings("demo", () => (
        <div>
          <span data-testid="demo">Demo</span>
        </div>
      ));
    });

    beforeEach(() => {
      jest.replaceProperty(RouterMock, "query", { slug: "demo" });
    });

    it("Settings is Mounted", async () => {
      render(<SettingSlug />);
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("Settings User not logged", async () => {
      authService.logout();
      const spy = jest.spyOn(RouterMock, "push");
      render(<SettingSlug />);
      await waitFor(() => expect(spy).toHaveBeenCalledWith("/auth/login"));
    });

    it("Settings Component not found", async () => {
      authService.loginUser();
      const spy = jest.spyOn(RouterMock, "replace");
      jest.replaceProperty(RouterMock, "query", { slug: "wrong-name" });

      render(<SettingSlug />);

      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith("/errors/not-found")
      );
    });

    it("Settings Load component successfully", async () => {
      authService.loginUser();

      render(<SettingSlug />);

      await waitFor(() =>
        expect(screen.getByTestId("demo")).toBeInTheDocument()
      );
    });

    it("Settings Load the menu", async () => {
      GlobalCore.manager.menuSettings({
        label: "demo-menu",
        icon: "./public/user.svg",
        url: "/demo",
      });
      authService.loginUser();
      const spy = jest.spyOn(RouterMock, "push");

      render(<SettingSlug />);

      await waitFor(() =>
        expect(screen.getByTestId("demo")).toBeInTheDocument()
      );

      const item = screen.getByText("demo-menu");
      expect(item).toBeInTheDocument();
      act(() => item.click());

      expect(spy).toHaveBeenCalledWith("/demo");
    });
  });

  describe("Auth Slug", () => {
    beforeAll(() => {
      GlobalCore.manager.auth("demo", () => (
        <div>
          <span data-testid="demo">Demo</span>
        </div>
      ));
    });

    beforeEach(() => {
      jest.replaceProperty(RouterMock, "query", { slug: "demo" });
    });

    it("Auth is Mounted", async () => {
      jest.replaceProperty(RouterMock, "isReady", false);
      render(<AuthSlug />);
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
      jest.replaceProperty(RouterMock, "isReady", true);
    });

    it("Auth Component not found", async () => {
      const spy = jest.spyOn(RouterMock, "replace");
      jest.replaceProperty(RouterMock, "query", { slug: "wrong-name" });

      render(<AuthSlug />);

      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith("/errors/not-found")
      );
    });

    it("AuthSlug Load component successfully", async () => {
      render(<AuthSlug />);

      await waitFor(() =>
        expect(screen.getByTestId("demo")).toBeInTheDocument()
      );
    });
  });
});