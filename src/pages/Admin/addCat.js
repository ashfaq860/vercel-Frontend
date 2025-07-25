import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { submitCategory } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../loader/loadingButton";

const AddCat = () => {
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const author = useSelector(state => state.user._id);
   
    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhoto(reader.result);
        }
       
    }
    const handleSubmit = async () => {
        setLoading(true);
        const data = {
            name,
            slug: name,
            author,
            photo

        };
        try {
            const response = await submitCategory(data);
            if (response.status == 201) {
                setLoading(false);
                navigate("/admin/catList");
            } else {
                setLoading(false);
                alert(response.message);
            }
        } catch (error) {
            setLoading(false);
            alert(error.message);
            console.log(error);
        }
    }
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                
                <h1 className="text-center p-3"><b>Add New Category</b></h1>
                <div style={{ "width": "70vh", "margin": "auto" }}>
                    <div className="form-floating mb-3" >
                        <input type="text" class="form-control" id="catName" onChange={(e) => setName(e.target.value)} value={name} placeholder="Category Name" />
                    <label for="floatingInput">Category Name</label>
                </div>
                <div className="form-floating">
                        <input type="file" class="form-control fileControl" onChange={(e) => getPhoto(e)} id="fileName" placeholder="Upload Image"/>
                 
                    </div>
                    {photo ? (<>
                        <div className="img mt-3 text-center">
                            <img src={photo} height="180" width="180" />
                        </div>

                    </>) : (<></>)}
                                       <div className="mt-3">
                        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}><LoadingButton loading={loading} title="Add Category" /> </button>
                    </div>
                </div>

            </div>
       
        </AdminLayout>
    </>)

}
export default AddCat;