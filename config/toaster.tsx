import { Toast } from "toastify-react-native";

interface ToasterProps {
  message: string;
  type: "error" | "success";
}

const toaster = ({ message, type }: ToasterProps): void => {
  if (type === "error") {
    Toast.error(message, "top");
  } else if (type === "success") {
    Toast.success(message);
  }
};

export default toaster;
