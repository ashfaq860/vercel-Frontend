import { useState, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from 'react-redux';
import { submitCategory } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loader/loadingButton";
import toast from 'react-hot-toast';
import './addCat.css';

const AddCat = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [isManualSlug, setIsManualSlug] = useState(false);
   
    const author = useSelector(state => state.user._id);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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

    const removeImage = () => {
        setPhoto('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')         // Replace spaces with -
            .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
            .replace(/\-\-+/g, '-')       // Replace multiple - with single -
            .replace(/^-+/, '')           // Trim - from start
            .replace(/-+$/, '');          // Trim - from end
    }

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        if (!isManualSlug) {
            setSlug(generateSlug(newName));
        }
    }

    const handleSlugChange = (e) => {
        const newSlug = e.target.value;
        setSlug(newSlug);
        setIsManualSlug(newSlug !== generateSlug(name));
    }

    const handleSubmit = async () => {
        if (!name || !slug) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!photo) {
            toast.error('Please upload a category image');
            return;
        }

        setLoading(true);
        const data = {
            name,
            slug: generateSlug(slug),
            author,
            photo
        };

        try {
            const response = await submitCategory(data);
            if (response.status === 201) {
                toast.success('Category created successfully!');
                navigate("/admin/catList");
            } else {
                toast.error(response.message || 'Failed to create category');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <h1 className="text-center p-3">
                    <b>Add New Category</b>
                </h1>
                
                <div style={{ width: "70vh", margin: "auto" }}>
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="catName" 
                            onChange={handleNameChange} 
                            value={name || ""} 
                            placeholder="Category Name" 
                        />
                        <label htmlFor="catName">Category Name</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control text-lowercase" 
                            id="slug" 
                            onChange={handleSlugChange} 
                            value={slug || ""} 
                            placeholder="slug" 
                        />
                        <label htmlFor="slug">URL Slug {isManualSlug && "(custom)"}</label>
                    </div>

                    <div className="mb-3">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            id="fileName"
                            className="d-none"
                            accept="image/*"
                        />
                        {photo ? (
                            <div className="position-relative text-center">
                                <img 
                                    src={photo} 
                                    height="180" 
                                    width="180" 
                                    alt="Category Preview" 
                                    className="img-thumbnail cursor-pointer"
                                    onClick={handleImageClick}
                                    style={{ cursor: 'pointer' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage();
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div 
                                className="border rounded p-5 text-center"
                                onClick={handleImageClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex flex-column align-items-center">
                                    <span style={{ fontSize: '3rem' }}>↑</span>
                                    <p className="mt-2">Click to upload category image</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-3">
                        <button 
                            type="button" 
                            onClick={handleSubmit} 
                            className="btn btn-lg btn-primary w-100"
                            disabled={loading}
                        >
                            <LoadingButton loading={loading} title="Add Category"/>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddCat;
