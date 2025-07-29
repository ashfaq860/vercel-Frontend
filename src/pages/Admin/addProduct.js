import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, getAllCat } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/input/textInput";
import productSchema from "../schemas/productSchema";
import LoadingButton from "../loader/loadingButton";
import toast from "react-hot-toast";
import { resetUser } from "../../store/userSlice";
import './addProduct.css'; // New CSS file for modern styling

const AddProduct = () => {
    const inputRef = useRef(null);
    const [photo, setPhoto] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const author = useSelector(state => state.user._id);
    const dispatch = useDispatch();

    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: '',
            urduName: '',
           
            model: '',
            manufacturer: '',
            p_price: '',
            s_price: '',
            quantity: '',
            quality: '',
            category: '',
            desc: '',
            tags: '',
            shippingCost: ''
        },
        validationSchema: productSchema
    });

    const getAllcategories = async () => {
        try {
            const response = await getAllCat();
            if (response.status === 200) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            toast.error('Failed to load categories');
            console.error(error);
        }
    }

    useEffect(() => {
        getAllcategories();
    }, []);

    const handleImageClick = () => {
        inputRef.current.click();
    }

    const getPhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image
        if (!file.type.match('image.*')) {
            toast.error('Please select an image file (JPEG, PNG)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = async () => {
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix all validation errors');
            return;
        }

        if (!photo) {
            toast.error('Please upload a product image');
            return;
        }

        setLoading(true);
        const data = {
            ...values,
            category: values.vehicle,
            photo,
            author
        };

        try {
            const response = await createProduct(data);
            if (response.status === 201) {
                toast.success('Product created successfully!');
                navigate("/admin/productList");
            } else if (response.status === 500 && response.response?.data?.message === "jwt expired") {
                toast.error("Your session has expired!");
                dispatch(resetUser());
                navigate('/login');
            } else {
                toast.error(response.message || 'Failed to create product');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0
        }).format(value).replace('PKR', 'Rs.');
    }

    return (
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <h1 className="h3 mb-0">Add New Product</h1>
                    <button 
                        onClick={() => navigate("/admin/productList")}
                        className="btn btn-outline-secondary"
                    >
                        <i className="bi bi-arrow-left me-2"></i>Back to Products
                    </button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row g-4">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <TextInput
                                        type="text"
                                        className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="name"
                                        value={values.name}
                                        placeholder="Product Name"
                                        label="Product Name*"
                                    />
                                    {errors.name && touched.name && (
                                        <div className="invalid-feedback">{errors.name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <TextInput
                                        type="text"
                                        className={`form-control ${errors.urduName && touched.urduName ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.urduName}
                                        name="urduName"
                                        placeholder="نام اردو میں تحریر کریں"
                                        label="*چیز کانام اردو میں تحریر کریں"
                                    />
                                    {errors.urduName && touched.urduName && (
                                        <div className="invalid-feedback">{errors.urduName}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Select Vehicle*</label>
                                    <select 
                                        className={`form-select ${errors.vehicle && touched.vehicle ? 'is-invalid' : ''}`}
                                        onChange={handleChange} 
                                        onBlur={handleBlur} 
                                        name="vehicle"
                                        value={values.vehicle}
                                    >
                                        <option value="">Select Vehicle</option>
                                        {categories.map((cat, i) => (
                                            <option key={i} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.vehicle && touched.vehicle && (
                                        <div className="invalid-feedback">{errors.vehicle}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Select Model*</label>
                                    <select 
                                        className={`form-select ${errors.model && touched.model ? 'is-invalid' : ''}`}
                                        onChange={handleChange} 
                                        onBlur={handleBlur} 
                                        name="model"
                                        value={values.model}
                                    >
                                        <option value="">Select Vehicle Model</option>
                                        <option value="New">New</option>
                                        <option value="Old">Old</option>
                                        <option value="Both">Both</option>
                                    </select>
                                    {errors.model && touched.model && (
                                        <div className="invalid-feedback">{errors.model}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <TextInput
                                        type="text"
                                        className={`form-control ${errors.manufacturer && touched.manufacturer ? 'is-invalid' : ''}`}
                                        name="manufacturer"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.manufacturer}
                                        placeholder="Manufacturer Name"
                                        label="Manufacturer Name*"
                                    />
                                    {errors.manufacturer && touched.manufacturer && (
                                        <div className="invalid-feedback">{errors.manufacturer}</div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Select Quality*</label>
                                    <select 
                                        className={`form-select ${errors.quality && touched.quality ? 'is-invalid' : ''}`}
                                        onChange={handleChange} 
                                        onBlur={handleBlur} 
                                        name="quality"
                                        value={values.quality}
                                    >
                                        <option value="">Select Quality</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    {errors.quality && touched.quality && (
                                        <div className="invalid-feedback">{errors.quality}</div>
                                    )}
                                </div>

                                <div className="row g-2">
                                    <div className="col-md-6 mb-3">
                                        <TextInput
                                            type="number"
                                            className={`form-control ${errors.p_price && touched.p_price ? 'is-invalid' : ''}`}
                                            name="p_price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.p_price}
                                            placeholder="Purchase Price"
                                            label={`Purchase Price* ${values.p_price ? formatCurrency(values.p_price) : ''}`}
                                        />
                                        {errors.p_price && touched.p_price && (
                                            <div className="invalid-feedback">{errors.p_price}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <TextInput
                                            type="number"
                                            className={`form-control ${errors.s_price && touched.s_price ? 'is-invalid' : ''}`}
                                            name="s_price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.s_price}
                                            placeholder="Sale Price"
                                            label={`Sale Price* ${values.s_price ? formatCurrency(values.s_price) : ''}`}
                                        />
                                        {errors.s_price && touched.s_price && (
                                            <div className="invalid-feedback">{errors.s_price}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-md-6 mb-3">
                                        <TextInput
                                            type="number"
                                            className={`form-control ${errors.quantity && touched.quantity ? 'is-invalid' : ''}`}
                                            name="quantity"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.quantity}
                                            placeholder="Quantity"
                                            label="Quantity*"
                                        />
                                        {errors.quantity && touched.quantity && (
                                            <div className="invalid-feedback">{errors.quantity}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <TextInput
                                            type="number"
                                            className={`form-control ${errors.shippingCost && touched.shippingCost ? 'is-invalid' : ''}`}
                                            name="shippingCost"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.shippingCost}
                                            placeholder="Shipping Cost"
                                            label={`Shipping Cost ${values.shippingCost ? formatCurrency(values.shippingCost) : ''}`}
                                        />
                                        {errors.shippingCost && touched.shippingCost && (
                                            <div className="invalid-feedback">{errors.shippingCost}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Product Image*</label>
                                    <input 
                                        type="file" 
                                        style={{ display: "none" }} 
                                        ref={inputRef} 
                                        name="photo" 
                                        onChange={getPhoto} 
                                        accept="image/*"
                                    />
                                    <div 
                                        className={`image-upload-container ${!photo ? 'empty' : ''}`}
                                        onClick={handleImageClick}
                                    >
                                        {photo ? (
                                            <>
                                                <img src={photo} alt="Product Preview" className="img-preview" />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm remove-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPhoto('');
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="upload-placeholder">
                                                <i className="bi bi-cloud-arrow-up fs-1"></i>
                                                <p className="mt-2">Click to upload product image</p>
                                                <small className="text-muted">JPEG/PNG, max 5MB</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Full Width Fields */}
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label">Description*</label>
                                    <textarea
                                        className={`form-control ${errors.desc && touched.desc ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.desc}
                                        name="desc"
                                        rows="5"
                                        placeholder="Write product description"
                                    />
                                    {errors.desc && touched.desc && (
                                        <div className="invalid-feedback">{errors.desc}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <TextInput
                                        type="text"
                                        className={`form-control ${errors.tags && touched.tags ? 'is-invalid' : ''}`}
                                        name="tags"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.tags}
                                        placeholder="Comma separated tags (e.g., tag1, tag2)"
                                        label="Tags"
                                    />
                                    {errors.tags && touched.tags && (
                                        <div className="invalid-feedback">{errors.tags}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="d-grid mt-4">
                            <button 
                                type="button" 
                                onClick={handleSubmit} 
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                <LoadingButton loading={loading} title="Add Product" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddProduct;
