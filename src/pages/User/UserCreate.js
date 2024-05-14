import React, { useState, useEffect } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = yup.object().shape({
  userName: yup.string().required("*Enter the User Name"),
  name: yup.string().required("*Enter the Name"),
  companyName: yup.string().required("*Enter the Company Name"),
  email: yup
    .string()
    .email("*Please Enter valid email")
    .required("*Enter the Email"),

  role: yup.string().required("*Select the Role"),
  appointmentRoleType: yup.string().required("*Select the Appointment Role"),
  password: yup
    .string()
    .required("*Enter the valid Password")
    .min(4, "*min length of 4 chars")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("*Confirm Password is required"),
  countryCode: yup.string().required("*Enter Country Code Number"),
  phone: yup
    .string()
    .required("*Phone number is required")
    .min(8, "*phone must be at atleast 8 characters")
    .max(10, "*phone must be at most 10 characters"),
  address: yup.string().required("*Enter Address"),
  city: yup.string().required("*Enter city"),
  state: yup.string().required("*Enter state"),
  zipCode: yup
    .string()
    .required("*Enter zipcode")
    .matches(/^\d+$/, "Must be only digits"),
  country: yup.string().required("*Enter contry"),
  registrationStatus: yup.string().required("*Status is required"),
});
function UserCreate() {
  const companyId = sessionStorage.getItem("companyId");
  // const userId = sessionStorage.getItem("userId");
  // const owner = sessionStorage.getItem("user_name");
  // const role = sessionStorage.getItem("role");
  // const token = sessionStorage.getItem("token");
  // const [userImage, setUserImage] = useState(User);
  const [userNameAvailable, setUserNameAvailable] = useState(false);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPasword] = useState(false);

  const formik = useFormik({
    initialValues: {
      userName: "",
      name: "",
      companyId: companyId,
      companyName: "",
      email: "",
      role: "",
      appointmentRoleType: "",
      password: "",
      cpassword: "",
      countryCode: "",
      phone: "",
      address: "",
      city: "",
      registrationStatus: "",
      // minutes: "",
      // time: "",
      // hour: "",
      // none: "",
      street: "",
      state: "",
      zipCode: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log(data);
      data.jwtRole = data.role;
      try {
        const response = await axios.post(`${API_URL}newUserRegister`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/users");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error?.response?.data?.message);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPasword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (formik.values.userName.length >= 4) {
          const response = await axios.get(
            `${API_URL}checkUserName?userName=${formik.values.userName}`
          );
          if (response.status === 200) {
            // console.log(response.data);
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
  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create User</b>
                {/* <br></br>
                                <img
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
                                />
                              
                                <input
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
              <Link to={"/users"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>User Information</b>
          </h4>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>User Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.userName && formik.errors.userName
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

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("name")}
                  name="name"
                  id="name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-danger">{formik.errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Company Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyName && formik.errors.companyName
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
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-danger">{formik.errors.companyName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Email</lable> &nbsp;&nbsp;
                <input
                  type="email"
                  className={`form-size form-control  ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                  id="email"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-danger">{formik.errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Role</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.role && formik.errors.role
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("role")}
                  id="role"
                >
                  <option value=""></option>
                  <option value="CMP_ADMIN">Admin</option>
                  <option value="CMP_USER">User</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-danger">{formik.errors.role}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Appointment Role</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.appointmentRoleType &&
                    formik.errors.appointmentRoleType
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("appointmentRoleType")}
                  id="appointmentRoleType"
                >
                  <option></option>
                  <option value="SALES_MANAGER">SALES MANAGER</option>
                  <option value="SALES_EXECUTIVE">SALES EXECUTIVE</option>
                  <option value="FREELANCERS">FREELANCERS</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.appointmentRoleType &&
                    formik.errors.appointmentRoleType && (
                      <p className="text-danger">
                        {formik.errors.appointmentRoleType}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Registration Status</label>&nbsp;&nbsp;
                <select
                  id="registrationStatus"
                  className="form-size form-select"
                  {...formik.getFieldProps("registrationStatus")}
                >
                  {/* <option value=""></option> */}
                  <option></option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.registrationStatus &&
                    formik.errors.registrationStatus && (
                      <div className="text-danger ">
                        {formik.errors.registrationStatus}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Phone</lable> &nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      className="form-select"
                      {...formik.getFieldProps("countryCode")}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <option></option>
                      <option value="+65">+65</option>
                      <option value="+91">+91</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-size form-control  ${
                      formik.touched.phone && formik.errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("phone")}
                    id="phone"
                    aria-label="Text input with checkbox"
                  />
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-danger">{formik.errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Password</lable> &nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
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
                    style={{ margin: "0px" ,borderRight:"none"}}
                  />
                  <span
                    className="btn border"
                    onClick={togglePasswordVisibility}
                    style={{ borderLeft:"none !important"}}
                  >
                    {showPassword ? <FaEyeSlash className="text-secondary"/> : <FaEye className="text-secondary"/>}
                  </span>
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-danger">{formik.errors.password}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Confirm Password</lable> &nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <input
                    type={showCPassword ? "text" : "password"}
                    className={`form-size form-control  ${
                      formik.touched.cpassword && formik.errors.cpassword
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("cpassword")}
                    name="cpassword"
                    id="cpassword"
                    style={{ margin: "0px" ,borderRight:"none"}}
                  />
                  <span
                    className="btn border"
                    onClick={toggleCPasswordVisibility}
                    style={{ borderLeft:"none !important"}}
                  >
                    {showCPassword ? <FaEyeSlash className="text-secondary"/> : <FaEye className="text-secondary"/>}
                  </span>
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.cpassword && formik.errors.cpassword && (
                    <p className="text-danger">{formik.errors.cpassword}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Address</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("address")}
                  name="address"
                  id="address"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-danger">{formik.errors.address}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.city && formik.errors.city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("city")}
                  name="city"
                  id="city"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-danger">{formik.errors.city}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.state && formik.errors.state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("state")}
                  name="state"
                  id="state"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-danger">{formik.errors.state}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Zip Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.zipCode && formik.errors.zipCode
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("zipCode")}
                  name="zipCode"
                  id="zipCode"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <p className="text-danger">{formik.errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.country && formik.errors.country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("country")}
                  name="country"
                  id="country"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.country && formik.errors.country && (
                    <p className="text-danger">{formik.errors.country}</p>
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

export default UserCreate;
