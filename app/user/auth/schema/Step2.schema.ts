import * as yup from "yup";

const Step2ValidationSchema: yup.ObjectSchema<{}, yup.AnyObject, {}, ""> = yup
  .object()
  .shape({
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

export default Step2ValidationSchema;
