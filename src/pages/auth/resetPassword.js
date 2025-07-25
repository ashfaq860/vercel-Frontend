import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../components/layout/layout';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../../api/internal';

const  ResetPassword    =()=> {
   // const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            toast.error("Password don't match!");
            return;
        }
        if (password.length < 6 & cpassword.length < 6) {
            toast.error("Password must be 6 or more digit long");
            return;
        }
        try {
            const token = JSON.parse(localStorage.getItem('passToken'));
            const pData = {
                password,
                token
               
            }
            const res = await resetPassword(pData);
            console.log(res);
            if (res.status === 400) {
                toast.error(res.response.data.message);
            }
            if (res.status === 200) {
                toast(res.data.message);
                navigate("/login");
            }
        } catch(error) {
            toast.error('Reset failed. Token might be invalid or expired.'+error);
        }
    };

    return (
       <Layout>
        <div className="card removeBoxShadow mt-5 mb-5 col-lg-5 col-md-5 col-sm-7 col-12" style={{ "margin": "auto" }} >
            <div className="card-body forms" style={{ "margin": "auto" }}>
                      <h3>Reset Password</h3>
            <form onSubmit={handleReset}>
                <div className="mb-3">
                    <label>New Password*</label>
                            <input type="password" min="6" max="16" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label>Confirm Password*</label>
                            <input type="password" min="6" max="16" className="form-control" value={ cpassword} onChange={(e) => setCPassword(e.target.value)} required />
                        </div>
                <button type="submit" className="btn btn-primary">Update Password</button>
                        <button className="btn btn-secondary mt-1" onClick={() => navigate("/verify")}><i class="bi bi-arrow-left"></i> Go Back</button>

            </form>
            </div>
            </div>
        </Layout>
    );
}

export default ResetPassword;