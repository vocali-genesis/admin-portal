import { SubscriptionService } from './../../core/module/services.types';
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";
import { GlobalCore } from "@/core/module/module.types";

const messageHandler = MessageHandler.get();

class SubscriptionSupabase implements SubscriptionService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }


  /**
   * getSubscriptionLink
   */
  public async getSubscriptionLink(): Promise<{ url: string | null }> {
    const { data, error } = await this.supabase.functions.invoke(
      "stripe-create-subscription"
    );
    if (error) {
      messageHandler.handleError(error.message);
      return { url: null };
    }
    return { url: data?.checkoutUrl };
  }
}

GlobalCore.manager.service('subscriptions', new SubscriptionSupabase())
