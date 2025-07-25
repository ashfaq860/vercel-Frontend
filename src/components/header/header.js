import "./header.css";
import { Link, NavLink } from "react-router-dom";
import TopHeader from "./topHeader";
import MidHeader from "./midHeader";
import MiniCart from "./minicart/miniCart";
import { useEffect, useState } from "react";
import { getAllCat } from "../../api/internal";
const Header = ({ facebookId, twitterId, whatsAppId, tiktokId, phone, logo }) => {
    const [categories, setCategories] = useState([]);
    const getAllcategories = async () => {
        try {
            const res = await getAllCat();
            setCategories(res.data.categories);
           // console.log(categories);
        } catch (error) {
            console.log(error);
        }
    }
   // console.log(logo)
    useEffect(() => {
        getAllcategories();
       
    }, []);
	return (
		<>
            <header>
                {<TopHeader
                    facebookId={facebookId}
                    tiktokId={tiktokId}
                    whatsAppId={whatsAppId}
                    twitterId={twitterId}
                    phone={phone }
                />}
                {<MidHeader
                    logo={logo }
                />}
                <nav className="navbar navbar-expand-lg" style={{ 'borderBottom':'3px solid #ff2d37','padding':'0px'} }>

                    <div className="container-fluid">
                        { /*
                        <Link className="navbar-brand" to="/"><img src="icons/logo.png" alt="Registered User Login" className="img-fluid d-block d-lg-none" /></Link>
                       Start of small screen shopping cart button */}
                       
                        {/* End of small screen shopping cart button */ }
                        <button style={{'marginLeft':'24px'}} className="navbar-toggler miniNavButton" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <button style={{ "border": "none", "paddingRight": "0px", "marginRight":"16px"}} className="navbar-toggler m-e miniCartSmallScreenButton" type="button"  aria-controls="navbarSupportedContent"  >
                            <MiniCart />
                        </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item" >
                                    <NavLink
                                        to="/"

                                        className={({ isActive, isPending }) =>
                                            isPending ? "pending nav-link" : isActive ? "active nav-link" : " nav-link"
                                        }

                                    >
                                        <strong> HOME</strong>
                                    </NavLink>

                                </li>
                                {categories.map((cat, i) => (
                                    <li className="nav-item" key={i}>
                                        <NavLink
                                            to={`/category/${cat.name}/${cat._id}`}
                                            
                                            className={({ isActive, isPending }) =>
                                                isPending ? "pending nav-link" : isActive ? "active nav-link" : " nav-link"
                                            }

                                        >
                                            <strong> {cat.name}</strong>
                                        </NavLink>

                                    </li>
                                ))}
                                

                                <li className="nav-item">
                                    <NavLink
                                        to="/page/about-us"
                                        className={({ isActive, isPending }) =>
                                            isPending ? "pending nav-link" : isActive ? "active nav-link" : " nav-link"
                                        }

                                    >
                                      <strong> About us</strong>
                                    </NavLink>
                                </li>


                        </ul>
                    </div>
                </div>
                    </nav>
               
            </header>
		</>
	);
}
export default Header;