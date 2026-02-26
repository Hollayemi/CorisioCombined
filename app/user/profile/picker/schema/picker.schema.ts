import * as yup from "yup";

const ValidateNewPicker = yup.object().shape({
  name: yup.string().required("Full Name is Required"),
  relationship: yup.string().required("Relationship is Required"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email Address is Required"),
  phone: yup
    .string()
    .min(11, ({ min }: any) => `Phone Number must have ${min} characters`)
    .max(13, ({ max }: any) => `Phone Number must have ${max} characters`)
    .required("Phone Number is required"),
});

export default ValidateNewPicker;
