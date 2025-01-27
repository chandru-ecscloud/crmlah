import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentWarrning from "../../assets/payment_warrning.png";

const NetworkError = () => {
    
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
              Error, No response!
            </span>
            <p className="mt-3 h5 fw-semibold"
              style={{ marginBottom: "6rem" }}>
              Your bank failed to respond</p>
            <p className="mt-3 mb-0 success-note">Error:</p>
            <p className="">We couldn't get a response from the bank server. <br />Reach out to our support team at <br/> info@ecsaio.com or 
            +91 9361365818 for help.</p>
            <a
              href="https://ecsaio.in/students_internship/contact"
              className="text-muted"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkError
