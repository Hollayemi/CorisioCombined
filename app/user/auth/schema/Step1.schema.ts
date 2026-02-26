import * as yup from "yup";

const Step1ValidationSchema = yup.object().shape({
  fullname: yup.string().required("Full Name is Required"),
  username: yup.string().required("Username is Required"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email Address is Required"),
  phoneNumber: yup
    .string()
    .min(11, ({ min }: any) => `Phone Number must have ${min} characters`)
    .max(13, ({ max }: any) => `Phone Number must have ${max} characters`)
    .required("Phone Number is required"),
});

export default Step1ValidationSchema;
