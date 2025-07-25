import { useEffect, useState } from "react";
import { getGeneralSetting } from "../../api/internal";
import Footer from "../footer/footer";
import Header from "../header/header";
import SupportWidget from "../SupportWidget";


const Layout = (props) => {
    const [facebookId, setFacebookId] = useState("");
    const [twitterId, setTwitterId] = useState("");
    const [whatsAppId, setWhatsAppId] = useState("");
    const [tiktokId, setTiktokId] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [timing, setTiming] = useState("");
    const [logo, setLogo] = useState("");
    useEffect(() => {
        const getSettings = async () => {
           const response = await getGeneralSetting();
            setFacebookId(response.data.setting[0].facebookId);
            setTwitterId(response.data.setting[0].twitterId);
            setWhatsAppId(response.data.setting[0].whatsAppId);
            setTiktokId(response.data.setting[0].tiktokId);
            setPhone(response.data.setting[0].phone);
            setEmail(response.data.setting[0].email);
            setAddress(response.data.setting[0].address);
            setTiming(response.data.setting[0].timing);
            setLogo(response.data.setting[0].logo);
           // console.log(logo);
        }
        getSettings();                    
    }, [])

    return (
        <>
        
            {<Header
                facebookId={facebookId}
                twitterId={twitterId}
                whatsAppId={whatsAppId}
                tiktokId={tiktokId}
                phone={phone}
                logo={logo}
            />}
            {props.children}
            {<Footer
                email={email}
                address={address}
                timing={timing}
                phone={phone}
                logo={logo }
            />}
            <div className="chatMe">
                {<SupportWidget />}

            </div>
            </>
    );
}
export default Layout;