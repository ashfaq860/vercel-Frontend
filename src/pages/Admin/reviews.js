import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import AdminLayout from "../../components/layout/adminLayout";
import Loader from "../loader/loader";
import { getAllReviews, updateReview, deleteReview, reviewReply } from "../../api/internal";
import Pagination from "../../components/products/item/pagination";

const ProductReviews = () => {
    const { username, email } = useSelector(state => state.user);
    const [reviews, setReviews] = useState([]);
    const [parentReviewId, setParentReviewId] = useState(null);
    const [replyName, setReplyName] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Pagination state
    const [reviewPerPage, setReviewPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate pagination
    const lastPostIndex = currentPage * reviewPerPage;
    const firstPostIndex = lastPostIndex - reviewPerPage;
    const currentReviews = reviews.slice(firstPostIndex, lastPostIndex);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await getAllReviews();
            if (response.status === 200) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleStatusChange = async (status, reviewId) => {
        try {
            const res = await updateReview({ status, rId: reviewId });
            if (res.status === 201) {
                toast.success("Review status updated!");
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to update review status");
        }
    };

    const handleDeleteReview = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (confirmed) {
            try {
                const response = await deleteReview(id);
                if (response.status === 200) {
                    toast.success("Review deleted successfully");
                    fetchReviews();
                }
            } catch (error) {
                toast.error("Failed to delete review");
            }
        }
    };

    const handleReplyInit = (id, name) => {
        setParentReviewId(id);
        setReplyName(name);
        setReplyContent('');
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) {
            toast.error("Reply cannot be empty");
            return;
        }

        try {
            const res = await reviewReply({
                review: parentReviewId,
                reply: replyContent,
                name: username,
                email
            });
            
            if (res.status === 201) {
                toast.success("Reply submitted successfully");
                setReplyContent('');
                document.getElementById('closeReplyCanvas').click();
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to submit reply");
        }
    };

    if (isLoading) {
        return <Loader text="Loading reviews" />;
    }

    return (
        <AdminLayout>
        <div className="col-auto col-md-9 col-xl-10 px-sm-10">
            <div className="container-fluid py-4">
                <div className="card shadow-lg">
                    <div className="card-header bg-white border-bottom-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="h5 mb-0">Product Reviews</h2>
                            <div className="d-flex align-items-center">
                                <label htmlFor="itemsPerPage" className="me-2 mb-0">Items per page:</label>
                                <select 
                                    id="itemsPerPage"
                                    className="form-select form-select-sm w-auto"
                                    value={reviewPerPage}
                                    onChange={(e) => setReviewPerPage(Number(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card-body px-0 pb-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th width="5%">#</th>
                                        <th width="10%">Product</th>
                                        <th width="15%">Details</th>
                                        <th width="15%">Reviewer</th>
                                        <th width="20%">Review</th>
                                        <th width="10%">Date</th>
                                        <th width="10%">Status</th>
                                        <th width="15%">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReviews.length > 0 ? (
                                        currentReviews.map((review, index) => (
                                            <tr key={review._id}>
                                                <td>{firstPostIndex + index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img 
                                                            src={review.pId.photoPath} 
                                                            alt={review.pId.name}
                                                            className="rounded me-2" 
                                                            width="60" 
                                                            height="60"
                                                        />
                                                        <div>
                                                            <div className="fw-semibold">{review.pId.name}</div>
                                                            <small className="text-muted">{review.pId.manufacturer}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{maxWidth: '150px'}}>
                                                        {review.pId.urduName}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="fw-medium">{review.name}</div>
                                                    <small className="text-muted">{review.email}</small>
                                                    {review.reply && (
                                                        <div className="mt-1">
                                                            <span className="badge bg-info">Replied</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i 
                                                                key={i}
                                                                className={`bi bi-star${i < review.star ? '-fill text-warning' : ''}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-break">
                                                        {review.comment}
                                                        {review.reply && (
                                                            <div className="mt-2 p-2 bg-light rounded">
                                                                <small className="text-primary fw-semibold">Admin reply:</small>
                                                                <p className="mb-0">{review.reply}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>{dayjs(review.createdAt).format("MMM D, YYYY")}</small>
                                                    <br />
                                                    <small className="text-muted">{dayjs(review.createdAt).format("h:mm A")}</small>
                                                </td>
                                                <td>
                                                    <select 
                                                        className={`form-select form-select-sm ${review.status ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}
                                                        value={review.status}
                                                        onChange={(e) => handleStatusChange(e.target.value, review._id)}
                                                    >
                                                        <option value={false}>Pending</option>
                                                        <option value={true}>Verified</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            data-bs-toggle="offcanvas" 
                                                            data-bs-target="#replyCanvas"
                                                            onClick={() => handleReplyInit(review._id, review.name)}
                                                        >
                                                            <i className="bi bi-reply"></i> Reply
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteReview(review._id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">
                                                No reviews found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {reviews.length > 0 && (
                            <div className="card-footer bg-white border-top-0">
                                <Pagination 
                                    totalPosts={reviews.length} 
                                    postPerPage={reviewPerPage} 
                                    setCurrentPage={setCurrentPage} 
                                    currentPage={currentPage} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Offcanvas */}
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="replyCanvas" aria-labelledby="replyCanvasLabel">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title" id="replyCanvasLabel">
                        Reply to <span className="text-primary">{replyName}</span>
                    </h5>
                    <button 
                        id="closeReplyCanvas"
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="offcanvas" 
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-3">
                        <label htmlFor="replyTextarea" className="form-label">Your Reply</label>
                        <textarea 
                            id="replyTextarea"
                            className="form-control" 
                            rows="6"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your response here..."
                        ></textarea>
                    </div>
                </div>
                <div className="offcanvas-footer border-top p-3">
                    <button 
                        className="btn btn-primary w-100"
                        onClick={handleSubmitReply}
                    >
                        Submit Reply
                    </button>
                </div>
            </div>
                            </div>
        </AdminLayout>
    );
};

export default ProductReviews;
