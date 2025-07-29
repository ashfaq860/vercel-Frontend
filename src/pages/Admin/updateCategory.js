import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/adminLayout";
import { getCatById, updateCategory } from "../../api/internal";
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";
import toast from 'react-hot-toast';
import './addCat.css';

const UpdateCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
   
    const author = useSelector(state => state.user._id);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image type
        if (!file.type.match('image.*')) {
            toast.error('Please select an image file (JPEG, PNG)');
            return;
        }

        // Validate image size (5MB limit)
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

    const getSelectedCat = async () => {
        try {
            const response = await getCatById(id);
            if (response.status === 200) {
                setName(response.data.category.name);
                setSlug(response.data.category.slug);
                setPhoto(response.data.category.photo);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load category data');
        }
    }

    const handleSubmit = async () => {
        if (!name || !slug) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        const data = {
            name,
            slug,
            categoryId: id,
            photo: photo
        };

        try {
            const response = await updateCategory(data);
            if (response.status === 201) {
                toast.success('Category updated successfully!');
                navigate("/admin/catList");
            } else {
                toast.error(response.message || 'Failed to update category');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getSelectedCat();
    }, []);

    return (
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <h1 className="text-center p-3">
                    <GoBack link="/admin/catList" title="Go Back" />
                    <b>Update Category</b>
                </h1>
                
                <div style={{ width: "70vh", margin: "auto" }}>
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="catName" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name || ""} 
                            placeholder="Category Name" 
                        />
                        <label htmlFor="catName">Category Name</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="slug" 
                            onChange={(e) => setSlug(e.target.value)} 
                            value={slug || ""} 
                            placeholder="slug" 
                        />
                        <label htmlFor="slug">Category Slug</label>
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
                            <LoadingButton loading={loading} title="Update Category"/>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default UpdateCategory;
