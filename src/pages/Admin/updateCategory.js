import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file (JPEG, PNG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    const updatePromise = new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (image) {
          data.append('image', image);
        }

        const config = {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        await axios.put(`/api/categories/${id}`, data, config);
        resolve();
      } catch (error) {
        console.error('Update error:', error);
        reject(error.response?.data?.message || 'Failed to update category');
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    });

    toast.promise(
      updatePromise,
      {
        loading: 'Updating category...',
        success: 'Category updated successfully!',
        error: (err) => err.toString()
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 4000,
        },
        error: {
          duration: 5000,
        }
      }
    );

    try {
      await updatePromise;
      navigate('/admin/categories');
    } catch (error) {
      // Error already handled by toast.promise
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Update Category</h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="d-block form-label">Category Image</label>
              <div 
                className="border rounded p-3 text-center" 
                style={{ cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
              >
                {image ? (
                  <div className="position-relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="img-thumbnail mb-2" 
                      style={{ maxHeight: '200px' }} 
                    />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    >
                      <span aria-hidden="true">&times;</span> Remove
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <span className="d-block mb-2" style={{ fontSize: '2rem' }}>↑</span>
                    <p className="mb-0">Click to upload category image</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="d-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {isLoading && (
              <div className="mb-3">
                <div className="progress">
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progress}%
                  </div>
                </div>
              </div>
            )}

            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
