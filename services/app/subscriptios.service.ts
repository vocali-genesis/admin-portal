import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

class SupabaseSubscriptionService {
  private static instance?: SupabaseSubscriptionService;
  private supabase: SupabaseClient;

  private constructor() {
    if (SupabaseSubscriptionService.instance) {
      throw new Error("SupabaseSubscriptionService instance already exists!");
    }
    SupabaseSubscriptionService.instance = this;
    // TODO: Once we fix the auth singleton we will remove this and use a single instance of supabase arcross the application
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  public static getInstance(): SupabaseSubscriptionService {
    if (!SupabaseSubscriptionService.instance) {
      new SupabaseSubscriptionService();
    }
    return SupabaseSubscriptionService.instance!;
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

export default SupabaseSubscriptionService.getInstance();
