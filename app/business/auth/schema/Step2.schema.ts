import * as yup from "yup";

const Step2ValidationSchema = yup.object().shape({
  fullname: yup.string().required("Full Name Name is Required"),
  username: yup.string().required("Username is Required"),
  email: yup
    .string()
    .required("Email Address is Required")
    .email("Please enter valid email"),
 
});

export default Step2ValidationSchema;
