import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "../../assets/heroImage.png";

function LogIn({ handleLogin }) {
  return (
    <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
      <div className="container">
        <div className="row py-5">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
            <img src={HeroImage} alt="CRMLAH" className="img-fluid" />
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <h3 className="registerWord text-center">LOGIN</h3>
            <form>
              <div className="form-group mt-3">
                <label htmlFor="companyId">Company ID:</label>
                <input type="text" className="form-control" id="companyId" />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="Username">User Name:</label>
                <input type="text" className="form-control" id="Username" />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="Password">Password:</label>
                <input type="text" className="form-control" id="Password" />
              </div>
              <Link to="/lead">
                <button
                  className="contactsubmitBtn btn btn-danger mt-3"
                  type="button"
                  onClick={() => handleLogin(true)}
                >
                  Login
                </button>
              </Link>
              <p className="forgotWord text-center mt-5">
                Forgot{" "}
                <Link to="/forgot" className="password-link">
                  Password
                </Link>
                ?
              </p>
              <p className="forgotWord text-center">
                Don't have an account?{" "}
                <Link to="/signin" className="password-link">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
