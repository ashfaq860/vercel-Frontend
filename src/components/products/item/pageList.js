
import { Link, NavLink } from "react-router-dom";
//import { getAllPages } from "../../api/internal";
import { useEffect, useState } from "react";
import { getAllPages } from "../../../api/internal";
const PageList = () => {
	const [pages, setPages] = useState([]);
	const getPages = async () => {
		try {
			
			const res = await getAllPages();
			setPages(res.data.pages);
			//console.log(pages);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		getPages();
	}, []);
	const scrolToTop = () => { window.scroll(0, 0); }

	return (<>
		<ul>	{pages?.map((p, i) => (
			<li key={i}>
				<NavLink
					to={`/page/${p.slug}`}

					className={({ isActive, isPending }) =>
						isPending ? "pending" : isActive ? "active" : ""
					}
					onClick={scrolToTop}
				>
					<strong> {p.title}</strong>
				</NavLink>

			</li>
		))}

		</ul>

	</>);
}
export default PageList;