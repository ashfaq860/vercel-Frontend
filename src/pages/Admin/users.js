import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import AdminLayout from "../../components/layout/adminLayout";
import Loader from "../loader/loader";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/internal";
import Pagination from "../../components/products/item/pagination";
import { resetUser } from "../../store/userSlice";

const Users = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { username, email } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination state
    const [userPerPage, setUserPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate pagination
    const lastPostIndex = currentPage * userPerPage;
    const firstPostIndex = lastPostIndex - userPerPage;
    const currentUsers = users.slice(firstPostIndex, lastPostIndex);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await getAllUsers();
            if (response.status === 200) {
                setUsers(response.data.users);
            }
        } catch (error) {
            if (error.response?.data?.message === "jwt expired") {
                toast.error("Your session has expired. Please login again.");
                dispatch(resetUser());
                navigate('/login');
            } else {
                toast.error("Failed to fetch users");
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (role, userId) => {
        try {
            const res = await updateUserRole({ role, _id: userId });
            if (res.status === 201) {
                toast.success("User role updated successfully!");
                fetchUsers();
            }
        } catch (error) {
            toast.error("Failed to update user role");
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                const response = await deleteUser(userId);
                if (response.status === 207) {
                    toast.success(response.data.message);
                    fetchUsers();
                }
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    if (isLoading) {
        return <Loader text="Loading users..." />;
    }

    return (
        <AdminLayout>
        <div className="col-auto col-md-9 col-xl-10 px-sm-10">
            <div className="container-fluid py-4">
                <div className="card shadow-lg">
                    <div className="card-header bg-white border-bottom-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="h5 mb-0">User Management</h2>
                            <div className="d-flex align-items-center">
                                <label htmlFor="itemsPerPage" className="me-2 mb-0">Users per page:</label>
                                <select 
                                    id="itemsPerPage"
                                    className="form-select form-select-sm w-auto"
                                    value={userPerPage}
                                    onChange={(e) => setUserPerPage(Number(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card-body px-0 pb-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th width="5%">#</th>
                                        <th width="20%">User</th>
                                        <th width="15%">Contact</th>
                                        <th width="20%">Address</th>
                                        <th width="15%">Registered</th>
                                        <th width="15%">Role</th>
                                        <th width="10%">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user, index) => (
                                            <tr key={user._id}>
                                                <td>{firstPostIndex + index + 1}</td>
                                                <td>
                                                    <div className="fw-semibold">{user.name}</div>
                                                    <small className="text-muted">{user.email}</small>
                                                </td>
                                                <td>{user.phone || 'N/A'}</td>
                                                <td>
                                                    <div className="text-truncate" style={{maxWidth: '200px'}}>
                                                        {user.address || 'No address provided'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>{dayjs(user.createdAt).format("MMM D, YYYY")}</small>
                                                    <br />
                                                    <small className="text-muted">{dayjs(user.createdAt).format("h:mm A")}</small>
                                                </td>
                                                <td>
                                                    <select 
                                                        className={`form-select form-select-sm ${user.role === 1 ? 'bg-primary-light text-primary' : 'bg-secondary-light text-secondary'}`}
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(e.target.value, user._id)}
                                                        disabled={user.email === 'muhmdashfaq@gmail.com'}
                                                    >
                                                        <option value={1}>Admin</option>
                                                        <option value={0}>User</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link 
                                                            to={`/admin/userDetails/${user._id}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="View user details"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Link>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            disabled={user.role === 1}
                                                            title={user.role === 1 ? "Cannot delete admin user" : "Delete user"}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {users.length > 0 && (
                            <div className="card-footer bg-white border-top-0">
                                <Pagination 
                                    totalPosts={users.length} 
                                    postPerPage={userPerPage} 
                                    setCurrentPage={setCurrentPage} 
                                    currentPage={currentPage} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
                            </div>
        </AdminLayout>
    );
};

export default Users;
