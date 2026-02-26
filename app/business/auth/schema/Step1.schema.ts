import * as yup from "yup";

const Step1ValidationSchema = yup.object().shape({
  businessName: yup.string().required("Business Name is Required"),
  store: yup.string().required("Store Handle is Required"),
  businessEmail: yup
    .string()
    .optional()
    .email("Please enter valid email"),
    businessLine: yup
    .string()
    .optional()
    .min(10, ({ min }: any) => `Phone number must have minimum ${min} characters`)
    .max(11, ({ max }: any) => `Phone Nnmber must have maximum ${max} characters`)
});

export default Step1ValidationSchema;
