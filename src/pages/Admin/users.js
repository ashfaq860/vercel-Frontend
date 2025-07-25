
import { useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import Loader from "../loader/loader";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/internal";
import Pagination from "../../components/products/item/pagination";
import { NavLink, useNavigate } from "react-router-dom";
import { resetUser } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import './sort.css';
const dayjs = require('dayjs');

const Users = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = useSelector(state => state.user.username);
    const email = useSelector(state => state.user.email);
    const [users, setUsers] = useState([]);
   
    const [name, setName] = useState('');
   
    const [userPerPage, setUserPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPostIndex = currentPage * userPerPage;
    const firstPostIndex = lastPostIndex - userPerPage;
    const currentusers = users.slice(firstPostIndex, lastPostIndex);
    //console.log(aor);

    const getUsers = async () => {
        try {


            const response = await getAllUsers();
            console.log(response);
            if (response.status === 200) {
                //  console.log(response.data.users);
                setUsers(response.data.users);
            }
            if (response.response.data.message === "jwt expired") {
                toast.error("Your session has Expired.");
                
                dispatch(resetUser());
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getUsers();
    }, []);
    // Change user status pending to verfied
    const handleChangeRole = async (role, _id) => {
        const data = {
            role,
           _id
        }
        const res = await updateUserRole(data);
        if (res.status === 201) {
            toast.success("User Role Changed Successfully!");
        }
        getUsers();
    }
    //######## Delete user function by id
    const deleteUserById = async (id) => {
        const check = window.confirm("Do you want to delete user?");
        if (check) {
            const response = await deleteUser(id);

            if (response.status == 207) {
                toast.success(response.data.message);
                getUsers();
            }

        }
    }

  

    return (<>
        <AdminLayout>
            {users.length === 0 ? (<><Loader text="Products" /></>)
                : (<>
                    <div className="col-auto col-md-9 col-xl-10 px-sm-10">
                        <h1 className="text-center m-3">All Product users
                            <select id="sortOrder"onChange={(e) => setUserPerPage(e.target.value)}>
                                <option value={userPerPage}>Per Page</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </h1>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr className="text-center">
                                        <th scope="col">#</th>
                                        
                                        <th scope="col">Name</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Email</th>

                                        <th scope="col">address</th>

                                        <th scope="col">date</th>
                                        <th scope="col">Role</th>
                                        <th scope="col" colSpan="3">Action</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        currentusers.map((u, i) => (
                                            <tr key={i} className="text-center">
                                                <th scope="row">{i + 1}</th>
                                                 <td>{u.name}</td>
                                                <td>{u.phone}</td>
                                                <td>{u.email}</td>
                                                <td>{u.address}</td>
                                                <td>{dayjs(u.createdAt).format("DD/MM/YY HH:MM:ss")}</td>
                                                <td>
                                                    <select onChange={(e) => handleChangeRole(e.target.value, u._id)}>
                                                        <option value="1"  selected={`${u.role===1 ? "" : "selected"}`}> Admin </option>
                                                        <option value="0" disabled={`${u.role === 1 && u.email ==='muhmdashfaq@gmail.com' ? "disabled" : ""}`} selected={`${u.role===0 ? "selected" : ""}`}> User </option>
                                                    </select>
                                                </td>
                                                <td className="actionLink text-center" colSpan="3" style={{ "minWidth": "80px" }}>
                                                  
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteUserById(u._id)}
                                                        disabled={ u.role===1?true:false}
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: u.role!==1 ? "pointer" : "not-allowed",
                                                            opacity: u.role===1 ? 0.5 : 1
                                                        }}
                                                    >
                                                        <i
                                                            className="bi bi-trash3 text-danger"
                                                            aria-label={`Delete ${u.name}!`}
                                                            title={u.role===1 ? `Cannot delete ${u.name}` : `Click to delete ${u.name}!`}
                                                        />
                                                    </button> | <Link to={`/admin/userDetails/${u._id}`} title={`View ${u.name} Orders Detail`} alt={`View ${u.name} Orders Detail`}> <i class="bi bi-eye-fill"></i></Link>
                                                </td>
                                            </tr>



                                        ))
                                    }
                                </tbody>
                            </table>
                            <Pagination totalPosts={users.length} postPerPage={userPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        </div>
                    </div>

                    
                </>)}
        </AdminLayout>
    </>)

}
export default Users;