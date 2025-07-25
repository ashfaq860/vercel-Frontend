import React, { useState, useEffect } from 'react';
import { uploadSliderImages, getSliderImages, deleteSlide, reorderSlides } from '../../api/internal';
import AdminLayout from '../../components/layout/adminLayout';
import { toast } from 'react-hot-toast';
import LoadingButton from '../loader/loadingButton';

const SliderUpload = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(false);
    const maxSlides = 10;

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await getSliderImages();
                setSlides(res.data);
            } catch (err) {
                toast.error('Failed to load slides');
            }
        };

        fetchSlides();
    }, []);

    const handleImageChange = (index, file) => {
        const updated = [...slides];
        updated[index].image = file;
        updated[index].preview = URL.createObjectURL(file);
        setSlides(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...slides];
        updated[index][field] = value;
        setSlides(updated);
    };

    const handleAddSlide = () => {
        if (slides.length >= maxSlides) {
            toast.error(`Only ${maxSlides} slides allowed`);
            return;
        }
        setSlides([...slides, { image: null, preview: null, title: '', link: '', description: '' }]);
    };

    const handleDelete = async (index, id) => {
        const confirmed = window.confirm('Are you sure you want to delete this slide?');
        if (!confirmed) return;

        const updated = [...slides];
        updated.splice(index, 1);
        setSlides(updated);

        if (id) {
            try {
                await deleteSlide(id);
                toast.success('Slide deleted');
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    const handleMove = async (index, direction) => {
        const newSlides = [...slides];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSlides.length) return;

        // Swap positions
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

        // Update sortOrder locally
        const reorderedSlides = newSlides.map((s, i) => ({
            _id: s._id,
            sortOrder: i
        }));
        console.log(reorderedSlides)
        setSlides(newSlides);

        try {
            await reorderSlides(reorderedSlides); // 👈 send proper sortOrder list
        } catch (err) {
            toast.error(err+'Failed to save new order');
        }
    };


    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const payload = await Promise.all(
            slides.map(async (slide) => {
                const base64 = slide.image ? await toBase64(slide.image) : null;
                return {
                    _id: slide._id,
                    title: slide.title,
                    link: slide.link,
                    description: slide.description,
                    imageBase64: base64,
                };
            })
        );

        try {
            await uploadSliderImages({ slides: payload });
            toast.success('Slides saved');
            setLoading(false);
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    const getImageSrc = (slide) => {
        if (slide.preview) return slide.preview;
        if (slide.url?.startsWith('http')) return slide.url;
        return `${process.env.REACT_APP_INTERNAL_API_PATH}${slide.url}`;
    };

    return (
        <AdminLayout>
            <div className="col-10 col-md-9 px-sm-10">
                <div className="container my-4">
                    <h2 className="mb-4">Upload Slider Images</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4 flex-nowrap overflow-auto">
                            {slides.map((slide, index) => (
                                <div className="col-md-4" key={slide._id || `new-${index}`}>
                                    <div className="card shadow-sm p-2 position-relative">
                                        <div
                                            className="border d-flex justify-content-center align-items-center mb-2"
                                            style={{ height: '200px', background: '#f8f9fa', cursor: 'pointer' }}
                                            onClick={() => document.getElementById(`file-${index}`).click()}
                                        >
                                            {slide.preview || slide.url ? (
                                                <img
                                                    src={getImageSrc(slide)}
                                                    alt="Preview"
                                                    className="img-fluid h-100"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span className="text-muted">Click to select image</span>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id={`file-${index}`}
                                            className="d-none"
                                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Title"
                                            value={slide.title}
                                            onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Link"
                                            value={slide.link}
                                            onChange={(e) => handleChange(index, 'link', e.target.value)}
                                        />
                                        <textarea
                                            className="form-control mb-2"
                                            rows="2"
                                            placeholder="Description"
                                            value={slide.description}
                                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                                        />
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDelete(index, slide._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm me-1"
                                                    onClick={() => handleMove(index, 'up')}
                                                >
                                                    🔼
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleMove(index, 'down')}
                                                >
                                                    🔽
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="btn btn-secondary" onClick={handleAddSlide}>
                                ➕ Add Slide 
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <LoadingButton loading={loading} title="💾 Save Slides" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SliderUpload;
