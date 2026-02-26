import * as yup from "yup";

const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, ({ min }: any) => `Password must be at least ${min} characters`)
    .required("Old Password is required"),
  password: yup
    .string()
    .min(8, ({ min }: any) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(8, ({ min }: any) => `Confirm must be at least ${min} characters`)
    .oneOf([yup.ref("password")], "Your passwords does not must match")
    .required("Password confirmation is required"),
});

export default changePasswordSchema;
