import Spinner from "./spinner";

const LoadingButton = ({ loading, title }) => {
    return (<>
        {loading ? (<><div className="d-flex justify-content-center"><div>Please wait. . .</div> &nbsp;  {<Spinner />}</div></>) : (<><div className="text-center">{ title }</div></>)}
    </>)
}
export default LoadingButton;