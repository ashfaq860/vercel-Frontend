import AdminLayout from "../../../components/layout/adminLayout";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetUser,setUser } from "../../../store/userSlice";
import { setPassword, checkPassword } from '../../../api/internal';
import { useState } from "react";
import toast from 'react-hot-toast';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MyAccount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const role = useSelector(state => state.user.role);
    const [createdPassword, setCreatedPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState([]);
    const [confirmPassword, setConfirmpassword] = useState("");
    const username = useSelector(state => state.user.username);
    const email = useSelector(state => state.user.email);
    const logOut = () => {
        dispatch(resetUser());
    }
    const checkIfPasswordSet = async () => {
      
        const res = await checkPassword(email);
        setPasswordCheck(res.data.user);
      //  alert(passwordCheck.email)
    }
    useEffect(() => {
        checkIfPasswordSet();
    }, []);
    const handlePassword = (e) => {
        setCreatedPassword(e);
    }
    if (passwordCheck?.password === null) {
        
        const handleSetPassword = async (e) => {
            e.preventDefault();
            if (createdPassword !== confirmPassword) {
                toast.error("Password don't Match!");
                return;
}
            const data = {
                email,
                password:createdPassword
            }
            const res = await setPassword(data);
            const user = {
                _id: res.data.user._id ,
                email: res.data.user.email,
                username: res.data.user.name,
                phone: res.data.user.phone,
                address: res.data.user.address,
                auth: true,
                role: res.data.user.role,
            }
            //console.log(user);
            dispatch(setUser(user));
            navigate(`/admin/my-order`);
        }
    

        return (<>
            <AdminLayout>
                <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <form onSubmit={handleSetPassword}>
                        <div className="card removeBoxShadow border-0 mt-5 mb-5 col-lg-5 col-md-5 col-sm-7 col-12" style={{ "margin": "auto" }} >
                            <h2 className="mt-2 text-center">Please set Your password.</h2>
                        <div className="row">
                              
                                <div className="col-12 form-group mt-1">
                                    <input type="email" id="email" name="email" required className="form-control email" disabled value={email}   />

                                </div>
                            </div>
                <div className="row">
                
                    <div className="col-12 form-group mt-1">
                                    <input type="password" id="password" name="password" required className="form-control password" onChange={(e) => handlePassword(e.target.value)} value={ createdPassword } id="password" placeholder="Create password" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 form-group confirmPass mt-1">
                            <input type="password" id="cPassword" name="confirmPassword" className="form-control pssword" required id="cPassword" onChange={(e) => setConfirmpassword(e.target.value)}  value={confirmPassword} placeholder="Confirm Password" />
                                    <p className="text-end mt-1">
                                        <button className="btn btn-large btn-primary text-end">Set Password</button>
                                    </p>  

                                </div>
                     </div>
                    </div>
                    </form>
               
                </div>
            </AdminLayout>
        </>)
    }
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                <h1 className="text-center mt-5">My Account</h1>
                <br />
                <p>
                    Hello <b>{username}</b> (not <b>{username}?</b> <Link onClick={logOut}>Log out</Link > )
                </p>
                
                {role == 0 ? (<>
                    <p>
                        From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
                    </p>

                </>):(<>
                    <p>
                        Your are an Admin, From your account dashboard you can  manage order, customers, products, categories, accounts.
                    </p>

                </>) }
        </div>
        </AdminLayout>
        </>);
}
export default MyAccount;