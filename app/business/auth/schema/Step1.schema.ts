import * as yup from 'yup';

const Step1ValidationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10,11}$/, 'Enter a valid 10 or 11 digit phone number'),
});

export default Step1ValidationSchema;
