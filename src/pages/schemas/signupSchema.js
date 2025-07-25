import * as yup from 'yup';
const errorMessage = "use lowercase, uppercase and digits";
const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const signupSchema = yup.object().shape({
    name: yup.string().min(5).max(25).required("Name is Required"),
    email: yup.string().email("enter a valid email").required("email is required"),
    phone: yup.string().min(11).max(11).required("phone is requred"),
    address: yup.string().min(5).max(30).required("address is required"),
    password: yup.string().min(8).max(25).matches(passwordPattren, { message: errorMessage }).required("password is required"),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'password must match').required("password is required")

});
export default signupSchema;