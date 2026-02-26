import * as yup from "yup";

const ForgetPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email Address is Required"),
});

export default ForgetPasswordValidationSchema;
