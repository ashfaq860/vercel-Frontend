import "./header.css";
import HeaderTopImage from "./adminHeaderImge";
const AdminHeader = ({logo }) => {

  
    return (
        <>
            <header>
                {<HeaderTopImage logo={logo} /> }

            </header>
        </>
    );
}
export default AdminHeader;