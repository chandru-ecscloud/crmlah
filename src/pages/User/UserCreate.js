import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
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
  countryCode: yup.string().required("*Country Code is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("phone-length", function (value) {
      const { countryCode } = this.parent;
      if (countryCode === "65") {
        return value && value.length === 8
          ? true
          : this.createError({ message: "Phone number must be 8 digits only" });
      }
      if (countryCode === "91") {
        return value && value.length === 10
          ? true
          : this.createError({
              message: "Phone number must be 10 digits only",
            });
      }
      return true; // Default validation for other country codes
    }),
  address: yup.string().required("*Enter Address"),
  city: yup.string().required("*Enter city"),
  // state: yup.string().required("*Enter state"),
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
  const currentData = new Date().toISOString().split("T")[0];

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
      countryCode: "65",
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
      data.jwtRole = data.role;
      try {
        const response = await axios.post(`${API_URL}newUserRegister`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          let mailContent;
          mailContent = `<!DOCTYPE html>
                          <html lang="en">

                          <head>
                              <meta charset="UTF-8" />
                              <title>Invoice</title>
                              <style>
                                  body {
                                      background-color: #ddd;
                                  }

                                  .invoice-box {
                                      font-size: 12px;
                                      max-width: 600px;
                                      background-color: #fff;
                                      margin: auto;
                                      padding: 30px;
                                      border-bottom: 3px solid #0059ff;
                                      line-height: 24px;
                                      font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                                      color: #555;
                                      min-height: 85vh;
                                  }

                                  .invoice-box table {
                                      width: 100%;
                                      line-height: inherit;
                                      text-align: left;
                                  }

                                  .invoice-box table td {
                                      padding: 5px;
                                      vertical-align: top;
                                  }

                                  .invoice-box table td.third {
                                      text-align: right;
                                  }

                                  .invoice-box table tr.heading td {
                                      background: #eee;
                                      border-bottom: 1px solid #ddd;
                                      font-weight: bold;
                                  }

                                  .invoice-box table tr.item td {
                                      border-bottom: 1px solid #eee;
                                  }

                                  .invoice-box table tr.item.last td {
                                      border-bottom: none;
                                  }

                                  .invoice-box table tr.total td:nth-child(2) {
                                      border-top: 2px solid #eee;
                                      font-weight: bold;
                                  }

                                  .invoice {
                                      padding: 1rem;
                                  }

                                  #scan {
                                      float: right;
                                  }

                                  #scan img {
                                      max-width: 100%;
                                      height: auto;
                                  }

                                  @media print {
                                      .invoice-box {
                                          border: 0;
                                      }
                                  }

                                  .styled-button {
                                      background-color: #4CAF50;
                                      /* Green background */
                                      border: none;
                                      /* Remove border */
                                      color: white;
                                      /* White text */
                                      padding: 5px 10px;
                                      /* Some padding */
                                      text-align: center;
                                      /* Center text */
                                      text-decoration: none;
                                      /* Remove underline */
                                      display: inline-block;
                                      /* Make the link a block element */
                                      font-size: 12px;
                                      /* Increase font size */
                                      margin: 4px 2px;
                                      /* Some margin */
                                      cursor: pointer;
                                      /* Pointer/hand icon */
                                      border-radius: 4px;
                                      /* Rounded corners */
                                      transition-duration: 0.4s;
                                      /* Transition effect */
                                  }

                                  .styled-button:hover {
                                      background-color: #006803;
                                      /* White background on hover */

                                  }
                              </style>
                          </head>

                          <body>
                              <div class="invoice-box">
                                  <table>
                                      <tr class="top">
                                          <td colspan="2">
                                              <table>
                                                  <tr>
                                                      <td class="title">
                                                          <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png"
                                                              style="width: 75%; max-width: 180px" alt="Logo" />
                                                      </td>
                                                      <td class="third">
                                                          <b>Date:</b> ${currentData}<br />
                                                          The Alexcier, 237 Alexandra Road,<br />
                                                          #04-10, Singapore-159929.
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>


                                  <div class="invoice">
                                      <h1 style="color: black;">Hi, ${data.name}!</h1>
                                      <p style="margin: 2rem 0 0;">Welcome to ECS Cloud! We are thrilled to have you on board.</p>
                                      <p style="margin: 1.5rem 0;">To complete your registration and activate your account, please click the
                                          button below:</p>
                                      <a href="https://crmlah.com?userId=${response.data.userId}"><button class="styled-button">Confirm It's You</button></a>

                                      <p style="margin: 1.5rem 0px 2rem 0px;">Thank you for registering with us! We appreciate your business.</p>

                                      <p style="margin: 1.5rem 0px 0px;">Here are your CRM credentials:</p>
                                      <p style="margin: 1rem 0px 0px;"><b>Username:</b> ${data.userName}</p>
                                      <p style="margin: 1rem 0px 2rem 0px;"><b>Password:</b> ${data.password}</p>

                                      <hr />

                                      <p style="margin: 1.5rem 0;">You are currently on a 30-day trial      version. After the trial period ends, your
                                          account will be deactivated. To prevent this, please upgrade your plan within the trial period to avoid
                                          deactivation. For further details regarding your CRMLAH registration or to upgrade your license, please
                                          do not hesitate to contact our team:</p>
                                      <p style="margin: 1rem 0;"><b>Email:</b> info@ecscloudinfotech.com</p>
                                      <p style="margin: 1rem 0;"><b>Phone:</b> (+65) 88941306</p>

                                      <hr />

                                      <p style="margin: 2rem 0 0;">If you need any assistance, feel free to reach out to our support team:</p>
                                      <p style="margin: 1rem 0;"><b>Email:</b> info@ecscloudinfotech.com</p>
                                      <p style="margin: 1rem 0;"><b>Phone:</b> (+65) 88941306</p>

                                      <hr />

                                      <p style="margin: 2rem 0 0;">See You Soon,</p>
                                      <p style="margin: 0;">ECS Cloud</p>
                                      <p style="margin: 0 0 2rem 0;">Powered by ECS</p>

                                      <hr />

                                      <p style="margin: 2rem 0 0; font-size: smaller; color: gray;">This email was sent to you as part of your CRM
                                          registration process. If you did not register for this account, please contact our support team
                                          immediately.</p>
                                  </div>
                              </div>
                          </body>

                          </html>`;
          try {
            const response = await axios.post(`${API_URL}sendMail`, {
              toMail: data.email,
              fromMail: data.email,
              subject: "Please Verify Your Email to Complete Your Registration",
              htmlContent: mailContent,
            });

            if (response.status === 200) {
              // toast.success(response.data.message);
              toast.success("Mail Send Successfully");
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            toast.error("Mail Not Send");
            // console.error("Failed to send email:", error);
          }
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

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}getUserRegistrationDetailsByCompanyId/${companyId}`
        );
        formik.setFieldValue("companyName", response.data.companyName);
        formik.setFieldValue("address", response.data.address);
        formik.setFieldValue("city", response.data.city);
        formik.setFieldValue("state", response.data.state);
        formik.setFieldValue("zipCode", response.data.zipCode);
        formik.setFieldValue("country", response.data.country);
        // console.log("userData", response.data.companyName);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <lable>User Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>Company Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                  readOnly
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
                <lable>Email</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>Role</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>Appointment Role</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <label>Registration Status</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  id="registrationStatus"
                  className={`form-size form-select  ${
                    formik.touched.registrationStatus &&
                    formik.errors.registrationStatus
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("registrationStatus")}
                >
                  {/* <option value=""></option> */}
                  <option></option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="row sm-device">
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
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Phone</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      {...formik.getFieldProps("countryCode")}
                      id="countryCode"
                      name="countryCode"
                      className={`form-size form-control  ${
                        formik.touched.countryCode && formik.errors.countryCode
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <option value="65" selected>
                        +65
                      </option>
                      <option value="91">+91</option>
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
                <lable>Password</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                    style={{ margin: "0px", borderRight: "none" }}
                  />
                  <span
                    className="btn border"
                    onClick={togglePasswordVisibility}
                    style={{ borderLeft: "none !important" }}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-secondary" />
                    ) : (
                      <FaEye className="text-secondary" />
                    )}
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
                <lable>Confirm Password</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                    style={{ margin: "0px", borderRight: "none" }}
                  />
                  <span
                    className="btn border"
                    onClick={toggleCPasswordVisibility}
                    style={{ borderLeft: "none !important" }}
                  >
                    {showCPassword ? (
                      <FaEyeSlash className="text-secondary" />
                    ) : (
                      <FaEye className="text-secondary" />
                    )}
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
                <lable>Address</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>City</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>State</lable>
                &nbsp;&nbsp;
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
                <lable>Zip Code</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
                <lable>Country</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
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
