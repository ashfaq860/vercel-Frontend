import { Link } from "react-router-dom";

const Category = (cat) => {
	return (<>
		
		<div className="col-12 col-sm-6 col-lg-3 text-center mt-3" key={cat._id}>

			<div className="card">
				<Link to={`/category/${cat.name}/${cat._id}`}>
					<img src={cat.photoPath} className="card-img-top" alt={`${cat.name}`} height="220" width="90" />
				</Link>
				<span className="new-product-label">New</span>

				<div className="card-body">
					<h5 className="card-title"><Link to={`/category/${cat.name}/${cat._id}`}>{cat.name}</Link></h5>



				</div>
			</div>

		</div>
    </>)
}
export default Category;