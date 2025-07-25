import { useEffect, useState } from "react";
import { popularStock } from "../../api/internal";

export default function PopularStocks() {
    const [popularData, setPopularData] = useState([]);
    useEffect(() => {
        const getPopularStock = async () => {
            const { data } = await popularStock();
            setPopularData(data);
        }
        getPopularStock();
    },[])
    return (
        <div className="card p-3">
            <h6>Popular Stocks <i class="bi bi-box2-heart"></i></h6>
            {popularData?.map((s, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                        <div>{s.name}<small><span className="badge" style={{ "background-color":"rgb(54, 162, 235)"} }>{s.categoryName}-{s.manufacturer}</span></small><small style={{ "color": "rgb(46, 204, 113)" }} > ({ s.totalSold})</small></div>
                        <small style={{"color":"rgb(75, 192, 192)"} }>Profit:{((Number(s.s_price) - Number(s.p_price)) / Number(s.p_price) * 100).toFixed(1)} %</small>
                    </div>
                    <strong style={{ "color": "rgb(46, 204, 113)" }}>Rs.{Number(s.s_price) * Number(s.totalSold)} <br />
                        <small style={{ "color": "rgb(75, 192, 192)" }}>Rs.{(Number(s.s_price) - Number(s.p_price)) * Number(s.totalSold)}</small>
                    </strong>
                    
                </div>
            ))}
        </div>
    );
}
