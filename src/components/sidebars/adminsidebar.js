import { Link } from "react-router-dom";
import './adminsidebar.css';
import { useSelector } from 'react-redux';
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
const AdminSidebar = ({logo }) => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.user.role);
    const username = useSelector(state => state?.user?.username);
    const photo = useSelector(state => state?.user?.photo);
    const logOut = () => {
        dispatch(resetUser());
    }

    return (<>

                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white">
                {role === 1 ? (<>
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start sidebar" id="menu">
                        <li className="nav-item">
                            <Link to="/admin/dashboard" className="nav-link align-middle px-0">
                                <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">DashBoard</span>
                            </Link >
                        </li>
                        <li>
                            <a href="#settings" data-bs-toggle="collapse" className="nav-link px-0 align-middle ">
                                <i className="bi fs-4 bi-file-earmark"></i> <span className="ms-1 d-none d-sm-inline">Settings</span></a >
                            <ul className="collapse nav flex-column ms-1 subManu" id="settings" data-bs-parent="#settings">
                                <li className="nav-item">
                                    <Link to="/admin/generalSetting" className="nav-link px-0"><i className="bi bi-gear-fill"></i> <span className="d-none d-sm-inline">General Settings </span>  </Link >
                                </li>

                                <li className="nav-item">
                                    <Link to="/admin/slider" className="nav-link px-0"> <i className="bi bi-file-slides"></i><span className="d-none d-sm-inline"> Slider</span> </Link >
                                </li>
                            </ul>
                        </li>
                            
                       
                                                 

                        <li>
                            <Link to="/admin/orders/all" className="nav-link px-0 align-middle">
                                <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Orders</span>
                            </Link >
                        </li>
                        <li>
                            <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle ">
                            <i className="bi fs-4 bi-file-earmark"></i> <span className="ms-1 d-none d-sm-inline">Pages</span></a >
                            <ul className="collapse nav flex-column ms-1 subManu" id="submenu2" data-bs-parent="#menu">
                                <li className="w-100">
                                    <Link to="/admin/create-page" className="nav-link px-0"><i className="bi bi-pencil-square" alt="Create Page"></i> <span className="d-none d-sm-inline"> Create Page</span> </Link >
                                </li>
                                <li>
                                    <Link to="/admin/all-pages" className="nav-link px-0"> <i className="bi bi-grid-3x3-gap-fill" alt="All Pages" ></i><span className="d-none d-sm-inline"> All Page</span> </Link >
                                </li>
                            </ul>
                        </li>

                        <li>
                            <a href="#category" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-grid"></i> <span className="ms-1 d-none d-sm-inline">Category</span> </a >
                            <ul className="collapse nav flex-column ms-1 subManu" id="category" data-bs-parent="#menu">
                                <li className="w-100">
                                    <Link to="/admin/add-category" className="nav-link px-0"><i className="bi bi-pencil-square"></i> <span className="d-none d-sm-inline">Add Category</span></Link>
                                </li>
                                <li>
                                    <Link to="/admin/catList" className="nav-link px-0"><i className="bi bi-grid-3x3-gap-fill" alt="All Categories" ></i> <span className="d-none d-sm-inline">All Categories</span></Link>
                                </li>

                            </ul>
                        </li>

                        <li>
                            <a href="#products" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                                <i className="fs-4 bi bi-box"></i> <span className="ms-1 d-none d-sm-inline">Products</span> </a >
                            <ul className="collapse nav flex-column ms-1 subManu" id="products" data-bs-parent="#menu">

                                <li className="w-100">
                                    <Link to="/admin/add-product" className="nav-link px-0"><i className="bi bi-pencil-square"></i> <span className="d-none d-sm-inline">Add Product</span></Link>
                                </li>

                                <li>
                                    <Link to="/admin/productList" className="nav-link px-0"><i className="bi bi-grid-3x3-gap-fill" alt="All Products" ></i> <span className="d-none d-sm-inline">All Products</span></Link>
                                </li>

                            </ul>
                        </li>

                        <li>
                            <Link to="/admin/productReviews" className="nav-link px-0 align-middle">
                                <i className="bi bi-list-stars"></i> <span className="ms-1 d-none d-sm-inline">Reviews</span> </Link >
                        </li>
                        <li>
                            <Link to="/admin/users" className="nav-link px-0 align-middle">
                                <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Customers</span> </Link >
                        </li>
                    </ul>


                </>) : (<>

                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start sidebar" id="menu">
                            <li className="nav-item">
                                <Link to="/" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Shop</span>
                                </Link >
                            </li>
                            <li>
                                <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Orders</span> </a >
                                <ul className="collapse show nav flex-column ms-1 subManu" id="submenu1" data-bs-parent="#menu">
                                     <li className="w-100">
                                        <Link to="/admin/orders" className="nav-link px-0"> <i className="bi bi-airplane-engines"></i> <span className="d-none d-sm-inline">All Orders</span> </Link >
                                    </li>
                                    { /* <li className="w-100">
                                        <Link to="#" className="nav-link px-0"> <i className="bi bi-airplane-engines"></i> <span className="d-none d-sm-inline">Delivered</span> </Link >
                                    </li>
                                    <li className="w-100">
                                        <Link to="#" className="nav-link px-0"> <i className="bi bi-truck"></i> <span className="d-none d-sm-inline">Shipped</span> </Link >
                                    </li>
                                    <li>
                                        <Link to="#" className="nav-link px-0"><i className="bi bi-app-indicator"></i> <span className="d-none d-sm-inline">InProgress</span> </Link >
                                    </li>
                                    */}
                                </ul>
                            </li>
                            </ul>
                </>)}
                       

                        <hr />
                            <div className="dropdown pb-4">
                                <Link to="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        {photo ? (<img src={ photo } alt="hugenerd" width="30" height="30" className="rounded-circle" />): (<img src = "https://github.com/mdo.png" alt = "hugenerd" width = "30" height = "30" className = "rounded-circle"/>) } 
                        <span className="d-none d-sm-inline mx-1">{ username }</span>
                                </Link >
                                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><Link className="dropdown-item" to="/admin/changePassword">Change Password</Link ></li>
                                  <li><Link className="dropdown-item" to="/admin/account-setting">Settings</Link ></li>
                                   
                                    <li><Link className="dropdown-item" to="/admin/my-account">Profile</Link ></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                        <li><Link className="dropdown-item" onClick={logOut }>Sign out</Link ></li>
                                </ul>
                            </div>
                    </div>
                </div>
              
           
    </>)
}

export default AdminSidebar; 