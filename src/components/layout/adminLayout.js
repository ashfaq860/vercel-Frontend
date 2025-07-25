import { useEffect, useState } from "react";
import Footer from "../footer/footer";
import AdminHeader from "../header/adminHeader";
import Header from "../header/header";
import AdminSidebar from "../sidebars/adminsidebar";
import { getGeneralSetting } from "../../api/internal";

const AdminLayout = (props) => {
    
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [timing, setTiming] = useState("");
    const [logo, setLogo] = useState("");
    useEffect(() => {
        const getSettings = async () => {
            const response = await getGeneralSetting();
            
            setPhone(response.data.setting[0].phone);
            setEmail(response.data.setting[0].email);
            setAddress(response.data.setting[0].address);
            setTiming(response.data.setting[0].timing);
            setLogo(response.data.setting[0].logo);

        }
        getSettings();
    }, []);

    return (
        <>
            {<AdminHeader logo={logo} />}

            <div className="container-fluid">
                <div className="row flex-nowrap">
                    {<AdminSidebar/> }
                    {props.children}
                </div>
            </div>

            {<Footer
                email={email}
                address={address}
                timing={timing}
                phone={phone}
                logo={logo}
            />}
        </>
    );
}
export default AdminLayout;