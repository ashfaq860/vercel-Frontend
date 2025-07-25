import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import {  uploadProductPhotoes ,getPhotosByProductId,updateProductPhotoes} from "../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/input/textInput";
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";


const AddMorePhotos = () => {
    const { pId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [photo1, setPhoto] = useState('');
    const [photo2, setPhoto2] = useState('');
    const [photo3, setPhoto3] = useState('');
    const [photo4, setPhoto4] = useState('');
    const [photoes, setPhotoes] = useState();
    const [photoId,setPhotoId]  =   useState(0);
   
    /* Function to get ALl photoes to realted product */
    const getProductPhotoes =   async()=>{
    const res         =  await getPhotosByProductId(pId);
    
    
    if(res.data.images!==null){
    setPhotoes(Object.keys(res.data).length);
    setPhotoId(res.data.images._id)
     setPhoto(res.data.images.photoPath1);
        setPhoto2(res.data.images.photoPath2);
         setPhoto3(res.data.images.photoPath3);
         setPhoto4(res.data.images.photoPath4);
        }
}

   useEffect(()=>{
    getProductPhotoes();
    },[]);

    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhoto(reader.result);
        }
}

/*Function to render photoes and set to the useState */
    const getPhoto2 = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhoto2(reader.result);
        }
 }
    const getPhoto3 = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhoto3(reader.result);
        }

    }
    const getPhoto4 = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhoto4(reader.result);
        }

    }

    /** Function to Enter photo to mongo Db*/
    const handleSubmit = async () => {
        setLoading(true);
        const data = {
            pId:pId,
            photo1: photo1,
            photo2: photo2,
            photo3: photo3,
            photo4:photo4
        };
        try {
            
            const response = await uploadProductPhotoes(data);
            if (response.status == 201) {
                setLoading(false);
                navigate("/admin/productList");
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

    /* function Update photoes if photoes already exists */
        const handleUpdate = async () => {

        const data = {
            pId:pId,
            photoId,
            photo1: photo1,
            photo2: photo2,
            photo3: photo3,
            photo4: photo4
        };
        try {
            
            const response = await updateProductPhotoes(data);
            if (response.status == 201) {
                navigate("/admin/productList");
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert(error.message);
            console.log(error);
        }
    }

    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <h1 className="text-center p-3"><GoBack link="/admin/productList" title="Go Back" /><b>{photoes > 0 ? "Change Photoes" :"Upload Photoes"}</b></h1>
                <div>
                    <div className="row"> {/*start row div photo 1*/ }
                        <div className="col-md-6 col-12 ">
                            <div className="form-floating mt-5 ">
                                <input type="file" name="photo" className="form-control fileControl" onChange={(e) => getPhoto(e)} id="fileName" placeholder="Upload Image" />

                            </div>

                        </div>
                        <div className="col-md-6 col-12">
                            {photo1 ? (<>
                                <div className="img mt-3 text-center border border-2 ">
                                    <img src={photo1} height="120" Style={{ "width": "100%" }} />
                                </div>

                            </>) : (<></>)}
                        </div>
                    </div>{ /*end row div photo 1*/ }


                    <div className="row"> { /*start row div photo 2*/}
                        <div className="col-md-6 col-12 ">
                            <div className="form-floating mt-5 ">
                                <input type="file" name="photo2" className="form-control fileControl" onChange={(e) => getPhoto2(e)} id="fileName" placeholder="Upload Image" />

                            </div>

                        </div>
                        <div className="col-md-6 col-12">
                            {photo2 ? (<>
                                <div className="img mt-3 text-center border border-2 ">
                                    <img src={photo2} height="120" Style={{ "width": "100%" }} />
                                </div>

                            </>) : (<></>)}
                        </div>
                    </div>{ /*end row div photo 1*/}


                    <div className="row"> {/*start row div photo 3*/}
                        <div className="col-md-6 col-12 ">
                            <div className="form-floating mt-5 ">
                                <input type="file" name="photo3" className="form-control fileControl" onChange={(e) => getPhoto3(e)} id="fileName" placeholder="Upload Image" />

                            </div>

                        </div>
                        <div className="col-md-6 col-12">
                            {photo3 ? (<>
                                <div className="img mt-3 text-center border border-2 ">
                                    <img src={photo3} height="120" Style={{"width":"100%"} } />
                                </div>

                            </>) : (<></>)}
                        </div>
                    </div>{ /*end row div photo 1*/}


                    <div className="row"> {/*start row div photo 4*/}
                        <div className="col-md-6 col-12 ">
                            <div className="form-floating mt-5 ">
                                <input type="file" name="photo4" className="form-control fileControl" onChange={(e) => getPhoto4(e)} id="fileName" placeholder="Upload Image" />

                            </div>

                        </div>
                        <div className="col-md-6 col-12">
                            {photo4 ? (<>
                                <div className="img mt-3 text-center border border-2 ">
                                    <img src={photo4} height="120" Style={{ "width": "100%" }} />
                                </div>

                            </>) : (<></>)}
                        </div>
                    </div>{ /*end row div photo 1*/}

                    <div className="mt-3">
                        {photoes > 0 ? (<> <button type="button" onClick={handleUpdate} className="btn btn-lg btn-primary" style={{ "width": "100%" }}>Update Photoes</button></>) : (<> <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}><LoadingButton loading={loading} title="Upload Photoes"/> </button></>)}
                    </div>
                </div> { /*  End First columns of Input fields */}

            </div>

        </AdminLayout>
    </>)

}
export default AddMorePhotos;