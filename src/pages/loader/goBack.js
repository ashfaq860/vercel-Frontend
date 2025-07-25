import { Link } from "react-router-dom";
import './loader.css';
const GoBack = ({ link, title}) => {

    return (<>

        <Link to={link} className="alert alert-secondarynone text-primary"><i className="bi bi-arrow-left text-primary me-3"></i>{ title}</Link>
    </>)

}
export default GoBack;