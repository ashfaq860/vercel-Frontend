import { useEffect } from 'react';
import { useRef, useState } from 'react';
import { verifyOTP, getOTPTime, forgotPassword } from '../../api/internal';
import Layout from '../../components/layout/layout';
import "./auth.css";
import Timer from './timer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingButton from '../loader/loadingButton';
const VerifyOTP = () => {
    const [otpTime, setOtpTime] = useState(null)
    const [otpExpire, setOtpExpire] = useState(false);
    const navigate = useNavigate();
   
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    const ref6 = useRef(null);
    const inputRef = [ref1, ref2, ref3, ref4, ref5, ref6];

    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");
    const [otp3, setOtp3] = useState("");
    const [otp4, setOtp4] = useState("");
    const [otp5, setOtp5] = useState("");
    const [otp6, setOtp6] = useState("");
    const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4, setOtp5, setOtp6];


    
    useEffect(() => {
        if (ref1.current) {
            ref1.current.focus();
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
        const data = {
            otp:finalOtp
        };
        try {
            const response = await verifyOTP(data);
            //console.log(response.response.status);
            if (response.status === 404)
            {
                setLoading(false);
                console.log(response);
                toast.error(response.response.data.message);
            }
            if (response.status === 200) {
                console.log(response);
                setLoading(false);
                toast.success(response.data.message);
                navigate("/reset-password");
            }
           
            // alert(data.status)
           // navigate("/resetPassword");

        } catch (err) {
            setMsg('Error sending email.' + err);
        }
    }
    const inputChange = (event,location) => {
        if (location < 5 && event.target.value) {
            inputRef[location + 1].current.focus();
        }
        otpArray[location](event.target.value);
        
    }
    useEffect(() => {
        const getMyOTPTime = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('passToken'));
                /// alert(token);

                //console.log(tokenData)
                const res = await getOTPTime(token);
                if (res?.status === 200) {
                    const remTime = new Date(res?.data?.sendTime).getTime() - new Date().getTime();
                    if (remTime > 0) {
                        setOtpTime(remTime);

                    } else {
                        setOtpExpire(true);
                    }
                }
                
            } catch (error) {
                toast.error(error.message);
            }

        }
        getMyOTPTime();        
    }, [])
    const resendOTP = async() => {
        const email = JSON.parse(localStorage.getItem('email'));
        const resendData = {
            email:email
        }

        try {
            setLoading(true);
            const response = await forgotPassword(resendData);

            if (response.status === 404) {
                setLoading(false);
                // console.log(response.data.message);
                toast.error(response.response.data.message);

            }
            if (response.status === 200) {
                setLoading(false);
                setOtpExpire(false);
                //localStorage.setItem('passToken', 'value');
                localStorage.setItem('passToken', JSON.stringify(response.data.token));
                localStorage.setItem('email', JSON.stringify(email));
                //  console.log(response.data.message);
                toast.success(response.data.message);

                // alert(data.status)
               // navigate("/verify");
            }
        } catch (err) {
           toast.error("Error while Resending OPT");
        }
    }
    return (<>
        <Layout>
            <div className="card removeBoxShadow mt-5 mb-5 col-lg-4 col-md-4 col-sm-7 col-12" style={{ "margin": "auto" }} >
                <div className="card-body forms" style={{ "margin": "auto" }}>
                    <div className="card-title">
                        <h1 className="card-title text-center text-primary"><i class="bi bi-fingerprint fs-1"></i></h1>
                        <p> Enter 6-digit OTP here that we have just sent at your email</p>
                    </div>   
                    <label for="otp">OTP*</label>
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex flex-row mb-3">
                            {inputRef.map((item, index) => {
                                return (<>
                                    <input
                                        key={index }
                                        ref={item} type="number" className="form-control m-2 p-2 otp_input" onInput={(event) => {
                                        if (event.target.value = event.target.value.slice(0, 1));
                                    }
                                    } onChange={(e) => inputChange(e,index)} required />

                                </>)
                            }) }
                        </div>
                        <div>{otpTime !== null && !otpExpire ? <Timer setOtpExpire={setOtpExpire} time={otpTime} /> : <span className="text-primary resendOTP" onClick={resendOTP}>Resend</span>}</div>

                        <button type="submit" className="btn btn-primary">{<LoadingButton loading={ loading} title="Verify" />}</button>
                        
                    </form>
                    <button className="btn btn-secondary mt-1" onClick={() => navigate("/forgotpassword")}><i class="bi bi-arrow-left"></i> Go Back</button>

                </div>
            </div>
        </Layout>
    </>);
}

export default VerifyOTP;