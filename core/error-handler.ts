// import toast from "react-hot-toast";

export default (error: string): null => {
  console.error("Error occurred:", error);
  // toast.error(error || "An unexpected error occurred");
  return null;
};
