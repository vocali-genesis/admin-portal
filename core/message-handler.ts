import toast from "react-hot-toast";
import {
  FunctionsError,
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";
// import i18n from "./i18n";

class MessageHandler {
  private static instance: MessageHandler = new MessageHandler();
  private t: (key: string) => string = (str) => str;
  public static get() {
    return this.instance;
  }
  private constructor() {
    // TODO: There is an import loop, so we load it dynamically
    import("i18next").then((i18n) => {
      this.t = i18n.t.bind(i18n);
    });
  }
  handleError(error: string) {
    if (error.includes("Failed to fetch")) {
      toast.error(this.t("errors.connection-error"));
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
