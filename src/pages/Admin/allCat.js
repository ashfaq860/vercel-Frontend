import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { deleteCategory, getAllCat } from "../../api/internal";
import { useEffect } from "react";
import { Link} from "react-router-dom";
import Loader from "../loader/loader";

const AllCat = () => {
    
    const [categories, setCategories] = useState([]);
    const author = useSelector(state => state.user._id);
    console.log(author);
     const getAllcategories = async () => {
        const response = await getAllCat();
                if (response.status == 200) {
                    console.log(response.data.categories);
                    setCategories(response.data.categories);
                }
             }
    useEffect(() => {

        getAllcategories();
    }, []);
   /*
    useEffect(() => {

        (async function getAllCategories() {


           
                const response = await getAllCat();
                if (response.status == 200) {
                    console.log(response.data.categories);
                    setCategories(response.data.categories);
                    

                }
            
            }
        )();
        setCategories([]);
    },[]);
    */
    const deleteCat = async(e) => {
        const check =    window.confirm("Do you want to delete category?");
        if (check) {

            const response = await deleteCategory(e);
            if (response.status == 200) {
                getAllcategories();
            }

        }
    }
 
    return (<>
        <AdminLayout>
            {categories.length === 0 ? (<><Loader text="Categories" /></>)
                : (<>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
            <h1 className="text-center m-3">All Categories</h1>
                <table className="table align-middle">
                    <thead>
                        <tr> 
                            <th scope="col">#</th>
                            <th scope="col">Photo</th>
                            <th scope="col">Name</th>
                            <th scope="col">Slug</th>
                            <th scope="col">Author</th>
                            <th scope="col">Date Time</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {
                            categories.map((cat, i) => (
                                <tr key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td><img src={ cat.photoPath} height="80" width="80" /></td>
                                    <td>{cat.name}</td>
                                    <td>{cat.slug}</td>
                                    <td>{cat.author.name}</td>
                                    <td>{ cat.createdAt}</td>
                                    <td className="actionLink"> <Link to="#" onClick={() => deleteCat(cat._id)}> <i className="bi bi-trash3 text-danger" aria-label="Delete Category"></i> </Link> | <Link to={`/admin/update-category/${cat._id}`}> <i className="bi bi-pencil-square"></i></Link> </td>
                                </tr>



                            ))
                        }
                       </tbody>
                </table>
               
            </div>
                </>)}
        </AdminLayout>
    </>)

}
export default AllCat;