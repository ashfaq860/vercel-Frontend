
import { Link } from "react-router-dom";

const HeaderTopImage = ({logo }) => {

    return (<>
        <div className="container-fluid" style={{"backgroundColor":"#212529"} }>
            <div className="row">
                <div className="col-12 p-1">
                    <Link to="/" >
                        {logo ? (
                            <img
                                src={logo}
                                alt="Mian Auto Parts"
                                className="img-fluid"
                                style={{ height: "80px", width: "25%" }}
                            />
                        ) : (
                            <img
                                src="icons/logo.png"
                                alt="Mian Auto Parts"
                                className="img-fluid"
                                style={{ height: "80px", width: "25%" }}
                            />
                        )}
                    </Link>
                 </div>
            </div>
        </div>
    </>)
}
export default HeaderTopImage;