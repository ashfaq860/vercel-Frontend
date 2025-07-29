import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { submitPageChanges, getPageBySlug } from "../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import JoditEditor from 'jodit-react';
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";

const EditPage = () => {
    const editor = useRef(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const author = useSelector(state => state.user._id);
    const { pSlug } = useParams();

    const fetchPageData = async () => {
        setIsLoading(true);
        try {
            const res = await getPageBySlug(pSlug);
            if (res.status === 200) {
                setTitle(res.data.page.title);
                setSlug(res.data.page.slug);
                setContent(res.data.page.content);
            }
        } catch (error) {
            console.error("Error fetching page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    }, [pSlug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !slug || !content) {
            alert("Please fill all fields!");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const data = { title, slug, author, content };
            const response = await submitPageChanges(data);
            
            if (response.status === 201) {
                navigate("/admin/all-pages");
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert(error.message);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSlugChange = (e) => {
        setSlug(e.target.value);
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Edit Page</title>
            </Helmet>
            
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <GoBack link="/admin/all-pages" title="Go Back" />
                        <h1>Update Page</h1>
                        <div style={{ width: '100px' }}></div>
                    </div>
                    <p className="text-muted">Edit the page details below</p>
                </div>

                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="page-form-container">
                            <div className="form-group">
                                <label htmlFor="title">Page Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control modern-input"
                                    onChange={handleTitleChange}
                                    value={title}
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="slug">Page Slug</label>
                                <input
                                    type="text"
                                    id="slug"
                                    className="form-control modern-input"
                                    onChange={handleSlugChange}
                                    value={slug}
                                    placeholder="page-slug"
                                />
                                <small className="text-muted">URL-friendly version of the title</small>
                            </div>

                            <div className="form-group">
                                <label>Page Content</label>
                                <div className="editor-container">
                                    <JoditEditor
                                        ref={editor}
                                        value={content}
                                        onChange={newContent => setContent(newContent)}
                                        config={{
                                            buttons: ['bold', 'italic', 'link', 'unlink', 'ul', 'ol', 'font', 'fontsize', 'image'],
                                            height: 400,
                                            readonly: false // Ensure editor is not readonly
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary submit-btn"
                                    disabled={isSubmitting || isLoading}
                                >
                                    <LoadingButton 
                                        loading={isSubmitting} 
                                        title="Update Page Changes" 
                                        loadingText="Saving Changes..."
                                    />
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
};

export default EditPage;
