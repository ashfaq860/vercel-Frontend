import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import { deletePage, getAllPages } from "../../api/internal";
import parse from 'html-react-parser';
const dayjs = require('dayjs');
import './pageList.css';

const AllPages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
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

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            page.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || 
                            (selectedStatus === 'published' && page.status === 'published') ||
                            (selectedStatus === 'draft' && page.status === 'draft');
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="wp-admin-pages">
                <div className="wp-admin-header">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="wp-admin-title">Pages</h1>
                        <Link 
                            to="/admin/create-page" 
                            className="btn btn-primary wp-add-new"
                        >
                            Add New
                        </Link>
                    </div>

                    <div className="wp-admin-filters mb-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="search-box">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search pages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <span className="search-icon">
                                        <i className="bi bi-search"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <select 
                                    className="form-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <div className="text-md-end">
                                    <span className="text-muted">
                                        {filteredPages.length} items
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Loader text="Loading Pages..." />
                ) : filteredPages.length === 0 ? (
                    <div className="wp-admin-empty-state">
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
                    </div>
                ) : (
                    <div className="wp-admin-list-table">
                        <div className="card shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table wp-list-table mb-0">
                                        <thead>
                                            <tr>
                                                <th width="40%">Title</th>
                                                <th width="15%">Author</th>
                                                <th width="15%">Status</th>
                                                <th width="15%">Date</th>
                                                <th width="15%">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPages.map((p, i) => (
                                                <tr key={i} className="wp-list-item">
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <Link 
                                                                to={`/admin/page/edit/${p.slug}`}
                                                                className="wp-list-item-title"
                                                            >
                                                                <strong>{p.title}</strong>
                                                            </Link>
                                                            <span className="wp-list-item-slug ms-2">
                                                                /{p.slug}
                                                            </span>
                                                        </div>
                                                        <div className="wp-list-item-excerpt text-muted">
                                                            {parse(p.content.slice(0, 100))}...
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="wp-list-item-author">
                                                            {p.author?.name || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge wp-status-${p.status || 'published'}`}>
                                                            {p.status || 'published'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="wp-list-item-date">
                                                            {dayjs(p.createdAt).format("MMM D, YYYY")}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm wp-list-actions">
                                                            <Link 
                                                                to={`/page/${p.slug}`}
                                                                className="btn btn-light"
                                                                title="View"
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </Link>
                                                            <Link 
                                                                to={`/admin/page/edit/${p.slug}`}
                                                                className="btn btn-light"
                                                                title="Edit"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => deletePageBySlug(p.slug)}
                                                                className="btn btn-light text-danger"
                                                                title="Delete"
                                                            >
                                                                <i className="bi bi-trash"></i>
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
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AllPages;
