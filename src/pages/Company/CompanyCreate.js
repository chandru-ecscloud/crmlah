import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../../styles/dummy.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("*User Name is required"),
  companyName: Yup.string().required("*Company Name is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10)
    .required("*Phone Number is required is required"),
  email: Yup.string().email("Invalid email").required("*Email is required"),
  password: Yup.string()
    .required("*Enter the valid password")
    .min(4, "*min length of 4 chars")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
  // .max(10, "*Enter upto 15 chars only"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("*Confirm password is required"),
  address: Yup.string().required("*Enter Your Address"),
  city: Yup.string().required("*Enter Your City"),
  // state: Yup.string().required("*Enter Your State"),
  zipCode: Yup.string().required("*Enter Country Code Number"),
  country: Yup.string().required("*Enter Your Country "),
  name: Yup.string().required("*Name is required"), // Add validation for name field
});

function CompanyCreate() {
  const navigate = useNavigate();
  // const token = sessionStorage.getItem("token");
  // const [userImage, setUserImage] = useState(User);
  // const role = sessionStorage.getItem("role");
  // const companyId = sessionStorage.getItem("companyId");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userNameAvailable, setUserNameAvailable] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      // company_owner: owner,
      countryCode: "",
      userName: "",
      companyName: "",
      phone: "",
      email: "",
      role: "",
      password: "",
      cpassword: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log("Company Datas:", data);
      data.jwtRole = "CMP_OWNER";
      data.role = "CMP_OWNER";
      data.registrationStatus = "PENDING";
      try {
        const response = await axios.post(`${API_URL}newUserRegister`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/company");
          // console.log("company data:", response.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 409) {
          toast.error("Failed: " + error?.response?.data?.message);
        } else {
          toast.error("Failed: " + error?.response?.data?.message);
        }
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (formik.values.userName.length >= 4) {
          const response = await axios.get(
            `${API_URL}checkUserName?userName=${formik.values.userName}`
          );
          if (response.status === 200) {
            console.log(response.data);
            setUserNameAvailable(true);
          }
        }
        // setUserNameAvailable()
      } catch (error) {
        if (error?.response?.status === 409) {
          // Check for response status
          setUserNameAvailable(false);
        } else {
          toast.error(
            "Error Fetching User Name",
            error?.response?.data?.message
          );
        }
      }
    };

    if (formik.values.userName) {
      fetchUserData();
    }
  }, [formik.values.userName]);

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setUserImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Company</b>
                <br></br>
                {/* <img
                  src={userImage}
                  className="img-fluid mt-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  alt="user"
                  onClick={() => document.getElementById("imageInput").click()}
                /> */}
                {/* Input for image upload */}
                {/* <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" /> */}
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <span>
                <Link to="/company">
                  <button className="btn btn-danger">Cancel</button>
                </Link>
              </span>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="container mt-5">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12 mb-5">
                  <div className="d-flex align-items-center justify-content-end  sm-device">
                    <lable>Name</lable>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <input
                      {...formik.getFieldProps("name")}
                      type="text"
                      className={`form-size form-control ${formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                        }`}
                      id="name"
                      name="name"
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <div className="row sm-device pb-4">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        <div className="text-danger">{formik.errors.name}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-5">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                    <lable>User Name</lable>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <input
                      type="text"
                      className={`form-size form-control  ${formik.touched.userName && formik.errors.userName
                          ? "is-invalid"
                          : ""
                        }`}
                      {...formik.getFieldProps("userName")}
                      name="userName"
                      id="userName"
                    />
                  </div>
                  <div className="row sm-device">
                    <div className="col-5"></div>
                    <div className="col-6 sm-device">
                      {formik.touched.userName && formik.errors.userName && (
                        <p className="text-danger text-start">
                          {formik.errors.userName}
                        </p>
                      )}
                      {formik.values.userName.length >= 4 &&
                        (userNameAvailable ? (
                          <p className="text-success text-start">
                            User Name is available!
                          </p>
                        ) : (
                          <p className="text-danger text-start">
                            *User Name is already taken. Please try another.
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-12 mb-4">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                    <lable>Company Name</lable>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <input
                      type="text"
                      className={`form-size form-control  ${formik.touched.companyName && formik.errors.companyName
                          ? "is-invalid"
                          : ""
                        }`}
                      {...formik.getFieldProps("companyName")}
                      name="companyName"
                      id="companyName"
                    />
                  </div>
                  <div className="row sm-device">
                    <div className="col-5"></div>
                    <div className="col-6 sm-device">
                      {formik.touched.companyName &&
                        formik.errors.companyName && (
                          <p className="text-danger">
                            {formik.errors.companyName}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-4">
                  <div className="d-flex align-items-center justify-content-end  sm-device">
                    <lable>Phone</lable>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <div className="input-group" style={{ width: "60%" }}>
                      <div>
                        <select
                          className="form-size form-select form-control"
                          {...formik.getFieldProps("countryCode")}
                          style={{
                            width: "80px",
                            borderTopRightRadius: "0px",
                            borderBottomRightRadius: "0px",
                          }}
                          name="countryCode"
                        >
                          <option value="65" selected>
                            +65
                          </option>
                          <option value="91">+91</option>
                        </select>
                      </div>

                      <input
                        {...formik.getFieldProps("phone")}
                        type="tel"
                        name="phone"
                        id="phone"
                        className="form-control form-size"
                        aria-label="Text input with checkbox"
                      />
                    </div>
                  </div>

                  <div className="row sm-device pb-4">
                    <div className="col-5"></div>
                    <div className="col-6 sm-device">
                      {formik.touched.phone && formik.errors.phone && (
                        <div className="text-danger ">
                          {formik.errors.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end  sm-device">
                    <lable>Email</lable>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <input
                      {...formik.getFieldProps("email")}
                      type="text"
                      className="form-size form-control"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="row sm-device pb-4">
                    <div className="col-5"></div>
                    <div className="col-6 sm-device">
                      {formik.touched.email && formik.errors.email && (
                        <div className="text-danger ">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end  sm-device">
                    <label>Password</label>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <div className="input-group " style={{ width: "60%" }}>
                      <input
                        {...formik.getFieldProps("password")}
                        type={showPassword ? "text" : "password"}
                        className="form-size form-control"
                        id="password"
                        name="password"
                      />
                      <span
                        className="btn"
                        style={{ borderColor: "#E5E4E2" }}
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="row sm-device pb-4">
                    <div className="col-5"></div>
                    <div className="col-6 sm-device">
                      {formik.touched.password && formik.errors.password && (
                        <div className="text-danger ">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end  sm-device">
                    <label>Confrim Password</label>
                    <span className="text-danger">*</span> &nbsp;&nbsp;
                    <div className="input-group " style={{ width: "60%" }}>
                      <input
                        {...formik.getFieldProps("cpassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-size form-control"
                        id="cpassword"
                        name="cpassword"
                      />
                      <span
                        className="btn"
                        style={{ borderColor: "#E5E4E2" }}
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="row sm-device pb-4">
                    <div className="col-5"></div>
                    <div className="col-6 sm-device">
                      {formik.touched.cpassword && formik.errors.cpassword && (
                        <div className="text-danger ">
                          {formik.errors.cpassword}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Address</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("address")}
                  type="text"
                  className="form-size form-control"
                  id="address"
                  name="address"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.address && formik.errors.address && (
                    <div className="text-danger ">{formik.errors.address}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>City</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("city")}
                  type="text"
                  className="form-size form-control"
                  id="city"
                  name="city"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-danger ">{formik.errors.city}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("state")}
                  type="text"
                  className="form-size form-control"
                  id="state"
                  name="state"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.state && formik.errors.state && (
                    <div className="text-danger ">{formik.errors.state}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Zip Code</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("zipCode")}
                  type="text"
                  className="form-size form-control"
                  id="zipCode"
                  name="zipCode"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <div className="text-danger ">{formik.errors.zipCode}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Country</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("country")}
                  type="text"
                  className="form-size form-control"
                  id="country"
                  name="country"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-danger ">{formik.errors.country}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CompanyCreate;
