import AsyncStorage from "@react-native-async-storage/async-storage";
import toaster from "../../../../configs/toaster";
import "toasted-notes/src/styles.css";

interface ErrorData {
  data?: {
    errors?: { code: string }[];
    message?: string;
  };
}

const redirect = async () => {
  await AsyncStorage.setItem("user_token", "");
  await AsyncStorage.setItem("store_token", "");
  toaster({ type: "error", message: "Redirecting to Login" });
  setTimeout(() => (window.location.href = "/login"), 1000);
};

const handleResponseError = (error: ErrorData) => {
  if (error?.data) {
    const { errors, message } = error.data;

    if (message) {
      toaster({ message, type: "error" });
      if (message === "token_expired") {
        redirect();
      }
    }
    if (errors && Array.isArray(errors)) {
      errors.forEach((error) => {
        // toaster.notify(error.code, {
        //   duration: 4000,
        //   position: "bottom",
        // });
      });
    }
  }
};

export default handleResponseError;
