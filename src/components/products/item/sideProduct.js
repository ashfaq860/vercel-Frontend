import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const SideProduct = (props) => {
	return (<>
            <div className="latest-products">
			<Link to={`/parts/${props._id}`}> <img src={props.photo} className="float-start" alt="latest project added" height="80" width="80" />
                    </Link>
                    <div className="ps-3 float-start">
				<Link to={`/parts/${props._id}`} className="latestProductName"><b>{props.name}</b>
                        </Link> <br />
				<div className="p-1 startAndReview">
					{[...Array(5)].map((_, i) => {
						return <span key={i} className={`${i < (Number(props.totalStars) / Number(props.totalReviews)) ? "selected" : ""}`} style={{ "fontSize": "14px" }} >&#9733;</span>
					})}
					<small style={{ "fontSize": "12px !important" }}> {props.totalReviews} {props.totalReviews > 1 ? " Reviews" : "Review"}</small>
				</div>
                      
                <span className="latestProductPrice">RS.{ props.s_price}</span>
                    </div>
                </div>


	</>)
}
export default SideProduct;