import * as yup from 'yup';
const errorMessage = "use lowercase, uppercase and digits";
const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const changePasswordSchema = yup.object().shape({
   
    password: yup.string().min(8).max(25).matches(passwordPattren, { message: errorMessage }).required("password is required"),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'password must match').required("password is required")

});
export default changePasswordSchema;