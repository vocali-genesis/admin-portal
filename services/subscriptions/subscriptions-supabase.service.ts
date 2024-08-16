import { GenesisInvoice, SubscriptionResponse } from "@/core/module/core.types";
import { SubscriptionService } from "@/core/module/services.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";
import { GlobalCore } from "@/core/module/module.types";
import { FunctionsHttpError } from "@supabase/supabase-js";

const messageHandler = MessageHandler.get();

class SubscriptionSupabase implements SubscriptionService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * retruns the subscription link, so that the users can subscribe to a plan
   */
  public async getSubscriptionLink(): Promise<{ url: string | null }> {
    const { data, error } = await this.supabase.functions.invoke(
      "stripe-create-subscription"
    );
    if (error && error instanceof FunctionsHttpError) {
      const errorResponse = await error.context.json();
      messageHandler.handleError(errorResponse.message);
      return { url: null };
    }
    return { url: data?.checkoutUrl };
  }

  /**
   * Retruns the currently active user subscription, so that the users can subscribe to a plan
   */
  public async getActiveSubscription(): Promise<SubscriptionResponse | null> {
    const { data, error } = await this.supabase
      .from("subscriptions")
      .select(
        "subscription_id, status, current_period_start, current_period_end"
      );
    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }
    return data[0];
  }

  /**
   * Retruns the payment invoices of the loggedin user
   */
  public async getInvoices(
    from: number,
    to: number
  ): Promise<{ invoices: [GenesisInvoice] | []; count: number }> {
    const { data: invoices, error } = await this.supabase
      .from("invoices")
      .select("*")
      .range(from, to);
    if (error) {
      messageHandler.handleError(error.message);
      return { invoices: [], count: 0 };
    }
    const { count = 0 } = await this.supabase
      .from("invoices")
      .select("*", { count: "exact", head: true });
    return { invoices, count } as {
      invoices: [GenesisInvoice];
      count: number;
    };
  }
}

GlobalCore.manager.service("subscriptions", new SubscriptionSupabase());
