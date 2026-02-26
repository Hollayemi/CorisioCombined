import * as yup from 'yup';

const Step2ValidationSchema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  store: yup.string().required('Store handle is required'),
  fullname: yup.string().required('Full name is required'),
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export default Step2ValidationSchema;
