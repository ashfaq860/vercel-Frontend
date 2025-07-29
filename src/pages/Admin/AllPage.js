import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import { deletePage, getAllPages } from "../../api/internal";
import parse from 'html-react-parser';
const dayjs = require('dayjs');
import './allPage.css';

const AllPages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const author = useSelector(state => state.user._id);

    const getPages = async () => {
        setLoading(true);
        try {
            const response = await getAllPages();
            if (response.status === 200) {
                setPages(response.data.pages);
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPages();
    }, []);

    const deletePageBySlug = async (slug) => {
        const check = window.confirm("Are you sure you want to delete this page?");
        if (check) {
            try {
                const response = await deletePage(slug);
                if (response.status === 200) {
                    getPages();
                }
            } catch (error) {
                console.error("Error deleting page:", error);
            }
        }
    }

    return (
        <AdminLayout>
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0 text-gray-800">All Pages</h1>
                    <Link 
                        to="/admin/create-page" 
                        className="btn btn-primary btn-sm"
                    >
                        <span className="d-none d-md-inline">Create New Page</span>
                        <span className="d-inline d-md-none">+ New</span>
                    </Link>
                </div>

                {loading ? (
                    <Loader text="Loading Pages..." />
                ) : pages.length === 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body text-center py-5">
                            <h5 className="text-muted mb-3">No pages found</h5>
                            <Link 
                                to="/admin/create-page" 
                                className="btn btn-primary"
                            >
                                Create Your First Page
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th width="5%">#</th>
                                            <th width="20%">Title</th>
                                            <th width="15%">Slug</th>
                                            <th width="25%">Preview</th>
                                            <th width="10%">Author</th>
                                            <th width="15%">Created</th>
                                            <th width="10%">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pages.map((p, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <Link 
                                                        to={`/admin/page/edit/${p.slug}`}
                                                        className="text-dark font-weight-bold"
                                                    >
                                                        {p.title}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark font-monospace">
                                                        /{p.slug}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                        {parse(p.content.slice(0, 100))}...
                                                    </div>
                                                </td>
                                                <td>{p.author?.name || 'N/A'}</td>
                                                <td>
                                                    <small className="text-muted">
                                                        {dayjs(p.createdAt).format("DD MMM YYYY")}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <Link 
                                                            to={`/page/${p.slug}`}
                                                            className="btn btn-outline-primary"
                                                            title="View"
                                                        >
                                                            <i className="bi bi-eye-fill"></i>
                                                        </Link>
                                                        <Link 
                                                            to={`/admin/page/edit/${p.slug}`}
                                                            className="btn btn-outline-success"
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => deletePageBySlug(p.slug)}
                                                            className="btn btn-outline-danger"
                                                            title="Delete"
                                                        >
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AllPages;
