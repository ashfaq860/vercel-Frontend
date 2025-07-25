
import './product.css';
import { Link, NavLink } from "react-router-dom";
import { getAllCat } from "../../api/internal";
import { useEffect, useState } from "react";
const CategoryList = () => {
	const [categories, setCategories] = useState([]);
	const getAllcategories = async () => {
		try {
			const res = await getAllCat();
			setCategories(res.data.categories);
			//console.log(categories);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		getAllcategories();
	}, []);
	const scrolToTop = () => { window.scroll(0, 0); }

	return (<>
		{categories.map((cat, i) => (
			<li key={i}>
				<NavLink
					to={`/category/${cat.name}/${cat._id}`}

					className={({ isActive, isPending }) =>
						isPending ? "pending" : isActive ? "active" : ""
					}
					onClick={scrolToTop}
				>
					<strong> {cat.name}</strong>
				</NavLink>

			</li>
		))}


	</>);
}
export default CategoryList;