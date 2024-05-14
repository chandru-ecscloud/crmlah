import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CRM from "../../assets/heroImage.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  // company_name: yup.string().required("*please enter the Company Id"),
  username: yup.string().required("*UserName is required."),
  password: yup.string().required("*Enter the valid Password"),
  // min(4, "*min length of 4 chars").matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
  // ).max(10, "*Enter upto 15 chars only"),
});

function LogIn({ handleLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      // company_name: '',
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Api login Data:", data);
      handelLoginClick(data);
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handelLoginClick = async (data) => {
    try {
      const response = await axios.post(`${API_URL}userLogin`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        // sessionStorage.setItem("company_name", data.company_name);
        sessionStorage.setItem("user_name", data.username);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("companyId", response.data.companyId);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem(
          "appointmentRole",
          response.data.appointmentRole
        );
        handleLogin();
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if(error?.response?.status === 404){
        toast.warning("User not verified")
      }else{
        toast.warning("Invalid Username or Password")
      }
      // toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="signIn">
      <div style={{ backgroundColor: "#ECFAFE" }} className="py-5">
        <div className="container">
          <div className="row py-5">
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div> */}
            <div className="col-md-6 col-12 heroImageBackground">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <h3 className="registerWord text-center">LOGIN</h3>
              <form onSubmit={formik.handleSubmit}>
                {/* <div className="form-group mt-3">
                    <label>Company ID:</label>
                    <input
                      type="text"
                      className={`form-size form-control  ${formik.touched.company_name && formik.errors.company_name ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('company_name')}
                      name="company_name"
                      id="company_name"
                    />
                    {formik.touched.company_name && formik.errors.company_name && (
                      <p className="text-danger">{formik.errors.company_name}</p>
                    )}
                  </div> */}

                <div className="form-group mt-3">
                  <label htmlFor="username">User Name:</label>
                  <input
                    type="text"
                    className={`form-size form-control  ${
                      formik.touched.username && formik.errors.username
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("username")}
                    name="username"
                    id="username"
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-danger">{formik.errors.username}</p>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlfor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-size form-control  ${
                        formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("password")}
                      name="password"
                      id="password"
                      style={{ margin: "0px" }}
                    />
                    <span
                      className="input-group-append eye-icon"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-danger">{formik.errors.password}</p>
                  )}
                </div>
                <div className="d-flex justify-content-center ">
                  <button
                    // className="donateBtn btn btn-primary mx-auto"
                    className="btn donateBtn "
                    type="submit"
                  >
                    Login
                  </button>
                </div>

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
    </section>
  );
}

export default LogIn;
