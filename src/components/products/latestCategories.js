import './product.css';
import { getAllCat } from "../../api/internal";
import { useState,useEffect } from "react";
import Category from "./item/category";
const LatestCategories = () => {

	const [categories, setCategories] = useState([]);
	const getAllcategories = async () => {
		try {
	
			const res = await getAllCat();
			if(res.status==200)
			setCategories(res.data.categories);
			//console.log(categories);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		getAllcategories();
	}, []);

	return (<>

		<div className="row">
			<div className="col-12 text-center mt-5">

				<div className="divider scrollShow">Latest Categories</div>
			</div>
		</div>

		<div className="row">
			{categories.map((cat, i) => (

				<Category
					key={i}
					_id={cat._id}
					photoPath={cat.photoPath}
					name=	{cat.name}
				/>

				))
			}
		</div>

	</>);
}
export default LatestCategories;