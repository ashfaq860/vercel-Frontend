import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCat } from "../../api/internal";
import CategoryList from "../products/categoryList";
import PageList from "../products/item/pageList";
import "./footer.css";
import InfoPagesList from "./infoPagesList";

const Footer = ({email,address,timing,phone,logo }) => {
   // console.log(email, address, timing, phone, logo);
    const [categories, setCategories] = useState([]);
    const getAllcategories = async () => {
        try {
            const res = await getAllCat();
            setCategories(res.data.categories);
            //console.log(categories);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getAllcategories();
    }, []);
    const [isVisible, setIsVisible] = useState(false);

    // Show/hide button based on scroll
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return (
        <>
            <div className="container-fluid mt-3 " style={{'background':'#282828'} }>
                <div className="container scrollShow">
                        <div className="row footer" >
                        <div className="col-lg-3 col-sm-6 pt-2">
                            <h2>Contact Us</h2>
                            <ul>
                                <li><i className="bi bi-geo-alt-fill"></i> { address}</li>
                                <li><i className="bi bi-telephone-fill"></i> { phone} </li>
                                <li> <i className="bi bi-envelope-fill"></i> { email} </li>
                                <li> <i className="bi bi-alarm-fill"></i> { timing} </li>


                               
                            </ul>
                        </div>
                        <div className="col-lg-3 col-sm-6 pt-3">
                            <h2>Information</h2>
                           <PageList/>
                        </div>
                        <div className="col-lg-3 col-sm-6 pt-3">
                            <h2>Categories</h2>
                            <ul>
                            <CategoryList />
                            </ul>

                        </div>
                        <div className="col-lg-3 col-sm-6 pt-3">
                            {/* <h2>Fancy Material</h2>
                            <ul>
                                <li><Link to="">Spot Lights</Link></li>
                                <li><Link to="">Head Lights</Link></li>
                                <li> <Link to="">Tanki Tapay</Link></li>



                            </ul>
                            */}
                            <Link to="/">
                                <img src={logo} alt="Mian Auto Parts" className="img-fluid" style={{ "height": "120px", "width": "85%" }} />
                            </Link>
                        </div>

                        </div>
                </div>
               
            </div>
            {isVisible && (<div className="backToTop" onClick={scrollToTop}><i className="bi bi-arrow-up-square-fill"></i></div>)}   
        </>
    );
  
}
export default Footer;