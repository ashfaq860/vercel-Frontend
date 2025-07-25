import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from '../../../store/userSlice';
import AdminLayout from "../../../components/layout/adminLayout";
import toast from 'react-hot-toast';
import { updateUser } from '../../../api/internal';

const provinces = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit Baltistan"];
const citiesByProvince = {
    Punjab: ["Lahore", "Rawalpindi", "Faisalabad"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur"],
    KPK: ["Peshawar", "Abbottabad", "Swat"],
    Balochistan: ["Quetta", "Gwadar"],
    "Gilgit Baltistan": ["Gilgit", "Skardu"],
};

const AccountSetting = () => {
    const user = useSelector(state => state.user);
   // console.log(user);
   
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
        province: '',
        city: '',
        photo: null,
    });

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        setFormData({
            name: user.username,
            phone: user.phone || '',
            address: user.address || '',
            email: user.email,
            province: user.province || '',
            city: user.city || '',
            photo: user.photo ||''
        });
        //console.log(formData);
    }, [user]);

    useEffect(() => {
        const hasChanges = Object.keys(formData).some((key) =>
            key === 'photo'
                ? formData.photo !== null
                : formData[key] !== user[key]
        );
        setChanged(hasChanges);
    }, [formData, user]);

    const handleChange = (e) => {
        
        const { name, value, files } = e.target;
        alert(name);
        if (name === "photo") {
            const file = files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            alert(reader.result);

            reader.onload = () => {
                setImage(reader.result); // for preview
                setFormData((prev) => ({ ...prev, photo: reader.result })); // keep file for backend upload
            };
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.match(/^\d{11}$/)) newErrors.phone = "Valid 11-digit phone required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.province) newErrors.province = "Select a province";
        if (!formData.city) newErrors.city = "Select a city";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validate()) return;

        const data = new FormData();
        data.append("id", user._id);
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        data.append("province", formData.province);
        data.append("city", formData.city);
        if (formData.photo) {
            data.append("photo", formData.photo);
        }
       
        console.log(data);
       // return
        try {
            const { data: resData, status } = await updateUser(data); // Must accept multipart/form-data
            if (status === 201) {
                toast.success(resData.message);
               dispatch(setUser({ ...user, ...formData }));
            } else {
                toast.error(resData.message || "Something went wrong");
            }
        } catch (err) {
            toast.error("Update failed");
        }
    };

    return (
        <AdminLayout>
            <div className="col-9">
                <h1 className="text-center mt-3">Update User Details</h1>

                <div className="row">
                    <div className="col-md-6 mt-2">
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            className="form-control" placeholder="Enter your Name" />
                        {errors.name && <small className="text-danger">{errors.name}</small>}
                    </div>
                    <div className="col-md-6 mt-2">
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            className="form-control" placeholder="Enter your Email" />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mt-2">
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                            className="form-control" placeholder="Enter Phone e.g 03451234567" />
                        {errors.phone && <small className="text-danger">{errors.phone}</small>}
                    </div>
                    <div className="col-md-6 mt-2">
                        <input type="text" name="address" value={formData.address} onChange={handleChange}
                            className="form-control" placeholder="Enter Address" />
                        {errors.address && <small className="text-danger">{errors.address}</small>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mt-2">
                        <select name="province" className="form-select" value={formData.province} onChange={handleChange}>
                            <option value="">Select Province</option>
                            {provinces.map((prov) => <option key={prov}  value={prov}>{prov}</option>)}
                        </select>
                        {errors.province && <small className="text-danger">{errors.province}</small>}
                    </div>
                    <div className="col-md-6 mt-2">
                        <select name="city" className="form-select"  value={formData.city} onChange={handleChange}>
                            <option value="">Select City</option>
                            {(citiesByProvince[formData.province] || []).map((city) =>
                                <option key={city}  value={city}>{city}</option>
                            )}
                        </select>
                        {errors.city && <small className="text-danger">{errors.city}</small>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mt-3">
                        <input type="file" name="photo" accept="image/*" onChange={handleChange} className="form-control" />
                        {image ? (
                            <img
                                src={image}
                                alt="Preview"
                                className="img-thumbnail mt-2"
                                style={{ height: "100px" }}
                            />
                        ) : (
                            <img
                                src={formData.photo}
                                alt="Preview"
                                className="img-thumbnail mt-2"
                                style={{ height: "100px" }}
                            />
                        )}
                   </div>
                </div>

                <div className="text-center mt-4">
                    <button disabled={!changed} className="btn btn-primary" onClick={handleUpdate}>
                        Update Now
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AccountSetting;
