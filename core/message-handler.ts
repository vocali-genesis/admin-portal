import toast from "react-hot-toast";
 
class MessageHandler {
  private static instance: MessageHandler = new MessageHandler()
  public static get() {
    return this.instance
  }
  private constructor() {

  }
  handleError(error: string): null {
    toast.error(error || "An unexpected error occurred");
    return null;
  }

  handleSuccess(message: string): null {
    toast.success(message || "Success");
    return null;
  }

  info(message: string): null {
    toast(message || "Success");
    return null;
  }
}

export default MessageHandler;
