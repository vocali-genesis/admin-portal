// import toast from "react-hot-toast";

class MessageHandler {
  handleError(error: string): null {
    console.error("Error occurred:", error);
    // toast.error(error || "An unexpected error occurred");
    return null;
  }

  handleSuccess(message: string): null {
    console.log("Success!", message);
    // toast.success(message || "Success!");
    return null;
  }
}

export default new MessageHandler();
