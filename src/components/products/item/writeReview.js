import { useState } from "react";
import { submitReview } from "../../../api/internal";
import "./review.css";
import toast from 'react-hot-toast';
const WriteReview = (props) => {
	const [selectedStar, setSelectedStar] = useState(0);
	const [mouseOverStar, setMouseOverStar] = useState(0);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [comment, setComment] = useState('');
	const [startError, setStartError ] = useState(0);
	const handleSubmit = async(e) => {
		e.preventDefault();
		if (selectedStar < 1) {
			setStartError(1);
		} else {
			setStartError(0)
			if (name !== "" && email !== ""){
				const data = {
					pId: props.pId,
					star: selectedStar,
					name,
					email,
					comment
				}
				const response = await submitReview(data);
				if (response.status === 201) {
					toast.success("Thanks for your Review!");
					setName("");
					setEmail("");
					setComment("");
					setSelectedStar(0);
				}
			}
		}
	}
	return (<>
		
		<div className="container">
			<div className="row">
				<div className="col-12 p-3 alignment-items-center">
					<h2 className="text-center">Write Your Review</h2>
					<div className="stars text-center">
						{[...Array(5)].map((_, i) => {
							return <span key={i} onMouseOut={() => setMouseOverStar(0)} onMouseOver={() => setMouseOverStar(i + 1)} className={`${i < selectedStar ? "selected" : ""} ${i < mouseOverStar ? "onMouseOverStart" : ""}`} onClick={() => setSelectedStar(i+1) }>&#9733;</span>
						}) }
						{startError === 1 ? (<><div className="alert alert-danger" role="alert">
						 Star field is required.
						</div></>):(<></>) }
					</div>
					<form onSubmit={handleSubmit}>
						<div className="form-floating mb-3">
							<input type="name" required="required" style={{ "width": "100% !important" }}  name="name" onChange={(e) => setName(e.target.value)} value={name}  className="form-control" id="floatingInput" placeholder="Ashfaq" />
						<label htmlFor="floatingInput">Name*</label>
					</div>
					<div className="form-floating mb-3">
							<input type="email" name="email"  required="required" className="form-control" onChange={(e) => setEmail(e.target.value)} value={email} id="floatingInput" placeholder="name@example.com" />
					  <label htmlFor="floatingInput">Email address*</label>
					</div>
					<div className="form-floating mb-3">
							<textarea placeholder="Write your review here..." onChange={(e) => setComment(e.target.value)} style={{ "width": "100%" }} value={ comment }></textarea>
					</div>
					<div className="form-floating mb-3 text-end">
						<input type="submit" className="btn reviewButton"   value="Send Review"/>
					</div>
					</form>
					
				</div>
			</div>
		</div>
		</>);
}
export default WriteReview;