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
   // console.log(id);
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
     //   getReviews();
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
        console.log(response?.data?.product?.category?._id);
        }
    }

    /**Get product photoes Functions
    const productPhotoes    =  async()=>{
      const {data} =    await getPhotosByProductId(id);
      
      if(data?.images!==null){
          setPhoto1(data?.images?.photoPath1);
           setPhoto2(data?.images?.photoPath2);
            setPhoto3(data?.images?.photoPath3);
            setPhoto4(data?.images?.photoPath4);
      }
  }
*/
  /*set Active Photo */
   useEffect(() => {
        getSingleProduct();
       // productPhotoes();
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
        <h1>Single Product page</h1>
     
        </>
    );
}
export default Single;
