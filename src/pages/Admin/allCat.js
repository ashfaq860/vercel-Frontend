import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from 'react-redux';
import { deleteCategory, getAllCat } from "../../api/internal";
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import toast from 'react-hot-toast';
import './allCat.css'; // Create this CSS file

const AllCat = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const author = useSelector(state => state.user._id);

    const getAllcategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCat();
            if (response.status === 200) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            toast.error('Failed to load categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllcategories();
    }, []);

    const deleteCat = async (id) => {
        const check = window.confirm("Are you sure you want to delete this category?");
        if (check) {
            try {
                const response = await deleteCategory(id);
                if (response.status === 200) {
                    toast.success('Category deleted successfully');
                    getAllcategories();
                }
            } catch (error) {
                toast.error('Failed to delete category');
                console.error(error);
            }
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">All Categories</h1>
                    <Link to="/admin/add-category" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>Add New
                    </Link>
                </div>

                {loading ? (
                    <Loader text="Loading Categories..." />
                ) : categories.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="empty-state">
                            <i className="bi bi-folder-x text-muted" style={{ fontSize: '5rem' }}></i>
                            <h4 className="mt-3">No Categories Found</h4>
                            <p className="text-muted">You haven't created any categories yet</p>
                            <Link to="/admin/add-category" className="btn btn-primary mt-3">
                                Create Your First Category
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card shadow-sm">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Photo</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Slug</th>
                                        <th scope="col">Author</th>
                                        <th scope="col">Date Created</th>
                                        <th scope="col" className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, i) => (
                                        <tr key={cat._id}>
                                            <th scope="row">{i + 1}</th>
                                            <td>
                                                <div className="category-photo">
                                                    <img 
                                                        src={cat.photoPath} 
                                                        alt={cat.name} 
                                                        className="img-thumbnail"
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = '/default-category.jpg'
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="fw-semibold">{cat.name}</td>
                                            <td><code>{cat.slug}</code></td>
                                            <td>{cat.author?.name || 'Unknown'}</td>
                                            <td>{formatDate(cat.createdAt)}</td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link 
                                                        to={`/admin/update-category/${cat._id}`} 
                                                        className="btn btn-sm btn-outline-primary"
                                                        aria-label="Edit"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteCat(cat._id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        aria-label="Delete"
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AllCat;
