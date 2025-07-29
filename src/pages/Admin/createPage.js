import { useState, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { submitPageContent } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import JoditEditor from 'jodit-react';

const CreatePage = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);
    const author = useSelector(state => state.user._id);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form behavior
        
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
            
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <h1>Create New Page</h1>
                    <p className="text-muted">Fill in the details below to create a new page</p>
                </div>

                <form onSubmit={handleSubmit}> {/* Wrap in form element */}
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
                                onChange={(e) => setSlug(e.target.value)}
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
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Page'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}

export default CreatePage;
