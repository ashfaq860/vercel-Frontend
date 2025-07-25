import { Link } from "react-router-dom";
import './pagination.css';
const Pagination = ({ totalPosts, postPerPage, setCurrentPage, currentPage }) => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
        pages.push(i);
    }
    if (totalPosts <= postPerPage) {
        return;
    }
    return (<>
        <nav aria-label="Page navigation example">
            <ul className="pagination  justify-content-center">
                <li className="page-item"><Link className={`page-link ${currentPage<=1 ? "disabled" : ""}`}  onClick={() => setCurrentPage(currentPage > 1 ? --currentPage : currentPage)}>Previous</Link></li>

                {pages.map((page, i) => {
                    return <li className={`page-item ${page === currentPage ? "active" : ""}`} key={i}><Link className="page-link" onClick={() => setCurrentPage(page)}>{ } {page}</Link></li>
                })}
                <li className="page-item"><Link className={`page-link ${currentPage >= pages.length ? "disabled" : ""}`} onClick={()=>setCurrentPage(currentPage<pages.length?++currentPage:currentPage) }>Next</Link></li>
            </ul>
        </nav>

            </>)
}
export default Pagination;