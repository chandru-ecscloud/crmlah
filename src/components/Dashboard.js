import React, { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { MdOutlineLeaderboard, MdOutlineAccountBalance, MdOutlineShoppingCart   } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";


function Dashboard() {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    // Sample data for line chart
    const lineChartData = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Leads',
          data: [12, 19, 3, 5, 2],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Deals',
          data: [8, 12, 6, 9, 4],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Products',
          data: [5, 10, 15, 8, 3],
          borderColor: 'rgba(255, 205, 86, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    // Sample data for bar chart
    const barChartData = {
      labels: ['January', 'Feburary', 'March'],
      datasets: [
        {
          label: 'Leads',
          data: [30, 50, 20],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)'],
        },
        {
          label: 'Deals',
          data: [15, 35, 50],
          backgroundColor: ['rgba(255, 99, 132, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(255, 205, 86, 0.4)'],
        },
        {
          label: 'Products',
          data: [10, 30, 60],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 205, 86, 0.2)'],
        },
      ],
    };

    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    lineChartRef.current = new Chart(lineChartCtx, {
      type: 'line',
      data: lineChartData,
    });

    const barChartCtx = document.getElementById('barChart').getContext('2d');
    barChartRef.current = new Chart(barChartCtx, {
      type: 'bar',
      data: barChartData,
    });

    return () => {
      if (lineChartRef.current) lineChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, []);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center Hero">
      <div className="container">
      <div className="row mt-5">
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
               <span className="d-flex align-items-center justify-content-between">
               <p className="card-title" style={{ color: '#000', fontSize: '20px' }}>Lead Count</p>
                <h5 style={{ backgroundColor: "#e0dcfe", color: '#624bff', padding: '10px', borderRadius: '5px' }}><MdOutlineLeaderboard /></h5>
               </span>
                <h2 className="card-text"><strong>100</strong></h2>
                <h6 className="card-text text-secondary">50 converted</h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
               <span className="d-flex align-items-center justify-content-between">
               <p className="card-title" style={{ color: '#000', fontSize: '20px' }}>Deal Count</p>
                <h5 style={{ backgroundColor: "#e0dcfe", color: '#624bff', padding: '10px', borderRadius: '5px' }}><MdOutlineAccountBalance  /></h5>
               </span>
                <h2 className="card-text"><strong>50</strong></h2>
                <h6 className="card-text text-secondary">Revenue Generated</h6>
              </div>
            </div>
          </div><div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
               <span className="d-flex align-items-center justify-content-between">
               <p className="card-title" style={{ color: '#000', fontSize: '20px' }}>Products</p>
                <h5 style={{ backgroundColor: "#e0dcfe", color: '#624bff', padding: '10px', borderRadius: '5px' }}><MdOutlineShoppingCart  /></h5>
               </span>
                <h2 className="card-text"><strong>75</strong></h2>
                <h6 className="card-text text-secondary">25 Newly Added</h6>
              </div>
            </div>
          </div><div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
               <span className="d-flex align-items-center justify-content-between">
               <p className="card-title" style={{ color: '#000', fontSize: '20px' }}>Total Revenue</p>
                <h5 style={{ backgroundColor: "#e0dcfe", color: '#624bff', padding: '10px', borderRadius: '5px' }}><TbPigMoney /></h5>
               </span>
                <h2 className="card-text"><strong><span style={{ color: '#624bff' }}>$</span> 25,300</strong></h2>
                <h6 className="card-text text-secondary">Sales Increse 6%</h6>
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
