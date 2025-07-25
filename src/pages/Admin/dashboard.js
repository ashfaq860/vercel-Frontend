
import AdminLayout from "../../components/layout/adminLayout";
import WeeklyReportChart from "./weekReport";
import GrowthChart from "../../components/adminDashBoard/GrowthChart";
import StatCard from "../../components/adminDashBoard/StatCard";
import PopularStocks from "../../components/adminDashBoard/ PopularStocks";
import { PiChart } from "../../components/adminDashBoard/PiChart";
import { useEffect, useState } from "react";
import { getLineChartData } from "../../api/internal";
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { resetUser } from "../../store/userSlice";
const DashBoard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [growthData, setGrowthData] = useState([]);
    const [orderSet, setOrderSet] = useState([]);
    const [incomeSet, setIncomeSet] = useState([]);
    const [customerSet, setCustomerSet] = useState([]);
    const [total, setTotal] = useState("");
    const [labels, setLabels] = useState([]);
    useEffect(() => {
        const growthChartfunc = async () => {
        const growthChartData = await getLineChartData();
            if (growthChartData?.status === 200) {
               //console.log(growthChartData.data.datasets[1]);
                setLabels(growthChartData?.data?.labels);
                setGrowthData(growthChartData?.data?.datasets);
                setOrderSet(growthChartData.data.datasets[1]);
                setIncomeSet(growthChartData.data.datasets[2]);
                setCustomerSet(growthChartData.data.datasets[3]);

            } else if (growthChartData?.response?.data?.message === "jwt expired") {
                toast.error("Login Session Expired!");
                navigate('/login');
                dispatch(resetUser());
             } else {
                toast.error("Error while getting Growth Chart");
            }
        }
        growthChartfunc();
        }, [])
    return (<>
        <AdminLayout>
            <div className="col-10 col-sm-7 col-md-9 px-sm-10">
                <div className="container-fluid mt-3">
                    <div className="row g-3">
                        <div className="col-lg-4">
                            <StatCard
                                title="Orders"
                                icon="bi-wallet2"
                                color="#6f42c1"
                                Chartlabels={labels}
                                dataSet={orderSet }
                                extra={<div>
                                      <span className="badge bg-light text-dark">Year</span>
                                </div>}
                        />
                    </div>
                        <div className=" col-lg-4">
                        <StatCard
                            title="Earning"
                            rs="Rs."
                            icon="bi-bag"
                            color="#0d6efd"
                            Chartlabels={labels}
                            dataSet={incomeSet }
                            extra={
                                <div>
                                    <span className="badge bg-light text-dark">Year</span>
                                </div>
                            }
                        />
                    </div>
                    <div className="col-lg-4">
                        <StatCard
                            title="Customer"
                            
                                icon="bi-calendar-event"
                                Chartlabels={labels}
                                dataSet={customerSet}
                                color="#339af0"
                                extra={
                                    <div>
                                        <span className="badge bg-light text-dark">Year</span>
                                    </div>
                                }
                        />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-lg-8 mb-3">
                            <GrowthChart
                                chartData={growthData}
                                Chartlabels={labels}
                                
                              />
                    </div>
                    <div className="col-12 col-lg-4 mb-3">
                        <PopularStocks />
                    </div>
                    </div>
                    <hr />
                    <div className="row mt-3">
                        <div className="d-flex justify-content-center">
                            <div className="col-10 col-md-6">
                                <h2 className="text-center">Orders Status Analytics </h2>
                                <PiChart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>

    </>);
}
export default DashBoard;