import React from "react";
import "../../styles/dummy.css";
import Tick from "../../assets/Tick.png";
import { Link } from "react-router-dom";

function EmailSuccess() {
  return (
    <div style={{ marginTop: "105px" }} className=" container">
      <div className="row">
        <div className="emailSuccess offset-lg-2 col-lg-8 col-12">
          <img src={Tick} alt="Tick" width={100} className="img-fluid" />
          <h2>Registration Successful!</h2>
          <p>
            Thank you for registering with us. An email has been sent to the
            address you provided for verification. Please check your inbox and
            follow the instructions to complete the registration process.
          </p>
          <p>
          If you have already verified your email, you can proceed to <Link to="/login" style={{ textDecoration: 'none' }}><b>Login</b></Link>  using the credentials sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailSuccess;
