import toast from "react-hot-toast";
import { FunctionsError, FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";
import i18n from 'i18next';

class MessageHandler {
  private static instance: MessageHandler = new MessageHandler();
  public static get() {
    return this.instance;
  }
  private constructor() {}
  handleError(error: string) {
    if (error.includes("Failed to fetch")) {
      toast.error(i18n.t("common.Connection error"));
      return;
    }
    toast.error(error || "An unexpected error occurred");
  }

  handleSuccess(message: string) {
    toast.success(message || "Success");
  }

  info(message: string) {
    toast(message || "Success");
  }

  async handleEdgeFunctionError(error: unknown) {
    try {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        throw new Error(errorMessage?.message || "Unknown HTTP error occurred");
      } else if (error instanceof FunctionsRelayError) {
        throw new Error(error.message || "Relay error occurred");
      } else if (error instanceof FunctionsFetchError) {
        throw new Error(error.message || "Fetch error occurred");
      } else {
        throw new Error("An unexpected error occurred");
      }
    } catch (err: any) {
      this.handleError(err.message || String(err));
    }
  }

}

export default MessageHandler;
