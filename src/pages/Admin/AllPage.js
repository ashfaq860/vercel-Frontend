import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import { deletePage, getAllPages } from "../../api/internal";
import parse from 'html-react-parser';
const dayjs = require('dayjs');

const AllPages = () => {

    const [pages, setPages] = useState([]);
    const author = useSelector(state => state.user._id);
    //console.log(author);
    const getPages = async () => {
        const response = await getAllPages();
        if (response.status === 200) {
            console.log(response.data.pages);
            setPages(response.data.pages);
        }
    }
    useEffect(() => {
        getPages();
    }, []);
   /* const markProductFeatured = async (e, id) => {

        const data = {
             mark: e,
            _id: id
        }
        const res = await markFeatured(data);

        if (res.status == 200) {
            getProducts();
        }
    }
    */
    const deletePageBySlug = async (e) => {
        const check = window.confirm("Do you want to delete Page?");
        if (check) {
          
          const response = await deletePage(e);
            if (response.status == 200) {
                getPages();
            }
        
        }
    }

    return (<>
        <AdminLayout>
            {pages.length === 0 ? (<><Loader text="Pages" /></>)
                : (<>
                    <div className="col-auto col-sm-8 col-md-9 col-xl-10 px-sm-10">
                        <h1 className="text-center m-3">All Products</h1>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Slug</th>
                                        <th scope="col">Content</th>
                                        <th scope="col">Author</th>
                                        <th scope="col">Created AT</th>
                                        <th scope="col" colSpan="3">Action</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        pages.map((p, i) => (
                                            <tr key={i}>
                                                <th scope="row">{i + 1}</th>
                                                <td>{p.title}</td>
                                                <td>{p.slug}</td>
                                                <td><Link to={`/admin/page/edit/${p.slug}`}>{ parse((p.content.slice(0,150))) }. . .</Link></td>
                                                <td>{p.author.name}</td>
                                                <td>{dayjs(p.createdAt).format("DD/MM/YY HH:MM:ss")}</td>
                                                <td>

                                                    <Link onClick={() => deletePageBySlug(p.slug)}> <i className="bi bi-trash3 text-danger" aria-label={`Delete ${p.title}!`} title={` Click to delete ${p.title}!`}></i> </Link>

                                                    |

                                                    <Link to={`/admin/page/edit/${p.slug}`}> <i class="bi bi-pencil-square" title={`Add or Change Product Photoes!`}></i></Link>

                                                </td>
                                            </tr>
  ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>)}
        </AdminLayout>
    </>)

}
export default AllPages;