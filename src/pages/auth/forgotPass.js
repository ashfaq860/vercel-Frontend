import { useState } from 'react';
import { forgotPassword } from '../../api/internal';
import Layout from '../../components/layout/layout';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Spinner from '../loader/spinner';
import LoadingButton from '../loader/loadingButton';
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email
        };
        try {
            setLoading(true);
            const response = await forgotPassword(data);
            
            if (response.status === 400) {
                setLoading(false);
               // console.log(response.data.message);
                toast.error(response.response.data.message);

            }
            if (response.status === 200) {
                setLoading(false);
                //localStorage.setItem('passToken', 'value');
                localStorage.setItem('passToken', JSON.stringify(response.data.token));
                localStorage.setItem('email', JSON.stringify(email));
          //  console.log(response.data.message);
            toast.success(response.data.message);

           // alert(data.status)
            navigate("/verify");
            }
        } catch (err) {
            setMsg('Error sending email.'+err);
        }
    };

    return (<>
        <Layout>
            <div className="card removeBoxShadow mt-5 mb-5 col-lg-4 col-md-4 col-sm-7 col-12" style={{ "margin": "auto" }} >
            <div className="card-body forms" style={{ "margin": "auto" }}>
            <h3>Forgot Password</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email address</label>
                    <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                        <button type="submit" className="btn btn-primary">{ <LoadingButton loading={loading} title="Send OTP."/>}</button>
                        {msg && <p className="mt-3">{msg}</p>}

                    </form>
                    <button className="btn btn-secondary mt-1" onClick={() =>  navigate("/login") }><i class="bi bi-arrow-left"></i> Go Back</button>  
            </div>
            </div>
        </Layout>
    </>);
}

export default ForgotPassword;