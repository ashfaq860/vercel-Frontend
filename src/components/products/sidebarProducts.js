
import './product.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLatestProducts } from "../../api/internal";
import SideProduct from "./item/sideProduct";
import Loader from '../../pages/loader/loader';
const SideBarProducts = () => {
    const [products, setProducts] = useState([]);
    const latestProducts = async () => {
        const res = await getLatestProducts(4);
        if (res?.status == 200)
            setProducts(res?.data?.products);
    }
    useEffect(() => {
        latestProducts();
    }, []);
	return (<>
       <div className="card  mb-3" style={{ 'maxWidth': '100%' }} >
                <div className="card-header latestProductHeader">Latest Products</div>
            <div className="card-body">
                {products?.length === 0 ? (<><Loader /></>) : (<></>)}
                {products?.map((p, i) => (

                    <SideProduct key={i }
                        _id={p?._id}
                        name={p?.name}
                        urduName={p?.urduName}
                        photo={p?.photo}
                        discount={0}
                        s_price={p?.s_price}
                        p_price={p?.p_price}
                        model={p?.model}
                        quality={p?.quality}
                        category={p?.category}
                        manufacturer={p?.manufacturer}
                        latestProducts={p.isNew}
                        totalReviews={p?.totalReviews}
                        totalStars={p?.totalStars}
                        shippingCost={p.shippingCost}
                />

                ))}
                   

                </div>
            </div>
        

	</>);
}
export default SideBarProducts;