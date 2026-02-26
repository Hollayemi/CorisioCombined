import * as yup from "yup";

const changeEmailSchema = yup.object().shape({
    password: yup
        .string()
        .min(8, ({ min }: any) => `Password must be at least ${min} characters`)
        .required("Password is required"),
    email: yup
        .string()
        .email("Please enter valid email")
        .required("New email Address is Required"),
    confirmEmail: yup
        .string()
        .email("Please enter valid email")
        .oneOf([yup.ref("email")], "Your emails does not must match")
        .required("Confirm your email Address"),
});

export default changeEmailSchema;
