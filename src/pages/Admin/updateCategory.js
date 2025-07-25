import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { getCatById,  updateCategory } from "../../api/internal";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";
const UpdateCategory = () => {
    const { id } = useParams();
    const navivagate = useNavigate();  
    const [photo, setPhoto]         = useState('');
    const [name, setName]           = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
   
    const author = useSelector(state => state.user._id);
    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        setPhoto(reader.result);
        }
    }

    const getSelectedCat = async () => {
  
        try {
            const response = await getCatById(id);
            if (response.status === 200) {
                setName(response.data.category.name);
                setSlug(response.data.category.slug);
                setPhoto(response.data.category.photo)
              //  console.log(response.data.category);
            }
        } catch (error) {
            console.log(error);
        }
 }
    const handleSubmit = async () => {
        setLoading(true);
    const data = {
            name,
            slug,
            categoryId:id,
            photo:photo
    };
        try {
            const response = await updateCategory(data);
            setLoading(false);
            if (response.status == 201) {
               
                navivagate("/admin/catList");
            } else {
                alert(response.message);
            }
        } catch (error) {
            setLoading(false);
            alert(error.message);
            console.log(error);
        }
    }
    useEffect(() => {
        getSelectedCat();;
    }, []);
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">

                <h1 className="text-center p-3"><GoBack link="/admin/catList" title="Go Back" /><b>Update Category</b></h1>
                <div style={{ "width": "70vh", "margin": "auto" }}>
                    <div className="form-floating mb-3" >
                        <input type="text" className="form-control" id="catName" onChange={(e) => setName(e.target.value)} value={name || ""} placeholder="Category Name" />
                        <label htmlFor="floatingInput">Category Name</label>
                    </div>
                    <div className="form-floating mb-3" >
                        <input type="text" className="form-control" id="slug" onChange={(e) => setSlug(e.target.value)} value={slug || ""} placeholder="slug" />
                        <label htmlFor="floatingInput">Categor Slug</label>
                    </div>

                    <div className="form-floating">
                        <input type="file" className="form-control fileControl" onChange={(e) => getPhoto(e)} id="fileName" placeholder="Upload Image" />

                    </div>
                    {photo? (<>
                        <div className="img mt-3 text-center">
                            <img src={photo } height="180" width="180" />
                        </div>

                    </>) : (<></>)}
                    <div className="mt-3">
                        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}><LoadingButton loading={loading} title="Update Category"/></button>
                    </div>
                </div>

            </div>

        </AdminLayout>
    </>)

}
export default UpdateCategory;