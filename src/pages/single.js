import Layout from "../components/layout/layout";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WriteReview from "../components/products/item/writeReview";
import './pages.css';
import RelatedProducts from "../components/products/relatedProducts";
import SideBarProducts from "../components/products/sidebarProducts";
import SinglePageFoot from "../components/footer/singlePageFoot";
import { getProductById, getPhotosByProductId, getReviewByProductId } from "../api/internal";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
import ReviewList from "../components/products/item/reviewList";
import { Helmet } from 'react-helmet-async';

import { addToCartQty, updateQuantity } from "../store/cartSlice";
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
const Single = () => {
    const { id } = useParams();
    console.log(id);
    const dispatch = useDispatch();
    /*get all reviews function */
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [averageReviews, setAverageReviews] = useState();
    const getReviews = async () => {
        const response = await getReviewByProductId(id);
        if (response?.status === 200) {
            setReviews(response?.data?.reviews);
            setTotalReviews(Object.keys(response?.data?.reviews)?.length);
        } else {
            alert("Error while Getting Reviews")
        }
    }

    useEffect(() => {
        getReviews();
    }, [id]);
    useEffect(() => {
        let total = reviews?.reduce((acc, curr) => acc + Number(curr.star), 0);
         setAverageReviews(total / totalReviews);
    }, [reviews]);

    const [qty, setQty] = useState(0);
    const [ product, setProduct ] = useState([]);
    const [photo1, setPhoto1]= useState("");
    const [photo2, setPhoto2]= useState("");
    const [photo3, setPhoto3]= useState("");
     const [photo4, setPhoto4]= useState("");
    const [activePhoto,setActivePhoto] =  useState("");
    const scrollToWriteReview = () => { window.scroll(0, 500); }
    const getSingleProduct = async () => {
        const response = await getProductById(id);
        if (response) {
            setProduct(response?.data?.product);
        console.log(response?.data?.product);
        }
    }

    /**Get product photoes Functions*/
    const productPhotoes    =  async()=>{
      const {data} =    await getPhotosByProductId(id);
      
      if(data?.images!==null){
          setPhoto1(data?.images?.photoPath1);
           setPhoto2(data?.images?.photoPath2);
            setPhoto3(data?.images?.photoPath3);
            setPhoto4(data?.images?.photoPath4);
      }
  }

  /*set Active Photo */
   useEffect(() => {
        getSingleProduct();
        productPhotoes();
    },[id]);
    const mainPhoto  = (photo)=>{
      setActivePhoto(photo);
    }

    /**add to cart function*/
    const AddInCart = (product) => {
       
      const   p = {
            id: product?._id,
            name: product?.name,
            urduName: product?.urduName,
            photo: product?.photo,
            avgStar: averageReviews,
            category: product?.category,
            totalReviews:totalReviews,
            manufacturer: product?.manufacturer,
            price: product?.s_price,
          quantity: qty,
            shippingCost:product?.shippingCost

        }
    
        dispatch(addToCartQty(p));
         
        window.scroll(0, 0);

       
        toast.success(product?.name + " successfully added to cart.");

    }


    return (
     <>
            <Layout>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{`${product?.name} ${product?.category} ${product?.manufacturer}`}-Mian Motorcycle Parts Shop Raiwind</title>
                    <meta name="description" content={`${product?.name} ${product?.category?.name} ${product?.manufacturer} Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind`} />
                </Helmet>
                <div className="container latestProduct">
                    <div className="row mt-2">
                        <div className="col-md-4 col-lg-3 col-xs-12 order-2 order-md-1 mt-3">   
                        <SideBarProducts />
                        </div>
                        <div className="col-lg-9 col-md-8 order-1  order-md-2 col-xs-12 mt-3">
                            <div className="row">
                                <div className="col-lg-6 col-12 imageGallery ">{ /* Start Product Image gallery */ }
                                    <div className="imageGallery d-flex flex-column">
                                        {/* In your image gallery inside JSX: */}
                                        <div className="text-center border" id="MainImage">
                                            {(activePhoto || product?.photo) ? (
                                                <InnerImageZoom
                                                    src={activePhoto === "" ? product?.photo : activePhoto}
                                                    zoomSrc={activePhoto === "" ? product?.photo : activePhoto}
                                                />
                                            ) : (
                                                <p>Image not available</p>
                                            )}
                                        </div>

                                        {/* Inside the thumbnail section: add conditional checks for images */}
                                        <div className="thumbNail align-self-center">
                                            {photo1 && (
                                                <img
                                                    src={photo1}
                                                    className={`float-start ${activePhoto === photo1 ? "border border-2 border-primary" : ""}`}
                                                    alt="thumbnail-1"
                                                    onClick={() => mainPhoto(photo1)}
                                                    height="60"
                                                    width="70"
                                                />
                                            )}
                                            {photo2 && (
                                                <img
                                                    src={photo2}
                                                    className={`float-start ${activePhoto === photo2 ? "border border-2 border-primary" : ""}`}
                                                    alt="thumbnail-2"
                                                    onClick={() => mainPhoto(photo2)}
                                                    height="60"
                                                    width="70"
                                                />
                                            )}
                                            {photo3 && (
                                                <img
                                                    src={photo3}
                                                    className={`float-start ${activePhoto === photo3 ? "border border-2 border-primary" : ""}`}
                                                    alt="thumbnail-3"
                                                    onClick={() => mainPhoto(photo3)}
                                                    height="60"
                                                    width="70"
                                                />
                                            )}
                                            {photo4 && (
                                                <img
                                                    src={photo4}
                                                    className={`float-start ${activePhoto === photo4 ? "border border-2 border-primary" : ""}`}
                                                    alt="thumbnail-4"
                                                    onClick={() => mainPhoto(photo4)}
                                                    height="60"
                                                    width="70"
                                                />
                                            )}
                                        </div>

                                    </div>
                                </div> { /* End Product Image gallery */ }
                                <div className="col-lg-6 col-12">
                                    <h3 className="mt-3 card-title text-uppercase">{product?.name} {product?.urduName}</h3>
                                    <div className="d-flex flex-row">{ /* start stars row */}
                                        <div className="p-1">
                                            {[...Array(5)].map((_, i) => {
                                                return <span key={i} className={`${i < averageReviews ? "selected" : ""}`} style={{"fontSize":"18px"} } >&#9733;</span>
                                            })}
                                       </div>
                                        <div className="p-1">
                                            &nbsp; | &nbsp; {totalReviews} reviews &nbsp;| &nbsp; <span onClick={scrollToWriteReview} className="writeReview">Write a Review</span> 
                                        </div>
                                    </div>{ /* end stars row */}
                                    { /* start Price row */}
                                    <div className="d-flex flex-row justify-content-between">
                                        <div className="p-1">
                                            <h3>Rs. { product?.s_price} </h3>
                                        </div>
                                        <div className="p-1">
                                            <p>
                                                Availability: {product?.quantity > 0 ? (<><span className="text-success"> <i className="bi bi-check2-square"></i> Instock</span> </>)
                                                    :
                                                    (<><span className="text-danger"> <i className="bi bi-check2-square "></i> Out stock</span> </>)}  
                                            </p>
                                        </div>
                                     </div>
                                    { /* end Price row */}
                                    <div className="proDesc">
                                        <div className="innerDesc background-secondary">
                                            <p style={{ 'background': '#f6f2f1' }} className="p-2"><b>Fit In:</b>  <span className="text-uppercase">{ product?.category?.name}</span> <br />
                                                <b>Model:</b>   <span className=" text-uppercase">{ product?.model }</span> <br />
                                                <b>Company:</b> <span className=" text-uppercase">{product?.manufacturer }</span> <br />
                                                <b>Quality:</b> <span className=" text-uppercase">{product?.quality}{ product?.quantity}</span>
                                           </p>
                                        </div>
                                    </div>
                                    <p>&nbsp;</p>
                                  <div className="incDec">
                                            <b>Quantity:</b>
                                            <button onClick={() => setQty(qty !== 0 ? (Number(qty) - Number(1)) : (Number(qty) - Number(0)))}><i className="bi bi-cart-dash"></i></button>
                                            <input type="text" min="0" maxLength={ `${product?.quantity}` } value={qty} onChange={(e) => setQty(e.target.value)} />
                                            <button onClick={() => setQty(Number(qty) + Number(1))}><i className="bi bi-cart-plus"></i></button>
                                        </div>
                                    <button className={`btn addTocart-btn  mt-3 ${product?.quantity <1 ? "disabled" : "enabled"}`} onClick={() => AddInCart(product)}>Add To Cart &nbsp;<i className="bi bi-cart"></i></button>
                                </div>
                            </div>

                            { /* Starts Review Information starts */ }
                        <div className="row">
                                <div className="col-12 singlePage mt-4 h-100">
                                   <div className="row">
                                        <div className="col-3 d-flex  flex-row flex-grow-1 align-items-start navPills-Container ps-0 " >
                                        <div className="nav flex-column nav-pills me-5 h-100 " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                        <button className="nav-link active" id="InfoTab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Details</button>
                                        <button className="nav-link" id="writeReview" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Write Review</button>
                                        <button className="nav-link" id="Reviews" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Reviews</button>
                                    </div>
                                            <div className="col-9 tab-content align-items-center" id="v-pills-tabContent">
                                            <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="InfoTab">
                                                    <div className="p-3" > 
                                                        <h3><b>{product?.name}</b></h3>
                                           <p> <b>{product?.name} {product?.urduName}</b> is specially designed for <b>{ product?.category}, {product?.model} Model,</b> Motocycle. 
                                            It is a <b>{product?.quality} </b>quality product, developed by <b>{product?.manufacturer}</b> Company.  
                                                        </p>

<p>                                                        {product?.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="writeReview">
                                                {<WriteReview pId={id} />}
                                            </div>
                                            <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="Reviews">
                                                    <ReviewList pId={id} reviews={reviews} />
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { /* Ends Review Information starts */}
                         </div>
                    </div>

                    { /* Related Products Block */}
                    { /* <RelatedProducts  cId={product?.category?._id} /> */ }
                </div>
                {<SinglePageFoot />}
            </Layout>
        </>
    );
}
export default Single;
