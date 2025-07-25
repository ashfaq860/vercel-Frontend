import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import LoadingButton from "../loader/loadingButton";
import { useFormik } from 'formik';
import generalSettingsSchema from "../schemas/generalSettingSchema";
import { createGeneralSetting, getGeneralSetting } from "../../api/internal";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import toast from 'react-hot-toast';
const GeneralSetting = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [image, setImage] = useState("");
    const author = useSelector(state => state.user._id);
    const [loading, setLoading] = useState(false);
    const handleImageClick = () => {
        inputRef.current.click();
    }
    // handle image upload event function
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result);
           // console.log(image)
        }
        
    }
    const { values, touched, handleBlur, handleChange, errors, setValues } = useFormik({
        initialValues: {
            facebookId: '',
            twitterId: '',
            whatsAppId: '',
            tiktokId: '',
            phone: '',
            email: '',
            address: '',
            timing: '',
            logo: '',

        },
        validationSchema: generalSettingsSchema
    });

    const handleSettingForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            facebookId: values.facebookId,
            twitterId: values.twitterId,
            whatsAppId: values.whatsAppId,
            tiktokId: values.tiktokId,
            phone: values.phone,
            email: values.email,
            address: values.address,
            timing: values.timing,
            logo: image,
            author
        };
       //console.log(data);
        try {
            const response = await createGeneralSetting(data);
            setLoading(false);
            if (response.status === 201) {
                toast.success("Setting Created Successfully!");

            } else if (response.status===202) {
                toast.success("Setting Updated Successfully!");
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
            console.log(error);
        }
       
    }
    useEffect(() => {
       const getSettings    =   async()=> {
            try {
                const response = await getGeneralSetting();
                setLoading(false);
               // console.log(response);
                if (response.status == 201) {
                    //toast.success("Setting updated Successfully!");
                    setValues({
                        facebookId: response.data.setting[0].facebookId,
                        twitterId: response.data.setting[0].twitterId,
                        whatsAppId: response.data.setting[0].whatsAppId,
                        tiktokId: response.data.setting[0].tiktokId,
                        phone: response.data.setting[0].phone,
                        email: response.data.setting[0].email,
                        address: response.data.setting[0].address,
                        timing: response.data.setting[0].timing,
                        logo: response.data.setting[0].logo,
                    });
                    setImage(response.data.setting[0].logo);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                setLoading(false);
                alert(error.message);
                console.log(error);
            }
        }
        getSettings();
    },[]);
    return (<>
        <AdminLayout>
            <div className="col-auto col-sm-8 col-md-9 col-xl-10 px-sm-10">
                <div className="row">
                    <div className="col-12">
                    <section className="mt-2 border">
                            <h1 className="text-center p-3">Header Info</h1>
                            <div className="text-center mb-3" onClick={handleImageClick}>
                                {image ? (<> <img src={image} height="250" width="320" /></>) : (<> <img src="/icons/uploadImage.png" height="250" width="320" /></>) }
                               
                                <input type="file" ref={inputRef} onChange  =   {handleImageChange} name="logo" id="logo" style={{"display":"none"} } />
                            </div>
                        <h3 className="text-center">Social Links</h3>
                            <div className="table-responsive text-center">
                                <form onSubmit={handleSettingForm }>
                            <table className="table table-striped" cellPadding="5">
                                       
                                        <tr>
                                    <td>Facebook Id <i class="bi bi-facebook"></i></td>
                                            <td><input type="text" name="facebookId" id="facebookId" value={values.facebookId} onChange={handleChange} onBlur={ handleBlur } /></td>
                                </tr>
                               
                                <tr>
                                    <td>Twitter Id <i class="bi bi-twitter-x"></i></td>
                                            <td><input type="text" name="twitterId" id="twitterId" value={values.twitterId} onChange={handleChange} onBlur={handleBlur } /></td>
                                </tr>
                                <tr>
                                    <td>WhatsApp Id <i class="bi bi-whatsapp"></i></td>
                                            <td><input type="number"  name="whatsAppId" id="whatsappId" value={values.whatsAppId} onChange={handleChange} onBlur={handleBlur } /></td>
                                </tr>

                                <tr>
                                    <td>TikTok Id <i class="bi bi-tiktok"></i></td>
                                            <td><input type="text" name="tiktokId" id="tiktokId" value={values.tiktokId} onChange={handleChange} onBlur={handleBlur } /></td>
                                </tr>
                                <tr>
                                    <td>Cell Phone: <i class="bi bi-phone-vibrate-fill"></i></td>
                                            <td><input type="number" name="phone" id="phone" value={values.phone} onChange={handleChange} onBlur={ handleBlur } /></td>
                                </tr>
                                    <tr>
                                            <td colSpan="2" className="text-center"><h3 className="mt-3">Footer Settings </h3> </td>
                                    </tr>
                                    <tr>
                                            <td>E-mail: <i class="bi bi-envelope-at"></i></td>
                                            <td><input type="email" name="email" id="email" value={values.email} onChange={handleChange} onBlur={handleBlur } /></td>
                                    </tr>
                                    <tr>
                                            <td>Address: <i class="bi bi-shop"></i></td>
                                            <td><input type="text" name="address" id="address" value={values.address} onChange={handleChange} onBlur={handleBlur } /></td>
                                    </tr>
                                    <tr>
                                            <td>Timing: <i class="bi bi-alarm-fill"></i></td>
                                            <td>
                    
                                                <input type="text" name="timing" id="timing" value={values.timing} onChange={handleChange} onBlur={handleBlur} /></td>
                                    </tr>
                                <tr>
                                <td>&nbsp;</td>
                                        <td className="text-center me-1">
                                                <button className="btn btn-primary m-auto" name="update" alt="update General Settings"><LoadingButton loading={loading} title="Update General Settings" /></button>
                                        </td>
                                </tr>
                                    </table>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    </>)
}
export default GeneralSetting;