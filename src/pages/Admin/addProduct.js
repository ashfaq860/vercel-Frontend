import { useState,useEffect, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, getAllCat} from "../../api/internal";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/input/textInput";
import productSchema from "../schemas/productSchema";
import LoadingButton from "../loader/loadingButton";
import toast from "react-hot-toast";
import { resetUser } from "../../store/userSlice";
const AddProduct = () => {
    const inputRef = useRef(null);
    const [photo, setPhoto] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const author = useSelector(state => state.user._id);
    const dispatch = useDispatch();
 const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: '',
            urduName:'',
            vehicle: '',
            model:'',
            manufacturer:'',
            p_price: '',
            s_price: '',
            quantity: '',
            quality: '',
           category: '',
            desc: '',
            tags:''
        },
        validationSchema:productSchema
    });
    // get vehicle types function
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


    const handleImageClick = () => {
        inputRef.current.click();
    }
    // photo select Function when click on photo thumnail this function calls
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
            name: values.name,
            urduName: values.urduName,
            category: values.vehicle,
            model:values.model ,
            manufacturer: values.manufacturer,
            p_price: values.p_price,
            s_price: values.s_price,
            quantity: values.quantity,
            quality: values.quality,
            desc:values.desc,
            photo,
            shippingCost:values.shippingCost,
            tags:values.tags,
            author
        };
            console.log(data);
        if (Object.keys(errors).length<1) {

            try {
                const response = await createProduct(data);
                console.log(response)
                setLoading(false);
                if (response.status == 201) {

                    navigate("/admin/productList");
                } else if (response.status === 500 && response.response.data.message==="jwt expired") {
                    toast.error("Your Session has expired !");
                    //Logout user if session has expired
                    dispatch(resetUser());
                  
                    navigate('/login');
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                setLoading(false);
                alert(error.message);
                console.log(error);
            }
        } else {
            toast.error(Object.keys(errors).length);
            setLoading(false);
        }
    }
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
            <h1 className="text-center p-3"><b>Add New Product</b></h1>
                <div style={{ "width": "100vh", "margin": "auto" }}>
                <div className="row">
                    <div className="col-md-6 col-12"> { /*  Start First columns of Input fields */ }
                        <div className="form-floating mb-3">
                            <TextInput
                                type="text"
                                className="form-control"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="name"
                                value={values.name}
                                placeholder="Product Name"
                            />
                            <label for="floatingInput">Product Name*</label>
                            {errors.name && touched.name ? (<><p className="text-danger">{errors.name}</p></>) : (<></>)}
                        </div>

                        <div className="form-floating mb-3" >
                            <TextInput
                                type="text"
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur }
                                value={values.urduName}
                                name="urduName"
                                placeholder="نام اردو میں تحریر کریں"
                            />
                            <label for="floatingInput">*چیز کانام اردو میں تحریر کریں</label>
                                {errors.urduName && touched.urduName ? (<><p className="text-danger">{errors.urduName}</p></>) : (<></>)}

                            </div>


                        <div className="form-floating mb-3">
                                <select className="form-select" onChange={handleChange} onBlur={handleBlur} name="vehicle" id="floatingSelect" aria-label="Floating label select example" >
                                <option selected>Select Vehicle</option>
                                {
                                    categories.map((cat, i) => (

                                        < option key={i} value={`${cat._id}` } > { cat.name }</option>
                                    ))
                                    }
                               
                            </select>
                            <label for="floatingSelect">Select Vehicle*</label>
                                {errors.vehicle && touched.vehicle ? (<><p className="text-danger">{errors.vehicle}</p></>) : (<></>)}

                            </div>



                        <div className="form-floating mb-3">
                                <select className="form-select" onChange={handleChange} onBlur={ handleBlur} name="model" id="floatingSelect" aria-label="Floating label select example" >
                                <option selected>Select Vehicle Model</option>
                                <option value="New">New</option>
                                <option value="Old">Old</option>
                                <option value="Both">Both</option>
                                
                            </select>
                            <label for="floatingSelect">Select Model*</label>
                                {errors.model && touched.model ? (<><p className="text-danger">{errors.model}</p></>) : (<></>)}

                            </div>


                        <div className="form-floating mb-3" >
                            <TextInput
                                type="text"
                                className="form-control"
                                name="manufacturer"
                                onChange={handleChange}
                                onBlur={handleBlur }
                                value={values.manufacturer}
                                placeholder="Manufacturer Name"
                            />
                                <label for="floatingInput">Manufacturer Name*</label>
                                {errors.manufacturer && touched.manufacturer ? (<><p className="text-danger">{errors.manufacturer}</p></>) : (<></>)}

                            </div>

                            <div className="form-floating mb-3">
                                <select className="form-select" onChange={handleChange} onBlur={handleBlur} name="quality" id="floatingSelect" aria-label="Floating label select example" >
                                    <option selected>Please Select Quality</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <label for="floatingSelect">Select Quality*</label>
                                {errors.quality && touched.quality ? (<><p className="text-danger">{errors.quality}</p></>) : (<></>)}
                            </div>

                            <div className="form-floating mb-3" >
                                <textarea
                                    className="form-control"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.desc}
                                    name="desc"
                                    id="desc"
                                   rows="10"
                                    placeholder="Write Product Description"
                                >
                                </textarea>
                                <label for="floatingInput">Description*</label>
                                {errors.urduName && touched.urduName ? (<><p className="text-danger">{errors.urduName}</p></>) : (<></>)}

                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="text"
                                    className="form-control"
                                    name="tags"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.tags}
                                    placeholder="Tags"
                                />
                                <label for="floatingInput">Tags*</label>
                                {errors.tags && touched.tags ? (<><p className="text-danger">{errors.tags}</p></>) : (<></>)}

                            </div>

                    </div>{ /* End First columns of Input fields */ }

                    <div className="col-md-6 col-12"> { /*  Start Second columns of Input fields */ }
                       <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="p_price"
                                    onChange={handleChange}
                                    onBlur={handleBlur }
                                    value={values.p_price}
                                    placeholder="Purchase Price"
                                />
                                <label for="floatingInput">Puchase Price*</label>
                                {errors.p_price && touched.p_price ? (<><p className="text-danger">{errors.p_price}</p></>) : (<></>)}

                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="s_price"
                                    onChange={handleChange}
                                    onBlur={handleBlur }
                                    value={values.s_price}
                                    placeholder="Sale Price"
                                />
                                <label for="floatingInput">Sale Price*</label>
                                {errors.s_price && touched.s_price ? (<><p className="text-danger">{errors.s_price}</p></>) : (<></>)}
                            </div>


                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.quantity}
                                    placeholder="Quantity"
                                />
                                <label for="floatingInput">Quantity*</label>
                                {errors.quantity && touched.quantity ? (<><p className="text-danger">{errors.quantity}</p></>) : (<></>)}
                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="shippingCost"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.shippingCost}
                                    placeholder="Shipping Cost"
                                />
                                <label for="floatingInput">Shipping Cost*</label>
                                {errors.shippingCost && touched.shippingCost ? (<><p className="text-danger">{errors.shippingCost}</p></>) : (<></>)}
                            </div>


                            <div className="form-floating" onClick={handleImageClick }>
                                <input type="file" style={{ "display": "none" }} ref={ inputRef} name="photo" class="form-control fileControl" onChange={(e) => getPhoto(e)} id="fileName"   placeholder="Upload Image" />
                                
                                {photo ? (<>
                                    <div className="img mt-3 text-center">
                                        <img src={photo} height="260" width="280" />
                                    </div>
                                </>) : (<> <img src="/icons/productImage.png" height="260" width="280" /></>)
                                }
                            </div>
                            
                            
                    </div>

                </div>

                   
                   
                   
                    <div className="mt-3">
                        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}><LoadingButton loading={loading} title="Add Product"/> </button>
                    </div>
                </div> { /*  End First columns of Input fields */}

            </div>

        </AdminLayout>
    </>)

}
export default AddProduct;