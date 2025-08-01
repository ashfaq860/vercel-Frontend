import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip,Filler } from "chart.js";
import { useEffect } from "react";
import { useState } from "react";
import { getGrowthChartData } from "../../api/internal";

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip,Filler);

export default function GrowthChart() {
    const [chartData, setChartData] = useState(null);
    const [view, setView] = useState("yearly");
    const [year] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(null);
    const [totalStock, setTotalStock] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalSale, setTotalSale] = useState(0);
    const fetchChart = async (type, selectedMonth = null) => {
              
        const {data } = await getGrowthChartData(type, year,selectedMonth);
       // console.log(data);
      //  const data = await res.json();
        setChartData(data);
      
        setView(type);
        setMonth(selectedMonth);
    };
    useEffect(() => {
        if (chartData?.datasets?.[0]?.data) {
            setTotalStock(chartData?.datasets[0]?.data?.reduce((sum, num) => sum + Number(num), 0));
            setTotalOrders(chartData?.datasets[1]?.data?.reduce((sum, num) => sum + Number(num), 0));

            setTotalProfit(chartData?.datasets[2]?.data?.reduce((sum, num) => sum + Number(num), 0));
            setTotalCustomers(chartData?.datasets[3]?.data?.reduce((sum, num) => sum + Number(num), 0))
            setTotalSale(chartData?.datasets[4]?.data?.reduce((sum, num) => sum + Number(num), 0));

        }
       // console.log(chartData?.datasets[0],setTotalStock)
    }, [chartData]);
    useEffect(() => {
        fetchChart("yearly");
    }, []);

    const handleBarClick = (elems) => {
      
        if (!elems.length || !chartData) return;
        const index = elems[0].index;
        if (view === "yearly") fetchChart("monthly", index + 1);
        else if (view === "monthly") fetchChart("weekly");
    };

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              
                <p><span className="text-uppercase">{view}:</span> <span style={{ "color": 'rgba(99, 115, 129, 1)' }}>Stock:{totalStock},</span><span style={{ "color": 'rgba(54, 162, 235, 1)' }}>Orders:{totalOrders}, </span>  <span style={{ "color": 'rgba(75, 192, 192, 1)' }}>Profit:{totalProfit}, </span><span style={{ "color": 'rgba(153, 102, 255, 1)' }}>Customers:{totalCustomers},</span><span style={{ "color": 'rgba(46, 204, 113, 1)' }}>Sale:{totalSale}</span></p>
                <div>
                    <button className={`btn ${view === "yearly" ? 'btn-primary' :'btn-outline-secondary' } btn-sm me-1`} onClick={() => fetchChart("yearly")}>Year</button>
                    <button className={`btn ${view === "monthly" ? 'btn-primary' : 'btn-outline-secondary'} btn-sm me-1`} onClick={() => fetchChart("monthly", new Date().getMonth() + 1)}>Month</button>
                    <button className={`btn ${view === "weekly" ? 'btn-primary' : 'btn-outline-secondary'} btn-sm me-1`} onClick={() => fetchChart("weekly")}>Week</button>
                </div>
            </div>
            {chartData && <Bar
                data={{ labels: chartData.labels, datasets: chartData.datasets }}
                height={120}
                options={{
                    responsive: true,
                    onClick: (e, elements) => handleBarClick(elements),
                    plugins: { legend: { display: true } },
                    scales: { y: { beginAtZero: true } }
                }}
            />}
        </div>
    );
}
