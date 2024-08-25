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
  public async getSubscriptionLink(): Promise<{ url: string } | null> {
    return Promise.resolve({ url: faker.internet.url() });
  }

  /**
   * retruns the manage subscription link, so that the users can manage subscription on Stripe dashbaoard
   */
  public async getManageSubscriptionLink(): Promise<{ url: string } | null> {
    return Promise.resolve({ url: faker.internet.url() });
  }

  /**
   * retruns the manage subscription link, so that the users can manage subscription on Stripe dashbaoard
   */
  public async cancelSubscription(): Promise<Record<
    string,
    string | number
  > | null> {
    return Promise.resolve({ id: faker.string.uuid() });
  }

  /**
   * Retruns the currently active user subscription, so that the users can subscribe to a plan
   */
  public async getActiveSubscription(): Promise<SubscriptionResponse | null> {
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
