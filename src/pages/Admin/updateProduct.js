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
import styles from './updateProduct.module.css';

const UpdateProduct = () => {
    // Refs and hooks
    const inputRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pId } = useParams();

    // Redux state
    const user = useSelector(state => state.user._id);

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
        desc: '',
        tags: '',
        shippingCost: 0,
    });

    // Data fetching
    const fetchProductData = useCallback(async () => {
        try {
            const [productResponse, categoriesResponse] = await Promise.all([
                getProductById(pId),
                getAllCat()
            ]);

            if (productResponse.status === 200) {
                const { product } = productResponse.data;
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
                    desc: product.desc || '',
                    tags: product.tags || '',
                    shippingCost: product.shippingCost || 0,
                });
            }

            if (categoriesResponse.status === 200) {
                setCategories(categoriesResponse.data.categories);
            }
        } catch (error) {
            console.error("Data loading error:", error);
            toast.error("Failed to load required data");
        }
    }, [pId]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    // Handlers
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
            shippingCost: productData.shippingCost
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
    const renderSelectOptions = (options, selectedValue) => (
        options.map((option) => (
            <option 
                key={option.value} 
                value={option.value}
                selected={option.value === selectedValue}
            >
                {option.label}
            </option>
        ))
    );

    return (
        <AdminLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <GoBack link="/admin/productList" title="Go Back" /> <br />
                    <h2>Update Product</h2>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.formGrid}>
                        {/* Left Column */}
                        <div>
                            <div className={styles.formSection}>
                                <label className={styles.label}>Product Name</label>
                                <input
                                    type="text"
                                    className={styles.inputField}
                                    name="name"
                                    value={productData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>نام اردو میں تحریر کریں</label>
                                <input
                                    type="text"
                                    className={styles.inputField}
                                    name="urduName"
                                    value={productData.urduName}
                                    onChange={handleInputChange}
                                    placeholder="نام اردو میں تحریر کریں"
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Vehicle Type</label>
                                <select 
                                    className={styles.selectField}
                                    name="category"
                                    value={productData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Vehicle</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Vehicle Model</label>
                                <select 
                                    className={styles.selectField}
                                    name="model"
                                    value={productData.model}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Model</option>
                                    {['New', 'Old', 'Both'].map(model => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Manufacturer</label>
                                <input
                                    type="text"
                                    className={styles.inputField}
                                    name="manufacturer"
                                    value={productData.manufacturer}
                                    onChange={handleInputChange}
                                    placeholder="Manufacturer name"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <div className={styles.formSection}>
                                <label className={styles.label}>Purchase Price</label>
                                <input
                                    type="number"
                                    className={styles.inputField}
                                    name="p_price"
                                    value={productData.p_price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Sale Price</label>
                                <input
                                    type="number"
                                    className={styles.inputField}
                                    name="s_price"
                                    value={productData.s_price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Quantity</label>
                                <input
                                    type="number"
                                    className={styles.inputField}
                                    name="quantity"
                                    value={productData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Quality</label>
                                <select 
                                    className={styles.selectField}
                                    name="quality"
                                    value={productData.quality}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Quality</option>
                                    {['High', 'Medium', 'Low'].map(quality => (
                                        <option key={quality} value={quality}>
                                            {quality}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Product Image</label>
                                <div 
                                    className={styles.imageUpload}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={inputRef}
                                        onChange={handleFileUpload}
                                        className="d-none"
                                        accept="image/*"
                                    />
                                    
                                    {productData.photo ? (
                                        <img 
                                            src={productData.photo} 
                                            alt="Product Preview" 
                                            className={styles.imagePreview}
                                        />
                                    ) : (
                                        <>
                                            <img 
                                                src="/icons/productImage.png" 
                                                alt="Upload Placeholder"
                                                className={styles.placeholderImage}
                                            />
                                            <p className={styles.uploadText}>Click to upload product image</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description and Tags (Full width) */}
                    <div className={styles.formSection}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textareaField}
                            name="desc"
                            value={productData.desc}
                            onChange={handleInputChange}
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div className={styles.formSection}>
                        <label className={styles.label}>Tags</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            name="tags"
                            value={productData.tags}
                            onChange={handleInputChange}
                            placeholder="Comma separated tags"
                        />
                    </div>

                    <div className={styles.formSection}>
                        <label className={styles.label}>Shipping Cost</label>
                        <input
                            type="number"
                            className={styles.inputField}
                            name="shippingCost"
                            value={productData.shippingCost}
                            onChange={handleInputChange}
                            placeholder="0.00"
                        />
                    </div>

                    <button 
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        <LoadingButton loading={loading} title="Update Product" />
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UpdateProduct;
