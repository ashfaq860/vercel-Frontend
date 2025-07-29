import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import toast from "react-hot-toast";
import { deleteProduct, getAllProducts, markFeatured } from "../../api/internal";
import Pagination from "../../components/products/item/pagination";
import dayjs from 'dayjs';
import './allProducts.css'; // Create this CSS file

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [productPerPage, setProductPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const author = useSelector(state => state.user._id);

    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            if (response.status === 200) {
                setProducts(response.data.products);
            }
        } catch (error) {
            toast.error('Failed to load products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    const markProductFeatured = async (e, id) => {
        const data = {
            mark: e,
            _id: id
        }
        try {
            const res = await markFeatured(data);
            if (res.status === 200) {
                toast.success(res.data.message);
                getProducts();
            }
        } catch (error) {
            toast.error('Failed to update featured status');
            console.error(error);
        }
    }

    const deleteProductById = async (id) => {
        const check = window.confirm("Are you sure you want to delete this product?");
        if (check) {
            try {
                const response = await deleteProduct(id);
                if (response.status === 200) {
                    toast.success('Product deleted successfully');
                    getProducts();
                }
            } catch (error) {
                toast.error('Failed to delete product');
                console.error(error);
            }
        }
    }

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }

    const sortedProducts = [...products].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    // Pagination
    const lastPostIndex = currentPage * productPerPage;
    const firstPostIndex = lastPostIndex - productPerPage;
    const currentProducts = sortedProducts.slice(firstPostIndex, lastPostIndex);

   const formatCurrency = (amount) => {
    // Format with commas and 2 decimal places
    const formatted = new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    return `Rs. ${formatted}`; // Explicitly use Rs. prefix
}

    return (
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <h1 className="h3 mb-0">All Products</h1>
                    <Link to="/admin/add-product" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>Add New Product
                    </Link>
                </div>

                {loading ? (
                    <Loader text="Loading Products..." />
                ) : products.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="empty-state">
                            <i className="bi bi-box-seam text-muted" style={{ fontSize: '5rem' }}></i>
                            <h4 className="mt-3">No Products Found</h4>
                            <p className="text-muted">You haven't created any products yet</p>
                            <Link to="/admin/add-product" className="btn btn-primary mt-3">
                                Create Your First Product
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
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => requestSort('name')}
                                        >
                                            Name
                                            {sortConfig.key === 'name' && (
                                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                            )}
                                        </th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Model</th>
                                        <th scope="col">Quality</th>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => requestSort('quantity')}
                                        >
                                            Qty
                                            {sortConfig.key === 'quantity' && (
                                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                            )}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => requestSort('p_price')}
                                        >
                                            Purchase
                                            {sortConfig.key === 'p_price' && (
                                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                            )}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => requestSort('s_price')}
                                        >
                                            Sale
                                            {sortConfig.key === 's_price' && (
                                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                            )}
                                        </th>
                                        <th scope="col">Featured</th>
                                        <th scope="col">Created</th>
                                        <th scope="col" className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((p, i) => (
                                        <tr key={p._id}>
                                            <th scope="row">{firstPostIndex + i + 1}</th>
                                            <td>
                                                <div className="product-photo">
                                                    <img 
                                                        src={p.photo} 
                                                        alt={p.name} 
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = '/default-product.jpg'
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{p.name}</div>
                                                <div className="text-muted small">{p.urduName}</div>
                                            </td>
                                            <td>{p.category}</td>
                                            <td>{p.model}</td>
                                            <td>{p.quality}</td>
                                            <td>
                                                <span className={`badge ${p.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                    {p.quantity}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(p.p_price)}</td>
                                            <td>{formatCurrency(p.s_price)}</td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        checked={p.isFeatured || false}
                                                        onChange={(e) => markProductFeatured(e.target.checked, p._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="small">{dayjs(p.createdAt).format("MMM D, YYYY")}</td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link 
                                                        to={`/admin/product/addMorePhotes/${p._id}`}
                                                        className="btn btn-sm btn-outline-secondary"
                                                        title="Add photos"
                                                    >
                                                        <i className="bi bi-images"></i>
                                                    </Link>
                                                    <Link 
                                                        to={`/admin/update-product/${p._id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteProductById(p._id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
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
                        <div className="card-footer bg-white">
                            <Pagination 
                                totalPosts={products.length} 
                                postPerPage={productPerPage} 
                                setCurrentPage={setCurrentPage} 
                                currentPage={currentPage} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AllProducts;
