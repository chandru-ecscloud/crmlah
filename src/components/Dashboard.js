import React from "react";
import CRM from "../assets/heroImage.png";

function Dashboard() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center Hero"
      style={{ minHeight: "80vh" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-6 col-12 d-flex align-items-center justify-content-center">
            <h1 className="text-center">Welcome to ECS CRM Dashboard</h1>
          </div>
          <div className="col-lg-7 col-md-6 col-12 heroImageBackground">
            <img className="img-fluid" src={CRM} alt="CRMLAH" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
