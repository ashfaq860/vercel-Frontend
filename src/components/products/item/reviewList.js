import { useState } from 'react';
import Pagination from './pagination';

const dayjs = require('dayjs')
const ReviewList = (props) => {
    const [reviewPerPage, setreviewPerPaage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPostIndex = currentPage * reviewPerPage;
    const firstPostIndex = lastPostIndex - reviewPerPage;
    const currentReviews = props.reviews.slice(firstPostIndex, lastPostIndex);
    //console.log(props);
    return (<>
        <div className="row">
            <h2 className="text-center mt-2 mb-2">Customer Reviews</h2>
            {currentReviews?.map((r, j) => (
            <div className="review col-11 m-0" style={{"borderTop":"1px solid #bbb"}} key={j} >
                    <div className="starsList">
                        {[...Array(5)].map((_, i) => {
                            return <span key={i}  className={`${i < r.star ? "selected" : ""}`}>&#9733;</span>
                        })}
                    <span style={{ "fontSize": "12px","float":"right" }} className="pt-4" >{dayjs(r?.createdAt).format("DD/MM/YY HH:MM:ss")}</span>
                    </div>
                    <h4 className="text-uppercase mb-0">{r?.name}<span style={{ 'fontSize': '12px' }} className="text-capitalize"> {r?.status ? (<><i className="text-success" title="Verified Review">Verified</i></>) : (<><i className="text-danger" title="Pending Review">Pending</i></>)} </span></h4>
                    <p>{r?.comment}  </p>
                    <div>
                        {r?.reply?.map((reply, i) => {
                            return 
                                <div style={{ "backgroundColor": "rgb(246, 242, 241)" }}  className=" d-flex flex-row mb-2 ms-3 p-1" key={i}>
                                <i>

                                    <b> {reply?.name}</b> &nbsp;{dayjs(reply?.createdAt).format("DD/mm/YY HH:MM:ss")} <br />
                                    {reply?.comment}
                                    </i>
                                </div>
                            
                        })}
                    </div>

                </div>
            ))
            }
            <Pagination totalPosts={props.reviews.length} postPerPage={reviewPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage } />
        </div>

    </>);
}
export default ReviewList;