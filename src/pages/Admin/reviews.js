import { useSelector } from "react-redux";
import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import Loader from "../loader/loader";
import { getAllReviews, updateReview, deleteReview, reviewReply } from "../../api/internal";
import Pagination from "../../components/products/item/pagination";
const dayjs = require('dayjs')

const ProductReviews = () => {
    const username = useSelector(state => state.user.username);
    const email = useSelector(state => state.user.email);
    const [reviews, setReviews] = useState([]);
    const [parentReviewId, setParentReviewId] = useState(0);
    const [name, setName] = useState('');
    const [reply, setReply] = useState();

    const [reviewPerPage, setreviewPerPaage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPostIndex = currentPage * reviewPerPage;
    const firstPostIndex = lastPostIndex - reviewPerPage;
    const currentReviews = reviews.slice(firstPostIndex, lastPostIndex);
    //console.log(aor);

    const getReviews = async () => {
        const response = await getAllReviews();
        if (response.status === 200) {
         //   console.log(response.data.reviews);
            setReviews(response.data.reviews);
        }
    }
    useEffect(() => {
        getReviews();
    }, []);
    // Change Review status pending to verfied
    const handleStatus = async (status, rId) => {
        const data = {
            status,
            rId
        }
        const res = await updateReview(data);
        if (res.status === 201) {
            toast.success("Status Successfully Updated!");
        }
        getReviews();
    }
    //######## Delete Review function by id
    const deleteReviewById = async (id) => {
        const check = window.confirm("Do you want to delete Product?");
        if (check) {
            const response = await deleteReview(id);
            if (response.status == 200) {
             toast.success("Successfully, Review Deleted")
             getReviews();
            }

        }
    }

// update state id name function on lick reply
    const handleReply = async (id, name) => {
        setParentReviewId(id);
        setName(name);
    }
// function to handle submit reply function
    const handleSubmitReply = async () => {
        const data = {
            review:parentReviewId,
            reply,
            name: username,
            email
 };
        const res = await reviewReply(data);
        if (res.status === 201) {
            toast.success("Successfully Reply Submitted");
        }
    }
    return (<>
        <AdminLayout>
            {reviews.length === 0 ? (<><Loader text="Products" /></>)
                : (<>
                    <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                        <h1 className="text-center m-3">All Product Reviews
                            <select onChange={ (e)=>setreviewPerPaage(e.target.value)}>
                                <option value={ reviewPerPage }>Reviews Per Page</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </h1>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr className="text-center">
                                        <th scope="col">#</th>
                                        <th scope="col">Photo</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Company</th>
                                        <th scope="col">Name/Email</th>
                                        
                                        <th scope="col">Review</th>
                                      
                                        <th scope="col">Posted On</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" colSpan="3">Action</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        currentReviews.map((r, i) => (
                                            <tr key={i} className="text-center">
                                                <th scope="row">{i + 1}</th>
                                                <td><img src={r.pId.photoPath} height="80" width="80" /></td>
                                                <td>{r.pId.name}<br />{r.pId.urduName}</td>
                                                <td>{r.pId.manufacturer}</td>
                                                <td>{r.name}<br />{r.email}</td>
                                                <td>{r.star}-{r.comment}</td>
                                                <td>{dayjs(r.createdAt).format("DD/MM/YY HH:MM:ss")}</td>
                                                <td>
                                                    <select onChange={ (e)=>handleStatus(e.target.value,r._id) }>
                                                        <option value='false' selected={`${r.status?"":"selected"}` }> Pending </option>
                                                        <option value='true' selected={`${r.status ? "selected" : ""}`}> Verified </option>
                                                    </select>
                                                </td>
                                                <td className="actionLink text-center" colSpan="3" style={{ "minWidth": "80px" }}>
                                                    <Link to="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" onClick={(e)=>handleReply(r._id,r.name) }> <i className="bi bi-pencil-square" title={` Click to Edit ${r.name}!`}></i></Link>   
                                                     |
                                                     <Link onClick={() => deleteReviewById(r._id)}> <i className="bi bi-trash3 text-danger" aria-label={`Delete ${r.name}!`} title={` Click to delete ${r.name}!`}></i> </Link>
                                                </td>
                                            </tr>



                                        ))
                                    }
                                </tbody>
                            </table>
                            <Pagination totalPosts={reviews.length} postPerPage={reviewPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        </div>
                    </div>

                    {/* Offconvass to reply comments */}
                    <div className="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                        <div className="offcanvas-header text-center pb-0">
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body text-center pt-0">
                            <h5 className="offcanvas-title text-center" id="offcanvasTopLabel">Reply To <b>{name}</b></h5>

                            <textarea value={reply} onChange={(e) => setReply(e.target.value)} style={{'width':'70%'} } placeholder="Write your reply here..."></textarea>
                            <br/>
                            <button className="btn btn-primary" onClick={handleSubmitReply}>Submit Reply</button>
                        </div>
                    </div>
                </>)}
        </AdminLayout>
    </>)

}
export default ProductReviews;