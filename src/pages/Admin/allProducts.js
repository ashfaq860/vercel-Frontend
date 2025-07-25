import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import toast from "react-hot-toast";
import { deleteProduct, getAllProducts, markFeatured } from "../../api/internal";
import Pagination from "../../components/products/item/pagination";
const dayjs = require('dayjs')
const AllProducts = () => {

    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const author = useSelector(state => state.user._id);

    const getProducts = async () => {
        const response = await getAllProducts();
        if (response.status ===200) {
          
           setProducts(response.data.products);
        }
    }
    useEffect(() => {
     getProducts();
    }, []);
 const markProductFeatured  =   async(e,id)=>{
  
    const   data    =   {
        mark:e,
        _id:id
    }
     const res  =   await markFeatured(data);
   
     if (res.status == 200) {
         toast.success(res.data.message);
         getProducts();
     }
    }     
 
    const deleteProductById = async (e) => {
        const check = window.confirm("Do you want to delete Product?");
        if (check) {
             const response = await deleteProduct(e);
                if (response.status == 200) {
                    getProducts();
                }
 }
    }
    // sort Products
    useEffect(() => {
        // Make a copy to avoid mutating original props
        const sorted = [...products].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setSortedProducts(sorted);
    }, [products]);
    // pagination functions
    const [productPerPage, setProductPerPaage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPostIndex = currentPage * productPerPage;
    const firstPostIndex = lastPostIndex - productPerPage;
    const currentProducts = (sortedProducts ?? products).slice(firstPostIndex, lastPostIndex);

    return (<>
        <AdminLayout>
            {products.length === 0 ? (<><Loader text="Products" /></>)
                : (<>
                    <div className="col-auto col-sm-8 col-md-9 col-xl-10 px-sm-10">
                        <h1 className="text-center m-3">All Products</h1>
                        <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Fit In</th>
                                    <th scope="col">Model</th>
                                    <th scope="col">Quality</th>
                                    <th scope="col">quantity</th>
                                    <th scope="col">Purchase</th>
                                    <th scope="col">Sale</th>
                                    <th scope="col">Author</th>
                                    <th scope="col">isFeatured?</th>
                                    <th scope="col">Created AT</th>
                                    <th scope="col" colSpan="3">Action</th>

                                </tr>
                            </thead>

                            <tbody>
                                {
                                        currentProducts.map((p, i) => (
                                        <tr key={i}>
                                            <th scope="row">{i + 1}</th>
                                            <td><img src={p.photo} height="80" width="80" /></td>
                                            <td>{p.name}<br />{ p.urduName}</td>
                                            <td>{p.category}</td>
                                            <td>{p.model}</td>
                                            <td>{p.quality}</td>
                                            <td>{p.quantity}</td>
                                            <td>{p.p_price}</td>
                                            <td>{p.s_price}</td>
                                            <td>{p.author}</td>
                                            <td><input type="checkbox" name="isFeatured" checked={`${p.isFeatured===true?"checked":""}`} onChange={(e)=>markProductFeatured(e.target.checked,p._id)} /></td>
                                            <td>{dayjs(p.createdAt).format("DD/MM/YY HH:MM:ss")}</td>
                                            <td className="actionLink" colSpan="3" style={{"minWidth":"80px"} }>
                                                
                                                <Link to={`/admin/product/addMorePhotes/${p._id}`}> <i className="bi bi-file-plus" title={`Add or Change Product Photoes!`}></i></Link> 
                                                | <Link to={`/admin/update-product/${p._id}`}> <i className="bi bi-pencil-square" title={` Click to Edit ${p.name}!`}></i></Link> 

                                                | <Link onClick={() => deleteProductById(p._id)}> <i className="bi bi-trash3 text-danger" aria-label={`Delete ${p.name}!`} title={` Click to delete ${p.name}!`}></i> </Link>
                                            </td>
                                        </tr>

                                        

                                    ))
                                }
                            </tbody>
                            </table>
                            <Pagination totalPosts={products.length} postPerPage={productPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        </div>
                    </div>
                </>)}
        </AdminLayout>
    </>)

}
export default AllProducts;