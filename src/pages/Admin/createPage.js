import { useState, useRef, useMemo } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import { useSelector } from 'react-redux';
import { submitPageContent } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import JoditEditor from 'jodit-react';
import './addPage.css';
const CreatePage = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);
    const author = useSelector(state => state.user._id);

    // Jodit editor configuration
    const editorConfig = useMemo(() => ({
        readonly: false,
        placeholder: 'Start typing your content here...',
        buttons: ['bold', 'italic', 'link', 'unlink', 'ul', 'ol', 'font', 'fontsize', 'image'],
        height: 400,
        removeButtons: ['source'],
        toolbarAdaptive: true, // Makes toolbar responsive
        toolbarSticky: true,
    }), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !slug || !content) {
            alert("Please fill all fields!");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const data = { title, slug, author, content };
            const response = await submitPageContent(data);
            
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
    }

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        setSlug(value.replace(/\s+/g, '-').toLowerCase());
    }

    return (
        <AdminLayout>
            <Helmet>
                <title>Create New Page</title>
            </Helmet>
               <div className="col-auto col-md-9 col-xl-10 px-sm-10">
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <h1 className="h4 mb-0">Create New Page</h1>
                                <p className="text-muted mb-0">Fill in the details below to create a new page</p>
                            </div>
                            
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    id="title"
                                                    className="form-control"
                                                    onChange={handleTitleChange}
                                                    value={title}
                                                    placeholder="Enter page title"
                                                    required
                                                />
                                                <label htmlFor="title">Page Title</label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-12 col-md-6">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    id="slug"
                                                    className="form-control"
                                                    onChange={(e) => setSlug(e.target.value)}
                                                    value={slug}
                                                    placeholder="page-slug"
                                                    required
                                                />
                                                <label htmlFor="slug">Page Slug</label>
                                                <small className="text-muted ms-2">URL-friendly version</small>
                                            </div>
                                        </div>
                                        
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label htmlFor="content" className="form-label">Page Content</label>
                                                <div className="border rounded overflow-hidden">
                                                    <JoditEditor
                                                        ref={editor}
                                                        value={content}
                                                        config={editorConfig}
                                                        tabIndex={1}
                                                        onBlur={newContent => setContent(newContent)}
                                                        onChange={newContent => setContent(newContent)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-12">
                                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary me-md-2"
                                                    onClick={() => navigate('/admin/all-pages')}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            Creating...
                                                        </>
                                                    ) : 'Create Page'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
        </AdminLayout>
    )
}

export default CreatePage;
