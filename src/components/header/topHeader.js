import "./header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { resetUser } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

const TopHeader = ({ facebookId, twitterId, whatsAppId, tiktokId, phone }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.user.auth);
 
    const username = useSelector(state => state.user.username);
    const logOut = () => {
        navigate('/login');
        dispatch(resetUser());
       
    }
   
    return (
        <>
            <div className="container-fluid" style={{ 'background': '#282828' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="container">
                            <div className="row">
                                <div className="d-flex bd-highlight pr-5">

                                    <div className="bd-highlight topNavLeft">
                                        <div className=" d-none d-md-block">
                                        <ul className="d-inline-flex socialIcons">
                                           
                                            <li>
                                                    <a aria-current="page" target="_blank" rel="noopener noreferrer" href={ facebookId}><i className="bi bi-facebook"></i></a>
                                            </li>
                                            <li>
                                                    <a target="_blank" rel="noopener noreferrer" href={twitterId}><i className="bi bi-twitter"></i></a>
                                            </li>
                                            <li>
                                                    <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${whatsAppId}`}><i className="bi bi-whatsapp"></i></a>
                                            </li>
                                            <li>
                                                    <a target="_blank" rel="noopener noreferrer" href={tiktokId}><i className="bi bi-tiktok"></i></a>
                                            </li>
                                        </ul>
                                     
                                        </div>
                                   </div>
                                    <div className="bd-highlight">
                                        <p className="telephone"><i className="bi bi-phone-fill"> &nbsp;</i>{ phone }</p>

                                    </div>
                                    <div className="ms-auto  bd-highlight register">
                                        {auth==true? (<>
                                            <NavLink
                                                to="/admin/my-account"
                                                className={({ isActive, isPending }) =>
                                                    isPending ? "pending nav-link" : isActive ? "active" : " "
                                                }

                                            >
                                              {username }
                                            </NavLink>
                                            / <NavLink to="#" className={({ isActive, isPending }) =>
                                                isPending ? "pending nav-link" : isActive ? "active" : ""
                                            } onClick={logOut }> LogOut</NavLink>

                                        </>) : (<>
                                            <NavLink
                                                to="/login"
                                                className={({ isActive, isPending }) =>
                                                    isPending ? "pending nav-link" : isActive ? "active" : " "
                                                }

                                            >
                                                <i className="bi bi-lock-fill"></i> Login
                                            </NavLink>
                                            / <NavLink to="/register" className={({ isActive, isPending }) =>
                                                isPending ? "pending nav-link" : isActive ? "active" : ""
                                            } > Register</NavLink>

                                        </>)}
                                     </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </>
    );
}
export default TopHeader;