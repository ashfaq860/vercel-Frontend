import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import AdminLayout from "../../components/layout/adminLayout";
import TextInput from "../../components/input/textInput";
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";
import { getAllCat, getProductById, updateProduct } from "../../api/internal";
import { resetUser } from "../../store/userSlice";
import './addCat.css';

const UpdateProduct = () => {
    // Refs
    const inputRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pId } = useParams();

    // Redux state
    const user = useSelector(state => state.user._id);
    const auth = useSelector(state => state.user.auth);
    const username = useSelector(state => state.user.username);

    // Component state
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        urduName: '',
        model: '',
        manufacturer: '',
        p_price: '',
        s_price: '',
        quantity: '',
        quality: '',
        photo: '',
        category: '',
        author: '',
        desc: '',
        tags: '',
        shippingPrice: 0,
        catName: ''
    });

    // Memoized data fetchers
    const getSingleProduct = useCallback(async () => {
        try {
            const response = await getProductById(pId);
            if (response.status === 200) {
                const { product } = response.data;
                setProductData({
                    name: product.name || '',
                    urduName: product.urduName || '',
                    model: product.model || '',
                    manufacturer: product.manufacturer || '',
                    p_price: product.p_price || '',
                    s_price: product.s_price || '',
                    quantity: product.quantity || '',
                    quality: product.quality || '',
                    photo: product.photo || '',
                    category: product.cId || '',
                    author: product.author?._id || '',
                    desc: product.desc || '',
                    tags: product.tags || '',
                    shippingPrice: product.shippingCost || 0,
                    catName: product.category || ''
                });
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product data");
        }
    }, [pId]);

    const getAllCategories = useCallback(async () => {
        try {
            const response = await getAllCat();
            if (response.status === 200) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        }
    }, []);

    // Effects
    useEffect(() => {
        getSingleProduct();
        getAllCategories();
    }, [getSingleProduct, getAllCategories]);

    // Handlers
    const handleImageClick = () => inputRef.current?.click();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setProductData(prev => ({ ...prev, photo: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        const payload = {
            ...productData,
            pId,
            author: user,
            shippingCost: productData.shippingPrice
        };

        try {
            const response = await updateProduct(payload);
            
            if (response.status === 200) {
                toast.success("Product updated successfully!");
                navigate("/admin/productList");
            } else if (response.status === 500 && response.data?.message === "jwt expired") {
                toast.error("Your session has expired!");
                dispatch(resetUser());
                navigate('/login');
            } else {
                toast.error(response.message || "Failed to update product");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Render helpers
    const renderCategoryOptions = () => (
        categories.map((cat, i) => (
            <option 
                key={i} 
                value={cat._id}
                selected={cat._id === productData.category}
            >
                {cat.name}
            </option>
        ))
    );

    const renderQualityOptions = () => (
        ["High", "Medium", "Low"].map((level, i) => (
            <option 
                key={i} 
                value={level}
                selected={level === productData.quality}
            >
                {level}
            </option>
        ))
    );

    const renderModelOptions = () => (
        ["New", "Old", "Both"].map((model, i) => (
            <option 
                key={i} 
                value={model}
                selected={model === productData.model}
            >
                {model}
            </option>
        ))
    );

    return (
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <h1 className="text-center p-3">
                    <GoBack link="/admin/productList" title="Go Back" />
                    <b>Update Product</b>
                </h1>
                
                <div className="product-form-container">
                    <div className="row g-4">
                        {/* Left Column */}
                        <div className="col-md-6 col-12">
                            <TextInput
                                label="Product Name"
                                type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleInputChange}
                                floating
                            />

                            <TextInput
                                label="نام اردو میں تحریر کریں"
                                type="text"
                                name="urduName"
                                value={productData.urduName}
                                onChange={handleInputChange}
                                floating
                            />

                            <div className="form-floating mb-3">
                                <select 
                                    className="form-select" 
                                    name="category"
                                    value={productData.category}
                                    onChange={handleInputChange}
                                    id="floatingSelect"
                                >
                                    <option value="">Select Vehicle</option>
                                    {renderCategoryOptions()}
                                </select>
                                <label htmlFor="floatingSelect">Select Vehicle</label>
                            </div>

                            <div className="form-floating mb-3">
                                <select 
                                    className="form-select" 
                                    name="model"
                                    value={productData.model}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Vehicle Model</option>
                                    {renderModelOptions()}
                                </select>
                                <label htmlFor="floatingSelect">Select Model</label>
                            </div>

                            <TextInput
                                label="Manufacturer Name"
                                type="text"
                                name="manufacturer"
                                value={productData.manufacturer}
                                onChange={handleInputChange}
                                floating
                            />

                            <div className="form-floating mb-3">
                                <textarea
                                    className="form-control"
                                    name="desc"
                                    value={productData.desc}
                                    onChange={handleInputChange}
                                    rows="5"
                                    placeholder=" "
                                />
                                <label>Description*</label>
                            </div>

                            <TextInput
                                label="Tags"
                                type="text"
                                name="tags"
                                value={productData.tags}
                                onChange={handleInputChange}
                                floating
                            />

                            <TextInput
                                label="Shipping Cost"
                                type="number"
                                name="shippingPrice"
                                value={productData.shippingPrice}
                                onChange={handleInputChange}
                                floating
                            />
                        </div>

                        {/* Right Column */}
                        <div className="col-md-6 col-12">
                            <TextInput
                                label="Purchase Price"
                                type="number"
                                name="p_price"
                                value={productData.p_price}
                                onChange={handleInputChange}
                                floating
                            />

                            <TextInput
                                label="Sale Price"
                                type="number"
                                name="s_price"
                                value={productData.s_price}
                                onChange={handleInputChange}
                                floating
                            />

                            <TextInput
                                label="Quantity*"
                                type="number"
                                name="quantity"
                                value={productData.quantity}
                                onChange={handleInputChange}
                                floating
                            />

                            <div className="form-floating mb-3">
                                <select 
                                    className="form-select" 
                                    name="quality"
                                    value={productData.quality}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Quality</option>
                                    {renderQualityOptions()}
                                </select>
                                <label>Select Quality</label>
                            </div>

                            <div className="image-upload-section">
                                <input 
                                    type="file" 
                                    ref={inputRef}
                                    onChange={handleFileUpload}
                                    className="d-none"
                                    accept="image/*"
                                />
                                
                                <div 
                                    className="image-preview-container"
                                    onClick={handleImageClick}
                                >
                                    {productData.photo ? (
                                        <img 
                                            src={productData.photo} 
                                            alt="Product Preview" 
                                            className="img-fluid product-image"
                                        />
                                    ) : (
                                        <div className="placeholder-image">
                                            <img 
                                                src="/icons/productImage.png" 
                                                alt="Upload Placeholder"
                                                className="img-fluid"
                                            />
                                            <span>Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            className="btn btn-primary btn-lg w-100"
                            disabled={loading}
                        >
                            <LoadingButton loading={loading} title="Update Product" />
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UpdateProduct;
