import Layout from "../../components/layout/layout";
import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import  "./auth.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import signupSchema from "../schemas/signupSchema";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { register } from "../../api/internal";
import { useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';
import LoadingButton from "../loader/loadingButton";

const Register = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const handleRegister = async () => {
        setLoading(true);
        const data = {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            address: values.address
        }
        const response = await register(data);
        //console.log(response);
        setLoading(false);
        if (response.status === 201) {

            // setuser
            toast.success("Registered Successfully!")
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.name,
                phone: response.data.user.phone,
                address: response.data.user.address,
                auth: response.data.user.auth
            }
            dispatch(setUser(user));
            
            // navigate to home page
            navigate('/admin/my-account');
        } if (response.status === 409) {
            setLoading(false);
            toast.error(response.response.data.message)
            setError(response.response.data.message);

        }
            else if (response.code === "ERR_BAD_REQUEST") {
            console.log(response);
            // display error message
            setError(response.response.data.message);
            console.log("Error occure while logging in " + response.response.data.message);
        }
            

    }
    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword:''
        },
        validationSchema: signupSchema
    });
    const [show, setShow] = useState(false);
    const [eye, setEye] = useState(false);
    const confirmPassword = (e) => {
        if (e.length > 0) {
            setShow(true);
        } else {
            setShow(false);
        }
    }

    const showPass = () => {
        if (eye === false) {
            setEye(true);
            document.getElementById("password").setAttribute("type", "text"); 
            document.getElementById("cPassword").setAttribute("type", "text"); 
        } else {
            setEye(false);
            document.getElementById("password").setAttribute("type", "password");
            document.getElementById("cPassword").setAttribute("type", "password"); 
        }
    }
return(<>
    <Layout>
      
        <div className="card removeBoxShadow  mt-5 mb-5 col-lg-4 col-md-4 col-sm-7 col-12" style={{ "margin":"auto" }} >
            <div className="card-body forms" style={{ "margin": "auto" }}>
                    <h1 className="text-center">Registration</h1>
                
                    <div className="row">
                        <div className="col-12 form-group ">
                            <input type="text" name="name" required id="name" onChange={handleChange} onBlur={handleBlur} value={values.name} className="form-control" placeholder="Enter your Name." />
                            {errors.name && touched.name ? (<><p className="text-danger">{errors.name}</p></>) : (<></>)}

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group">
                            <input type="email" name="email" className="form-control" required onChange={handleChange} onBlur={handleBlur} id="email" value={ values.email} placeholder="Enter your email." />
                            {errors.email && touched.email ? (<><p className="text-danger">{errors.email}</p></>) : (<></>)}

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group">
                            <input type="text" name="phone" className="form-control" required id="phone" onChange={handleChange} onBlur={handleBlur} value={ values.phone} pattern="[0-9]+" placeholder="Enter cell No e.g 03454447705" />
                            {errors.phone && touched.phone ? (<><p className="text-danger">{errors.phone}</p></>) : (<></>)}

                        </div>
                    </div>


                    <div className="row">
                        <div className="col-12 form-group">
                            <input type="text" name="address" className="form-control" required id="address" onChange={handleChange} onBlur={handleBlur} value={ values.address } placeholder="Enter your Address." />
                            {errors.address && touched.address ? (<><p className="text-danger">{errors.address}</p></>) : (<></>)}

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group">
                            <input type="password" id="password" name="password" required className="form-control password" onChange={handleChange} onBlur={handleBlur} value={ values.password} id="password" placeholder="Create password" />
                            {errors.password && touched.password ? (<><p className="text-danger">{errors.password}</p></>) : (<></>)}

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group confirmPass">
                            <input type="password" id="cPassword" name="confirmPassword" className="form-control password" required id="cPassword" onChange={handleChange} onBlur={handleBlur} value={ values.confirmPassword } placeholder="Confirm Password" />
                            {show ? (<>
                                <span className="showPass"><i className={eye===false ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"} onClick={showPass }></i></span>
                            </>) : (<></>)}
                            {errors.confirmPassword && touched.confirmPassword ? (<><p className="text-danger">{errors.confirmPassword}</p></>) : (<></>)}

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 form-group">
                            <input type="checkbox" id="option1" required name="group1" value="0" />
                                <label for="option1"> &nbsp;I Accept All Terms&Conditions.</label>
                        </div>
                    </div>
                    <div>
                    {error ? (<><p className="text-danger">{error}</p></>) : (<></>)}

                    <button name="name" id="name" className="btn btn-primary" onClick={handleRegister} >{<LoadingButton loading={loading} title="Register Now" />} </button>
                    </div>
                    <div><br/>
                        <p className="textAfterButton">Already Have Account? <Link to="/login">Login Now</Link> </p>
                    </div>
               
                </div>
            </div> 
       
        </Layout>
            </>)
}
export default Register;