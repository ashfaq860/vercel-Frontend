import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector, useDispatch } from 'react-redux';
import {  getAllCat, getProductById, updateProduct } from "../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/input/textInput";
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";
import toast from 'react-hot-toast';
import { resetUser } from "../../store/userSlice";

const UpdateProduct = () => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const auth     = useSelector(state => state.user.auth);
    const username = useSelector(state => state.user.username);
    const { pId }  = useParams();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [urduName, setUrduName] = useState('');
    const [model, setModel] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [p_price, setP_price] = useState('');
    const [s_price, setS_price] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quality, setQuality] = useState('');
    const [photo, setPhoto] = useState('');
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState('');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [catName, setCatName] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const user = useSelector(state => state.user._id);

    const handleImageClick = () => {
        inputRef.current.click();
    }

    const getSingleProduct = async() => {
        try {
            const response = await getProductById(pId);
            console.log(response.data);
            if (response.status == 200) {
                setShippingPrice(response?.data?.product?.shippingCost);
                setName(response?.data?.product?.name);
                setUrduName(response?.data?.product?.urduName);
                setModel(response?.data?.product?.model);
                setManufacturer(response?.data?.product?.manufacturer);
                setP_price(response?.data?.product?.p_price);
                setS_price(response?.data?.product?.s_price);
                setDesc(response?.data?.product?.desc);
                setTags(response?.data?.product?.tags);
                setQuantity(response?.data?.product?.quantity);
                setQuality(response?.data?.product?.quality);
                setPhoto(response?.data?.product?.photo);
                setCategory(response?.data?.product?.cId);
                setAuthor(response?.data?.product?.author?._id);
                setCatName(response?.data?.product?.category);
               
               
            }
        } catch (error) {
            console.log(error);
        }
    }
    // get vehicle types function
    const getAllcategories = async () => {
        const response = await getAllCat();
        if (response.status == 200) {
            //console.log(response.data.categories);
            setCategories(response.data.categories);
        }
    }
    useEffect(() => {
        getSingleProduct();
        getAllcategories();
    }, []);


   
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
            urduName,
            category,
            model,
            manufacturer,
            p_price,
            s_price,
            quantity,
            quality,
            photo,
            pId,
            author:user,
            desc,
            tags,
            shippingCost:shippingPrice
        };
        console.log(data);
        try {
            const response = await updateProduct(data);

            setLoading(false);
            if (response.status == 200) {
                navigate("/admin/productList");
            } else if (response.status === 500 && response.response.data.message === "jwt expired") {
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
    }
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <h1 className="text-center p-3"><GoBack link="/admin/productList" title="Go Back" /><b>Update Product</b></h1>
                <div style={{ "width": "100vh", "margin": "auto" }}>
                    <div className="row">
                        <div className="col-md-6 col-12"> {/*  Start First columns of Input fields */}
                            <div className="form-floating mb-3">
                                <TextInput
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=> setName(e.target.value)}
                                    name="name"
                                    value={name}
                                    placeholder="Product Name"
                                />
                                <label for="floatingInput">Product Name</label>
                              
                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="text"
                                    className="form-control"
                                    onChange={(e)=> setUrduName(e.target.value)}
                                    value={urduName}
                                    name="urduName"
                                    placeholder="نام اردو میں تحریر کریں"
                                />
                                <label for="floatingInput">چیز کانام اردو میں تحریر کریں</label>
                             

                            </div>
                        <div className="form-floating mb-3">
                                <select className="form-select" onChange={(e)=>setCategory(e.target.value)}  name="category" id="floatingSelect" aria-label="Floating label select example" >
                                    <option selected>Select Vehicle</option>
                                    {
                                        categories.map((cat, i) => (

                                            < option key={i} selected={`${cat._id===category? 'selected':''}`} value={`${cat._id}`} > {cat.name}</option>
                                        ))
                                    }

                                </select>
                                <label for="floatingSelect">Select Vehicle</label>
                              

                            </div>
                            <div className="form-floating mb-3">
                                <select className="form-select" onChange={(e)=> setModel(e.target.value)} name="model" id="floatingSelect" aria-label="Floating label select example" >
                                    <option selected>Select Vehicle Model</option>
                                    <option value="New" selected={`${model === 'New' ? 'selected' : ''}`}>New</option>
                                    <option value="Old" selected={`${model === 'Old' ? 'selected' : ''}`}>Old</option>
                                    <option value="Both" selected={`${model === 'Both' ? 'selected' : ''}`}>Both</option>

                                </select>
                                <label for="floatingSelect">Select Model</label>
                               
                            </div>


                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="text"
                                    className="form-control"
                                    name="manufacturer"
                                    onChange={(e) => setManufacturer(e.target.value)}
                                   
                                    value={manufacturer}
                                    placeholder="Manufacturer Name"
                                />
                                <label for="floatingInput">Manufacturer Name</label>
                               

                            </div>
                            <div className="form-floating mb-3" >
                                <textarea
                                    className="form-control"
                                    onChange={(e)=>setDesc(e.target.value)}
                                    value={desc}
                                    name="desc"
                                    id="desc"
                                    rows="10"
                                    placeholder="Write Product Description"
                                >
                                </textarea>
                                <label for="floatingInput">Description*</label>
                              
                            </div>
                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="text"
                                    className="form-control"
                                    name=" tags"
                                    onChange={(e) => setTags(e.target.value)}
                                    value={tags}
                                    placeholder="set Tags"
                                />
                                <label for="floatingInput">Tags</label>
                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="Number"
                                    className="form-control"
                                    name="shippingCost"
                                    onChange={(e) => setShippingPrice(e.target.value)}
                                    value={shippingPrice}
                                    placeholder="set Shipping Cost"
                                />
                                <label for="floatingInput">Shipping Cost</label>
                             </div>

                        </div>{ /* End First columns of Input fields */}

                        <div className="col-md-6 col-12"> { /*  Start Second columns of Input fields */}
                             <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="p_price"
                                    onChange={(e) => setP_price(e.target.value)}
                                   value={p_price}
                                    placeholder="Purchase Price"
                                />
                                <label for="floatingInput">Puchase Price</label>
                            

                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="s_price"
                                    onChange={(e) => setS_price(e.target.value) }
                                   
                                    value={s_price}
                                    placeholder="Sale Price"
                                />
                                <label for="floatingInput">Sale Price</label>
                               

                            </div>

                            <div className="form-floating mb-3" >
                                <TextInput
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    onChange={(e) => setQuantity(e.target.value)}
                                    value={quantity}
                                    placeholder="Quantity"
                                />
                                <label for="floatingInput">Quantity*</label>
                            </div>

                            <div className="form-floating mb-3">
                                <select className="form-select" onChange={(e)=> setQuality(e.target.value)}  name="quality" id="floatingSelect" aria-label="Floating label select example" >
                                    <option selected>Please Select Quality</option>
                                    <option value="High" selected={`${quality === 'High' ? 'selected' : ''}`}>High</option>
                                    <option value="Medium" selected={`${quality === 'Medium' ? 'selected' : ''}`}>Medium</option>
                                    <option value="Low" selected={`${quality === 'Low' ? 'selected' : ''}`}>Low</option>
                                </select>
                                <label for="floatingSelect">Select Quality</label>
                            </div>

                            <div className="form-floating" onClick={ handleImageClick }>
                                <input type="file" name="photo" style={{"display":"none"}} ref={ inputRef } class="form-control fileControl" onChange={(e) => getPhoto(e)} id="fileName" placeholder="Upload Image" />

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
                        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}><LoadingButton loading={loading} title="Update Product" /></button>
                    </div>
                </div> { /*  End First columns of Input fields */}

            </div>

        </AdminLayout>
    </>)

}
export default UpdateProduct;
