import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HeroImage from "../../assets/heroImage.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("*Enter the Name"),
  userName: yup
    .string()
    .required("*Enter the User Name")
    .min(4, "*min length of 4 chars"),
  companyName: yup.string().required("*Enter the Company Name"),
  email: yup
    .string()
    .email("*Please Enter valid email")
    .required("*Enter the Email"),

  // role: yup.string().required("*Select the Role"),
  password: yup.string().required("*Enter the valid Password"),
  // .min(4, "*min length of 4 chars")
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
  // )
  // .max(10, "*Enter upto 15 chars only"),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("*Confirm Password is required"),
  countryCode: yup.string().required("*Enter Country Code Number"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("phone-length", function (value) {
      const { countryCode } = this.parent;
      if (value && /\s/.test(value)) {
        return this.createError({
          message: "Phone number should not contain spaces",
        });
      }
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
  zipCode: yup
    .string()
    .required("*Enter zipcode")
    .matches(/^\d+$/, "Must be only digits"),
  country: yup.string().required("*Enter contry"),
});

const CompanyRegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPasword] = useState(false);
  const [userNameAvailable, setUserNameAvailable] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const currentData = new Date().toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      name: "",
      userName: "",
      companyName: "",
      email: "",
      role: "",
      password: "",
      cpassword: "",
      countryCode: "",
      phone: "",
      address: "",
      city: "",
      minutes: "",
      time: "",
      hour: "",
      none: "",
      street: "",
      state: "",
      zipCode: "",
      country: "",
      registrationStatus: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("User Datas:", data);
      data.role = "CMP_OWNER";
      data.jwtRole = "CMP_OWNER";
      data.appointmentRoleType = "OWNER";
      data.registrationStatus = "TRIAL";
      try {
        let response;
        if (userNameAvailable) {
          setLoadIndicator(true);
          response = await axios.post(`${API_URL}newUserRegister`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        if (response && response.status === 201) {
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
          navigate("/emailsuccess");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.warning(error?.response?.data?.message);
      } finally {
        setLoadIndicator(false); // Set loading indicator back to false after request completes
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPasword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };
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
    formik.setFieldValue("countryCode", "65");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.userName]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label htmlfor="userName" className="form-label">
          Full Name:
        </label>
        <input
          type="text"
          name="name"
          id="name"
          {...formik.getFieldProps("name")}
          className={`form-control ${
            formik.touched.name && formik.errors.name ? "is-invalid" : ""
          }`}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-danger text-start">{formik.errors.name}</p>
        )}
      </div>
      {/*  UserName */}
      <div className="mb-3">
        <label htmlfor="userName" className="form-label">
          UserName:
        </label>
        <input
          type="text"
          name="userName"
          id="userName"
          {...formik.getFieldProps("userName")}
          className={`form-control ${
            formik.touched.userName && formik.errors.userName
              ? "is-invalid"
              : ""
          }`}
        />
        {formik.touched.userName && formik.errors.userName && (
          <p className="text-danger text-start">{formik.errors.userName}</p>
        )}
        {formik.values.userName.length >= 4 &&
          (userNameAvailable ? (
            <p className="text-success text-start">User Name is available!</p>
          ) : (
            <p className="text-danger text-start">
              User Name is already taken. Please try another.
            </p>
          ))}
      </div>

      <div className="mb-3">
        <label htmlfor="companyName" className="form-label">
          Company Name:
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          {...formik.getFieldProps("companyName")}
          className={`form-control ${
            formik.touched.companyName && formik.errors.companyName
              ? "is-invalid"
              : ""
          }`}
        />
        {formik.touched.companyName && formik.errors.companyName && (
          <p className="text-danger text-start">{formik.errors.companyName}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlfor="email" className="form-label">
          Email address:
        </label>
        <input
          type="text"
          name="email"
          id="email"
          {...formik.getFieldProps("email")}
          className={`form-control ${
            formik.touched.email && formik.errors.email ? "is-invalid" : ""
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-danger text-start">{formik.errors.email}</p>
        )}
      </div>

      {/* <div className="mb-3">
        <label htmlfor="email" className="form-label">
          Role  :
        </label>
        <input
          type="text"
          name="role"
          id="role"
          {...formik.getFieldProps("role")}
          className={`form-control ${formik.touched.role && formik.errors.role
            ? "is-invalid"
            : ""
            }`}
        />
        {formik.touched.role && formik.errors.role && (
          <p className="text-danger text-start">
            {formik.errors.role}
          </p>
        )}
      </div> */}

      {/* <div className="mb-3 ">
        <label className="form-label">Role :</label>
        <select
          type="text"
          name="role"
          className={`form-select form-size  ${
            formik.touched.role && formik.errors.role ? "is-invalid" : ""
          }`}
          {...formik.getFieldProps("role")}
        >
          <option value=""></option>
          <option value="ceo">CEO</option>
          <option value="manager">Manager</option>
          <option value="others">Others</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <p className="text-danger text-start">{formik.errors.role}</p>
        )}
      </div> */}

      {/* password */}
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

      {/* Cpassword */}
      <div className="form-group mb-3">
        <label htmlfor="password" className="form-label">
          Confrim Password
        </label>
        <div className="input-group">
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
            style={{ margin: "0px" }}
          />
          <span
            className="input-group-append eye-icon"
            onClick={toggleCPasswordVisibility}
          >
            {showCPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.cpassword && formik.errors.cpassword && (
          <p className="text-danger">{formik.errors.cpassword}</p>
        )}
      </div>

      {/* phone num */}
      {/* <div className="mb-3">
        <label htmlfor="Phone" className="form-label">
          Phone
        </label>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              country={"sg"}
              inputStyle={{ width: "100%" }}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {errors.phone && (
          <div style={{ color: "red" }}>{errors.phone.message}</div>
        )}
      </div> */}

      <div className="mb-3">
        <lable className="form-label">Phone</lable>
        <div className="input-group">
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
              <option value="65">+65</option>
              <option value="91">+91</option>
            </select>
          </div>
          <input
            type="tel"
            name="phone"
            id="phone"
            {...formik.getFieldProps("phone")}
            className={`form-control ${
              formik.touched.phone && formik.errors.phone ? "is-invalid" : ""
            }`}
          />
        </div>
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-danger text-start">{formik.errors.phone}</p>
        )}
      </div>

      {/* address */}
      <div className="mt-4">
        <label className="form-label">Address</label>
        <div className="mb-3">
          <input
            type="type"
            name="address"
            id="address"
            {...formik.getFieldProps("address")}
            className={`form-control ${
              formik.touched.address && formik.errors.address
                ? "is-invalid"
                : ""
            }`}
            placeholder="Enter address"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-danger text-start">{formik.errors.address}</p>
          )}
        </div>
        <div className="mb-3">
          <input
            type="type"
            name="city"
            id="city"
            {...formik.getFieldProps("city")}
            className={`form-control ${
              formik.touched.city && formik.errors.city ? "is-invalid" : ""
            }`}
            placeholder="City"
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-danger text-start">{formik.errors.city}</p>
          )}
        </div>
        <div className="row">
          <div className="col-md-6 col-12 mb-3 ">
            <input
              type="type"
              name="state"
              id="state"
              {...formik.getFieldProps("state")}
              className={`form-control ${
                formik.touched.state && formik.errors.state ? "is-invalid" : ""
              }`}
              placeholder="Enter state"
            />
            {formik.touched.state && formik.errors.state && (
              <p className="text-danger text-start">{formik.errors.state}</p>
            )}
          </div>
          <div className="col-md-6 col-12">
            <input
              type="text"
              //className="form-control "
              pattern="[0-9]*"
              id="zipCode"
              {...formik.getFieldProps("zipCode")}
              className={`form-control ${
                formik.touched.zipCode && formik.errors.zipCode
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="zip"
              //  onChange={(e)=>{e.target.value.replace(/\D/g, '')}}
            />
            {formik.touched.zipCode && formik.errors.zipCode && (
              <p className="text-danger text-start">{formik.errors.zipCode}</p>
            )}
          </div>
        </div>
        <div className="mb-3">
          <input
            type="text"
            id="country"
            {...formik.getFieldProps("country")}
            className={`form-control ${
              formik.touched.country && formik.errors.country
                ? "is-invalid"
                : ""
            }`}
            placeholder="Country"
          />
          {formik.touched.country && formik.errors.country && (
            <p className="text-danger text-start">{formik.errors.country}</p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center ">
        <button
          // className="donateBtn btn btn-primary mx-auto"
          className="btn donateBtn "
          type="submit"
          disabled={loadIndicator}
        >
          {loadIndicator && (
            <span
              class="spinner-border spinner-border-sm me-2 "
              aria-hidden="true"
            ></span>
          )}
          Register
        </button>
      </div>
    </form>
  );
};

const CompanyRegistrationPage = () => {
  return (
    <div className="signIn">
      <div style={{ backgroundColor: "#ECFAFE" }} className="py-5">
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-start justify-content-center mt-5">
              <img
                src={HeroImage}
                alt="CRMLAH"
                className="img-fluid register-image"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="row">
                <h3 className="registerWord text-center mt-3">REGISTER FORM</h3>
                <CompanyRegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
