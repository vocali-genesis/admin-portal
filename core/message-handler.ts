import toast from "react-hot-toast";
import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";

class MessageHandler {
  private static instance: MessageHandler = new MessageHandler();
  public static get() {
    return this.instance;
  }
  private constructor() {}
  handleError(error: string) {
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
        throw errorMessage?.message;
      } else if (error instanceof FunctionsRelayError) {
        throw error?.message;
      } else if (error instanceof FunctionsFetchError) {
        throw error?.message;
      }
      throw "Something went wrong!";
    } catch (error) {
      this.handleError(error?.message || error);
    }
  }

}

export default MessageHandler;
