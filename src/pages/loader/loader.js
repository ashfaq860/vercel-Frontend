import { Vortex} from "react-loader-spinner";
import './loader.css';
const Loader = (props) => {

    return (<>
        <div className="loaderWrapper mt-5">
            <h2>Loading {props.text}</h2>
            <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['#ff2d37', '#000000', '#ff2d37', '#000000', '#ff2d37', '#000000']}
       />
            </div>
       
    </>)

}
export default Loader;