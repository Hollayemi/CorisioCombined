import * as yup from "yup";

const ValidatAddressPicker = yup.object().shape({
  address: yup.string().required("Address is Required"),
  state: yup.string().required("State is Required"),
  city: yup
    .string()
    .required("City Address is Required"),
  postal_code: yup
    .string()
    .min(6, ({ min }: any) => `Zip Code must have ${min} characters`)
    .max(6, ({ max }: any) => `Zip Code must have ${max} characters`)
    .required("Zip Code is required"),
});

export default ValidatAddressPicker;
