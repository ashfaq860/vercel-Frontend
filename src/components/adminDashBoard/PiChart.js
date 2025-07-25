import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { OrderStatusPiChart } from '../../api/internal';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PiChart() {
    const [piChartData, setPiChartData] = useState(null);

    const getPichartData = async () => {
        try {
            const { data } = await OrderStatusPiChart(); // assuming this gives { labels, data }

            if (!data || !data.labels || !data.data) {
                console.error("Invalid chart data structure", data);
                return;
            }

            setPiChartData({
                labels: data.labels,
                datasets: [
                    {
                        label: "Orders",
                        data: data.data, // ✅ FIXED: use correct property
                        backgroundColor: [
                            'rgba(255, 205, 86, 0.6)',   // Pending
                            'rgba(54, 162, 235, 0.6)',   // Processing
                            'rgba(153, 102, 255, 0.6)',  // Shipped
                            'rgba(75, 192, 192, 0.6)',   // Delivered
                            'rgba(255, 99, 132, 0.6)'    // Canceled
                        ],
                        borderColor: [
                            'rgba(255, 205, 86, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],

                        borderWidth: 1,
                    }
                ]
            });
        } catch (error) {
            console.error("Failed to load pie chart data:", error);
        }
    };

    useEffect(() => {
        getPichartData();
    }, []);

    if (!piChartData) return <div>Loading...</div>; // Optional fallback

    return (
        <Pie
            key={JSON.stringify(piChartData)} // optional to fix canvas reuse bug
            data={piChartData}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }}
        />
    );
}
