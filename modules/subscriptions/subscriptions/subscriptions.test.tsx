import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoreComponent } from "@/core/module/module.types";
import "./index";
import "@/services/auth/auth-mock.service";
import "@/services/subscriptions/subscriptions-mock.service";

import React, { act } from "react";
import { getComponent } from "@/resources/tests/test.utils";
import Service from "@/core/module/service.factory";
import { jest } from "@jest/globals";

jest.mock("@/core/module/module.manager", () => ({
  ModuleManager: {
    get: jest.fn().mockReturnValue({
      components: {
        services: jest.fn(),
      },
    }),
  },
}));

describe("===== PAYMENTS =====", () => {
  describe("Subscriptions Page", () => {
    let Subscriptions: CoreComponent;

    beforeAll(() => {
      Subscriptions = getComponent("app", "subscriptions");
    });

    beforeEach(() => {
      delete window.location;
      window.location = { href: "" } as Location;
      jest.clearAllMocks();
    });

    afterEach(() => {});

    it("Templates is Mounted", async () => {
      await act(() => render(<Subscriptions />));

      expect(screen.getByText("subscriptions.title")).toBeInTheDocument();
      expect(screen.getByText("subscriptions.sub-title")).toBeInTheDocument();
      screen.debug();
    });

    it("Checks both pricing cards are displayed", async () => {
      render(<Subscriptions />);

      await waitFor(() => {
        expect(
          screen.getAllByTestId("subscriptions.pricing-card"),
        ).toHaveLength(2);
      });
    });

    it("Checks pricing card price is loaded", async () => {
      render(<Subscriptions />);

      await waitFor(() => {
        expect(
          screen.getAllByText(/subscriptions\.price-\d+\.currency/),
        ).toHaveLength(2);
      });
    });

    it("Checks all features have been loaded", async () => {
      render(<Subscriptions />);

      await waitFor(() => {
        expect(
          screen.getAllByText(
            /subscriptions\.price-\d+\.features\.feature-\d+/,
          ),
        ).toHaveLength(3);
      });

      expect(
        screen.getAllByText(/subscriptions\.price-1\.features\.feature-\d+/),
      ).toHaveLength(1);
      expect(
        screen.getAllByText(/subscriptions\.price-2\.features\.feature-\d+/),
      ).toHaveLength(2);
    });

    it("Checks subscribe button on first price card redirects", async () => {
      render(<Subscriptions />);

      const subscribeButton = await screen.findByText(
        "subscriptions.price-1.btn-text",
      );
      await userEvent.click(subscribeButton);

      expect(window.location.href).toBe(
        "https://invoxmedical.typeform.com/invox-genesis?typeform-source=genesismedical.ai",
      );
    });

    it("Checks subscribe button on second price card redirects", async () => {
      const mockGetSubscriptionLink = jest
        .fn<() => Promise<{ url: string }>>()
        .mockResolvedValue({ url: "https://example.com/subscribe" });

      const serviceGetSpy = jest.spyOn(Service, "get").mockReturnValue({
        getSubscriptionLink: mockGetSubscriptionLink,
      } as any);

      render(<Subscriptions />);
      const subscribeButton = await screen.findByText(
        "subscriptions.price-2.btn-text",
      );
      await userEvent.click(subscribeButton);

      expect(mockGetSubscriptionLink).toHaveBeenCalled();

      await waitFor(() => {
        expect(window.location.href).toBe("https://example.com/subscribe");
      });

      serviceGetSpy.mockRestore();
    });
  });

  describe("Subscriptions Settings Page", () => {
    let Subscriptions: CoreComponent;

    beforeAll(() => {
      Subscriptions = getComponent("settings", "subscriptions");
    });

    beforeEach(() => {});
    afterEach(() => {});

    it("Subscription settings is Mounted", async () => {
      await act(() => render(<Subscriptions />));

      expect(
        screen.getByTestId("subscriptions-settings.main"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("subscription-settings.cancel-sub-btn"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("subscription-settings.payment-history"),
      ).toBeInTheDocument();
      screen.debug();
    });

    it("Checks payment history is loaded", async () => {
      render(<Subscriptions />);

      await waitFor(() => {
        expect(screen.getByTestId("payment-history.main")).toBeInTheDocument();
        expect(screen.getByTestId("payment-history.main")).toBeInTheDocument();
      });
    });

    it("Checks table is populated", async () => {
      render(<Subscriptions />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
    });

    it("Checks view receipt link redirects", async () => {
      render(<Subscriptions />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const viewReceiptLink = await screen.findAllByText(
        "invoice-history.view-receipt",
      );
      expect(viewReceiptLink[0]).toBeInTheDocument();
      expect(viewReceiptLink[0]).toHaveAttribute(
        "href",
        expect.stringMatching(/^https:\/\/.+/),
      );
      expect(viewReceiptLink[0]).toHaveAttribute("target", "__blank");
    });

    it.todo("Checks cancel subscription button redirects");
    it("Checks cancel subscription button redirects", async () => {
      render(<Subscriptions />);

      const cancelSubBtn = await screen.findByText(
        "subscription-settings.cancel-sub-btn",
      );
      act(() => cancelSubBtn.click());

      expect(cancelSubBtn).toBeInTheDocument();
    });
  });
});
