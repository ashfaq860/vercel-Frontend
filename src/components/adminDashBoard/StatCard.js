import React, { useState } from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect } from "react";


ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler
);
export default function StatCard({ title, icon, color, extra, dataSet, Chartlabels,rs }) {
    const [total, setTotal] = useState("");
   // console.log(dataSet)
    useEffect(() => {
         setTotal(dataSet?.data?.reduce((sum, num) => sum + num, 0));
    }, [dataSet]);
    const data = {
        labels: Chartlabels,
        datasets: [
            {
                label: dataSet?.label,
                data: dataSet?.data,
                borderColor: "#fff",
                backgroundColor: "rgba(13,110,253,0)",
                tension: 0.4,
                fill: true,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };
    return (
        <div className="card text-white" style={{ backgroundColor: color, minHeight: "130px" }}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <i className={`bi ${icon} fs-3`}></i>
                    {extra}
                </div>
                <div className="d-flex justify-content-between">
                    <div className="col-4">
                    <h6 className="mt-2">{title}</h6>
                        <h4>{ rs } {total}</h4>
                    </div>
                    <div className="col-8">
                        
                        <Line data={data} options={options} />
                    </div>

                    
                </div>
            </div>
        </div>
    );
}
