import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import {
  MdOutlineLeaderboard,
  MdOutlineAccountBalance,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
import { LinearProgress } from "@mui/material";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://13.213.208.92:8080/ecscrm/api/crmDashBoardOverview"
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      // Colors for charts
      const lineChartColors = [
        "rgba(75, 192, 192, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 205, 86, 1)",
        "rgba(54, 162, 235, 1)", // Additional color
        "rgba(153, 102, 255, 1)", // Additional color
      ];
      const barChartColors = [
        "rgba(255, 99, 132, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(255, 205, 86, 0.6)",
        "rgba(54, 162, 235, 0.6)", // Additional color
        "rgba(153, 102, 255, 0.6)", // Additional color
      ];

      // Filter out service data
      const filteredChartData = dashboardData.Data.filter(
        (item) => item.label !== "Service"
      );

      // Sample data for line chart
      const lineChartData = {
        labels: dashboardData.month,
        datasets: filteredChartData.map((item, index) => ({
          label: item.label,
          data: item.data,
          borderColor: lineChartColors[index % lineChartColors.length], // Cycle through colors if more than 3 datasets
          borderWidth: 2,
          fill: false,
        })),
      };

      // Sample data for bar chart
      const barChartData = {
        labels: dashboardData.month,
        datasets: filteredChartData.map((item, index) => ({
          label: item.label,
          data: item.data,
          backgroundColor: barChartColors[index % barChartColors.length], // Cycle through colors if more than 3 datasets
        })),
      };

      const lineChartCtx = document
        .getElementById("lineChart")
        .getContext("2d");
      lineChartRef.current = new Chart(lineChartCtx, {
        type: "line",
        data: lineChartData,
      });

      const barChartCtx = document.getElementById("barChart").getContext("2d");
      barChartRef.current = new Chart(barChartCtx, {
        type: "bar",
        data: barChartData,
      });
    }

    return () => {
      if (lineChartRef.current) lineChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [dashboardData]);

  if (!dashboardData) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  }

  // Calculate sales increase percentage
  const previousMonthRevenue = dashboardData.previousMonthRevenue;
  const currentMonthRevenue = dashboardData.currentMonthRevenue;
  // Calculate sales increase percentage
  let salesIncreasePercentage;
  if (previousMonthRevenue === 0) {
    // Handle division by zero case
    salesIncreasePercentage = 100;
  } else {
    salesIncreasePercentage =
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100;
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center Hero">
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <span className="d-flex align-items-center justify-content-between">
                  <p
                    className="card-title"
                    style={{ color: "#000", fontSize: "20px" }}
                  >
                    Lead Count
                  </p>
                  <h5
                    style={{
                      backgroundColor: "#e0dcfe",
                      color: "#624bff",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <MdOutlineLeaderboard />
                  </h5>
                </span>
                <h2 className="card-text">
                  <strong>{dashboardData.totalLead}</strong>
                </h2>
                <h6 className="card-text text-secondary">
                  {dashboardData.totalContact} &nbsp; converted
                </h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <span className="d-flex align-items-center justify-content-between">
                  <p
                    className="card-title"
                    style={{ color: "#000", fontSize: "20px" }}
                  >
                    Deal Count
                  </p>
                  <h5
                    style={{
                      backgroundColor: "#e0dcfe",
                      color: "#624bff",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <MdOutlineAccountBalance />
                  </h5>
                </span>
                <h2 className="card-text">
                  <strong>{dashboardData.totalDeal}</strong>
                </h2>
                <h6 className="card-text text-secondary">Revenue Generated</h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card  h-100">
              <div className="card-body">
                <span className="d-flex align-items-center justify-content-between">
                  <p
                    className="card-title"
                    style={{ color: "#000", fontSize: "20px" }}
                  >
                    Products
                  </p>
                  <h5
                    style={{
                      backgroundColor: "#e0dcfe",
                      color: "#624bff",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <MdOutlineShoppingCart />
                  </h5>
                </span>
                <h2 className="card-text">
                  <strong>{dashboardData.totalProduct}</strong>
                </h2>
                <h6 className="card-text text-secondary">
                  {dashboardData.productCountByMonth} Newly Added
                </h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <span className="d-flex align-items-center justify-content-between">
                  <p
                    className="card-title"
                    style={{ color: "#000", fontSize: "20px" }}
                  >
                    Total Revenue
                  </p>
                  <h5
                    style={{
                      backgroundColor: "#e0dcfe",
                      color: "#624bff",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <TbPigMoney />
                  </h5>
                </span>
                <h2 className="card-text">
                  <strong>
                    <span style={{ color: "#624bff" }}>$</span>{" "}
                    {dashboardData.currentMonthRevenue}
                  </strong>
                </h2>
                <h6 className="card-text text-secondary">
                  {" "}
                  Sales Increase:{" "}
                  {typeof salesIncreasePercentage === "number"
                    ? salesIncreasePercentage + "%"
                    : "N/A"}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <canvas id="lineChart"></canvas>
          </div>
          <div className="col-md-6">
            <canvas id="barChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
