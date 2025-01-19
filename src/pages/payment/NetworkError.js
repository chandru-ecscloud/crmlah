import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentWarrning from "../../assets/payment_warrning.png";

const NetworkError = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
  
    const OrderId = queryParams.get("OrderId");
    if (!OrderId) {
      navigate("/");
    }
  return (
    <div className="container py-2">
      <div className="row justify-content-center"
        style={{ marginTop: "4.5rem" }}>
        <div className="col-12">
          <div className="p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src={PaymentWarrning}
                className="img-fluid img-responsive success-img"
                alt="Success"
                style={{ maxHeight: "6em" }}
              />
            </div>
            <span className="badge rounded-pill mt-3"
              style={{ backgroundColor: "#fff3cd", color: "#FFC107", fontWeight: "lighter" }}>
              Payment Failed
            </span>
            <p className="mt-3 h5 fw-semibold"
              style={{ marginBottom: "6rem" }}>
              Something Went Wrong</p>
            <p className="mt-3 mb-0 fw-bold">Error:</p>
            <p className="success-note">We couldn't get a response from the bank server. <br />Reach out to our support team at <br/> info@ecsaio.com or 
            +91 9361365818 for help.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkError
