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
import { actualPassword } from "@mui/icons-material";
import { FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("*User Name is required"),
  companyName: Yup.string().required("*Company Name is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10)
    .required("*Phone Number is required is required"),
  email: Yup.string().email("Invalid email").required("*Email is required"),
  registrationStatus: Yup.string().required("*Status is required"),
  role: Yup.string().required("*Select the Role"),
  actualPassword: Yup.string()
    .required("*Enter the valid actualPassword")
    .min(4, "*min length of 4 chars")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "actualPassword must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .max(10, "*Enter upto 15 chars only"),
  confirm_Password: Yup.string()
    .oneOf([Yup.ref("actualPassword"), null], "Passwords must match")
    .required("*Confirm actualPassword is required"),
  address: Yup.string().required("*Enter Your Address"),
  city: Yup.string().required("*Enter Your City"),
  state: Yup.string().required("*Enter Your State"),
  zipCode: Yup.string().required("*Enter Country Code Number"),
  country: Yup.string().required("*Enter Your Country "),
});

function CompanyCreate() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      companyId: userId,
      // company_owner: owner,
      userName: "",
      companyName: "",
      phone: "",
      email: "",
      registrationStatus: "",
      role: "",
      actualPassword: "",
      confirm_Password: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    // validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Company Datas:", data);
      data.jwtRole = data.role;
      try {
        const response = await axios.post(`${API_URL}newUserRegister`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.registrationStatus === 201) {
          toast.success(response.data.message);
          navigate("/company");
          console.log("company data:", response.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Company</b>
                <br></br>
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
                {/* Input for image upload */}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" />
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
        <div className="container-fluid my-5">
          <h4>
            <b>Company Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <input
              type="hidden"
              {...formik.getFieldProps("companyId")}
              value={userId}
              name="companyId"
            />

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>User Name</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("userName")}
                  type="text"
                  className="form-size form-control"
                  id="userName"
                  name="userName"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.userName && formik.errors.userName && (
                    <div className="text-danger ">{formik.errors.userName}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Company Name</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyName")}
                  type="text"
                  className="form-size form-control"
                  id="companyName"
                  name="companyName"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className="text-danger ">
                      {formik.errors.companyName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Phone</lable> &nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      className="form-size form-select form-control"
                      {...formik.getFieldProps("country_code")}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="country_code"
                    >
                      <option value="+65">+65</option>
                      <option value="+91">+91</option>
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
                    <div className="text-danger ">{formik.errors.phone}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Email</lable> &nbsp;&nbsp;
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
                    <div className="text-danger ">{formik.errors.email}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Status</label>&nbsp;&nbsp;
                <select
                  id="registrationStatus"
                  className="form-size form-select"
                  name="registrationStatus"
                >
                  <option value="--"></option>
                  <option value="approved">Approved</option>
                  <option value="pending" selected>
                    Pending
                  </option>
                  <option value="rejected">Rejected</option>
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
                  <option value="company_Owner">CEO</option>
                  <option value="company_Owner">Manager</option>
                  <option value="company_Owner">Others</option>
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
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Password</label>&nbsp;&nbsp;
                <div className="input-group " style={{ width: "60%" }}>
                  <input
                    {...formik.getFieldProps("actualPassword")}
                    type={showPassword ? "text" : "password"}
                    className="form-size form-control"
                    id="actualPassword"
                    name="actualPassword"
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
                  {formik.touched.actualPassword &&
                    formik.errors.actualPassword && (
                      <div className="text-danger ">
                        {formik.errors.actualPassword}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Confirm actualPassword</label>&nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <input
                    {...formik.getFieldProps("confirm_Password")}
                    type={showConfirmPassword ? "text" : "actualPassword"}
                    className="form-size form-control"
                    id="confirm_Password"
                    name="confirm_Password"
                  />
                  <button
                    type="button"
                    className="btn"
                    style={{ borderColor: "#E5E4E2" }}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.confirm_Password &&
                    formik.errors.confirm_Password && (
                      <div className="text-danger ">
                        {formik.errors.confirm_Password}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Address</lable> &nbsp;&nbsp;
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
                <lable>City</lable> &nbsp;&nbsp;
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
                <lable>Zip Code</lable> &nbsp;&nbsp;
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
                <lable>Country</lable> &nbsp;&nbsp;
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
