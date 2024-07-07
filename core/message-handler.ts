import toast from "react-hot-toast";
import { t } from "@/resources/utils/translate";

class MessageHandler {
  handleError(error: string): null {
    console.error("Error occurred:", error);

    toast.error(t(error || "An unexpected error occurred"));
    return null;
  }

  handleSuccess(message: string): null {
    console.log("Success!", message);

    toast.success(t(message || "Success"));
    return null;
  }

  info(message: string): null {
    console.log("Success!", message);

    toast(t(message || "Success"));
    return null;
  }
}

export default new MessageHandler();
