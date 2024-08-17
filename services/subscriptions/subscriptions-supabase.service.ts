import { GenesisInvoice, SubscriptionResponse } from "@/core/module/core.types";
import { SubscriptionService } from "@/core/module/services.types";
import {
  createClient,
  FunctionsFetchError,
  FunctionsRelayError,
  SupabaseClient,
} from "@supabase/supabase-js";
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
  public async getSubscriptionLink(): Promise<{ url: string | undefined }> {
    try {
      const { data, error } = await this.supabase.functions.invoke<{
        checkoutUrl: string | undefined;
      }>("stripe-create-subscription");
      if (!error && data?.checkoutUrl) {
        return { url: data?.checkoutUrl }
      }
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        throw errorMessage?.message;
      } else if (error instanceof FunctionsRelayError) {
        throw error?.message;
      } else if (error instanceof FunctionsFetchError) {
        throw error?.message;
      }
      throw "Something went wrong!";
    } catch (error) {
      messageHandler.handleError(error?.message || error);
      return { url: undefined };
    }
  }

    /**
   * retruns the manage subscription link, so that the user can manage their subscription
   */
    public async getManageSubscriptionLink(): Promise<{ url: string | undefined }> {
      try {
        const { data, error } = await this.supabase.functions.invoke<{
          manageUrl: string | undefined;
        }>("stripe-manage-subscription");
        if (!error && data?.manageUrl) {
          return { url: data?.manageUrl }
        }
        if (error instanceof FunctionsHttpError) {
          const errorMessage = await error.context.json();
          throw errorMessage?.message;
        } else if (error instanceof FunctionsRelayError) {
          throw error?.message;
        } else if (error instanceof FunctionsFetchError) {
          throw error?.message;
        }
        throw "Something went wrong!";
      } catch (error) {
        messageHandler.handleError(error?.message || error);
        return { url: undefined };
      }
    }

  /**
   * Cancels the current active subscription and returns the subscription data
   */
  public async cancelSubscription(): Promise<Record<string, string | number>> {
    try {
      const { data, error } = await this.supabase.functions.invoke(
        "cancel-subscription"
      );
      if (!error) {
        return data?.data as Record<string, string | number>;
      }
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        throw errorMessage?.message;
      } else if (error instanceof FunctionsRelayError) {
        throw error?.message;
      } else if (error instanceof FunctionsFetchError) {
        throw error?.message;
      }
      throw "Something went wrong!";
    } catch (error) {
      messageHandler.handleError(error?.message || error);
      return {};
    }
  }

  /**
   * Retruns the currently active user subscription, so that the users can subscribe to a plan
   */
  public async getActiveSubscription(): Promise<SubscriptionResponse | null> {
    const { data, error } = await this.supabase
      .from("subscriptions")
      .select(
        "id, subscription_id, status, current_period_start, current_period_end"
      )
      .gt("current_period_end", new Date().toISOString());
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
