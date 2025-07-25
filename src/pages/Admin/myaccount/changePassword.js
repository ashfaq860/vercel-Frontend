import React, { useEffect } from 'react';
import "../../auth/auth.css";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';

import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/layout/adminLayout";
import toast from 'react-hot-toast';

import { changePassword, checkIfPasswordMatch, updateUser } from '../../../api/internal';
import changePasswordSchema from '../../schemas/changePasswordSchema';


const ChangePassword = () => {
    const user = useSelector(state => state.user);
    const [error, setError] = useState(true);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [changed, setChanged] = useState(false);
    const [checked, setChecked] = useState(false);
    

    const handleOldPassword = async (oldPassword) => {
        setChecked(true);
        const oldPasswordData = {
            id: user._id,
            password:oldPassword

        }
        try {
            const response = await checkIfPasswordMatch(oldPasswordData);
            if (response.status === 200) {
                setChecked(false);
                setError(false);
            } else {
                setChecked(true);
                setError(true);
            }
        } catch (error) {
            setChecked(false);
            setError(true);
        }
    }
    const updatePassword = async(e) => {
        e.preventDefault();
        const updatePasswordData = {
            id: user._id,
            password:values.password
           
        }
        const response = await changePassword(updatePasswordData);
        if (response.status === 200) {
            toast.success(response.data.message);
        } else {
            toast.error(response.error);
        }
     
    }
    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: changePasswordSchema
    });
    return (<>
        <AdminLayout>
            <div className="col-9" >
            <div className="row">
                <div className="card removeBoxShadow mt-5 mb-5 col-lg-5 col-md-5 col-sm-7 col-12" style={{ "margin": "auto" }} >
                    <div className="card-body forms" style={{ "margin": "auto" }}>
                        <h1 className="text-center">Change Password</h1>
                            <form onSubmit= { (e)=>updatePassword(e) } >
                            <div className="row">
                                <div className="col-12 form-group">
                                        <input type="password" id="oldPassword" name="oldPassword" required className="form-control password" onChange={ (e)=>handleOldPassword(e.target.value)} id="password" placeholder="Old password" />
                                        {checked ? (<><p className="text-danger">Password does not match!</p></>) : ""}
                                </div>
                            </div>

                                <div className="row">
                                    <div className="col-12 form-group">
                                        <input type="password" id="password" disabled={ error?"disabled":""} name="password" required className="form-control password" onChange={handleChange} onBlur={handleBlur} value={values.password} id="password" placeholder="Create password" />
                                        {errors.password && touched.password ? (<><p className="text-danger">{errors.password}</p></>) : (<></>)}

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 form-group confirmPass">
                                        <input type="password" id="cPassword" disabled={error ? "disabled" : ""} name="confirmPassword" className="form-control password" required id="cPassword" onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} placeholder="Confirm Password" />
                                        
                                        {errors.confirmPassword && touched.confirmPassword ? (<><p className="text-danger">{errors.confirmPassword}</p></>) : (<></>)}

                                    </div>
                                </div>




                <div className="text-center mt-4">

                                <input type="submit" name="name" id="name" className="btn btn-primary" value="Change Now" />
                                </div>
                            </form>
                        </div>
                </div>
                </div>
            </div>
        </AdminLayout>
    </>)
}
export default ChangePassword;