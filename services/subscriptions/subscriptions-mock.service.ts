import { GlobalCore } from "@/core/module/module.types";
import { faker } from "@faker-js/faker";
import {
  GenesisInvoice,
  SubscriptionResponse,
} from "../../core/module/core.types";
import moment from "moment";
import { Seed } from "@/resources/tests/seed";
import { SubscriptionService } from "@/core/module/services.types";

class SubscriptionsMock implements SubscriptionService {
  constructor() {}

  /**
   * retruns the subscription link, so that the users can subscribe to a plan
   */
  public async getSubscriptionLink(): Promise<{ url: string | null }> {
    return Promise.resolve({ url: faker.internet.url() });
  }

  /**
   * Retruns the currently active user subscription, so that the users can subscribe to a plan
   */
  public async getActiveSubscription(): Promise<SubscriptionResponse> {
    return Promise.resolve({
      status: "active",
      date: moment().add(1, "week").format(),
    });
  }

  /**
   * Retruns the payment invoices of the loggedin user
   */
  public async getInvoices(): Promise<{
    invoices: GenesisInvoice[];
    count: number;
  }> {
    const invoices = Seed.new().invoice().array(2);
    return Promise.resolve({
      invoices,
      count: invoices.length,
    });
  }
}

GlobalCore.manager.service("subscriptions", new SubscriptionsMock());
