import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CRM from "../../assets/heroImage.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  company_id: yup.string().required("!please enter the UserId"),
  username: yup.string().required("!please enter the UserName"),
  // password: yup.string().required("!Enter the valid Password").min(4, "!min length of 4 chars").matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
  // ).max(10, "!Enter upto 15 chars only"),
});

function LogIn({ handleLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
        sessionStorage.setItem("company_id", data.company_id);
        sessionStorage.setItem("user_name", data.username);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.userId);
        handleLogin();
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    // <section className="logIn">
    //   <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
    //     <div className="container">
    //       <div className="row py-5">
    //         <div className="col-md-6 col-12 heroImageBackground d-flex align-items-center justify-content-center">
    //           <img className="img-fluid" src={CRM} alt="CRMLAH" />
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12">
    //           <h3 className="registerWord text-center">LOGIN</h3>
    //           <form>
    //             <div className="form-group mt-3">
    //               <label htmlFor="companyId">Company ID:</label>
    //               <input
    //                 type="text"
    //                 {...register('company_id')}
    //                 className="form-control"
    //                 value={company_id}
    //                 onChange={(e) => setCompanyId(e.target.value)}
    //                 name="company_id"
    //                 id="company_id"
    //               />
    //               <p className='text-danger'>{errors.company_id?.message}</p>
    //             </div>
    //             <div className="form-group mt-3">
    //               <label htmlFor="Username">User Name:</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 onChange={(e) => setUserName(e.target.value)}
    //                 value={username}
    //                 name="username"
    //                 id="username"
    //               />
    //             </div>
    //             <div className="form-group mt-3">
    //               <label htmlFor="Password">Password:</label>
    //               <input
    //                 type="password"
    //                 value={password}
    //                 onChange={(e) => setPassword(e.target.value)}
    //                 name="password"
    //                 className="form-control"
    //                 id="password"
    //               />
    //             </div>
    //             <button
    //               className="contactsubmitBtn btn btn-primary mt-3"
    //               type="button"
    //               onClick={handelLogin}
    //               // onClick={handleSubmit((data => {
    //               //                   console.log("Login Data:",data)
    //               //                   handelLogin()
    //               //                 }))}
    //             >
    //               Login
    //             </button>
    //             <p className="forgotWord text-center mt-5">
    //               Forgot{" "}
    //               <Link to="/forgot" className="password-link">
    //                 Password
    //               </Link>
    //               ?
    //             </p>
    //             <p className="forgotWord text-center">
    //               Don't have an account?{" "}
    //               <Link to="/signin" className="password-link">
    //                 Sign up
    //               </Link>
    //             </p>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <section className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <h3 className="registerWord text-center">LOGIN</h3>
              <form>
                <div className="form-group mt-3">
                  <label htmlFor="companyId">Company ID:</label>
                  <input
                    {...register("company_id")}
                    type="text"
                    class="form-control"
                    id="companyid"
                  />
                  <p className="text-danger">{errors.company_id?.message}</p>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="username">User Name:</label>
                  <input
                    {...register("username")}
                    type="email"
                    class="form-control"
                    id="Email"
                  />
                  <p className="text-danger">{errors.username?.message}</p>
                </div>

                <div className="form-group mb-3">
                  <label htmlfor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="InputPassword1"
                      style={{ margin: "0px" }}
                    />
                    <span
                      className="input-group-append eye-icon"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <p className="text-danger">{errors.password?.message}</p>
                </div>

                <button
                  className="contactsubmitBtn btn btn-primary mx-auto"
                  onClick={handleSubmit((data) => {
                    handelLoginClick(data);
                  })}
                  type="button"
                >
                  Login
                </button>

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
