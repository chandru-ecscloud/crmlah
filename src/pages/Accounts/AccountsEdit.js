import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

const validationSchema = Yup.object().shape({
  account_name: Yup.string().required("*Account Name is required"),
  country_code: Yup.string().required("*Country Code is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10)
    .required("*Phone Number is required is required"),
  email: Yup.string().email("Invalid email").required("*Email is required"),
  parent_account: Yup.string().required("*Parent Account is required"),
  account_number: Yup.string().required("*Account Number is required"),
  account_type: Yup.string().required("*Account Type is required"),
  shipping_street: Yup.string().required("*Shipping Street is required"),
  billing_street: Yup.string().required("*Billing Street is required"),
  shipping_city: Yup.string().required("*Shipping City is required"),
  billing_city: Yup.string().required("*Billing City is required"),
  shipping_code: Yup.string().required("*Shipping Code is required"),
  billing_code: Yup.string().required("*Billing Code is required"),
  shipping_state: Yup.string().required("*Shipping State is required"),
  billing_state: Yup.string().required("*Billing State is required"),
  shipping_country: Yup.string().required("*Shipping Country is required"),
  billing_country: Yup.string().required("*Billing Country is required"),
});

function AccountsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const [accountOption, setAccountOption] = useState([]);
  // console.log(accountOption);

  const formik = useFormik({
    initialValues: {
      account_owner: "",
      company_id: userId,
      account_name: "",
      country_code: "",
      phone: "",
      email: "",
      parent_account: "",
      account_number: "",
      account_type: "",
      shipping_street: "",
      billing_street: "",
      shipping_city: "",
      billing_city: "",
      shipping_code: "",
      billing_code: "",
      shipping_state: "",
      billing_state: "",
      shipping_country: "",
      billing_country: "",
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Account Datas:", data);
      try {
        const response = await axios.put(
          `${API_URL}updateAccount/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/accounts");
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

  const AccountList = async () => {
    try {
      const response = await axios(`${API_URL}accountNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setAccountOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allAccounts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;

        const payload = {
          company_id: userId,
          account_owner: getData.accountOwner,
          account_name: getData.accountName,
          country_code: getData.countryCode,
          phone: getData.phone,
          email: getData.email,
          parent_account: getData.parentAccount,
          account_number: getData.accountNumber,
          account_type: getData.accountType,
          shipping_street: getData.shippingStreet,
          billing_street: getData.billingStreet,
          shipping_city: getData.shippingCity,
          billing_city: getData.billingCity,
          shipping_code: getData.shippingCode,
          billing_code: getData.billingCode,
          shipping_state: getData.shippingState,
          billing_state: getData.billingState,
          shipping_country: getData.shippingCountry,
          billing_country: getData.billingCountry,
          description_info: getData.descriptionInfo,
        };
        // console.log("Converted Data", payload)
        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    AccountList();
    userData();
  }, [id]);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Account</b>
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
                <Link to="/accounts">
                  <button className="btn btn-danger">Cancel</button>
                </Link>
              </span>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Update
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Account Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <input
              type="hidden"
              {...formik.getFieldProps("company_id")}
              value={userId}
              name="company_id"
            />

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Account Owner</lable> &nbsp;&nbsp;
                <select
                  {...formik.getFieldProps("account_owner")}
                  type="text"
                  className="form-size form-select"
                  id="account_owner"
                  name="account_owner"
                >
                  <option value={owner}>{owner}</option>
                  <option value="Vignesh Devan">Vignesh Devan</option>
                  <option value="Chandru R">Chandru R</option>
                  <option value="Gayathri M">Gayathri M</option>
                  <option value="Poongodi K">Poongodi K</option>
                  <option value="Suriya G">Suriya G</option>
                  <option value="Leela Prasanna D">Leela Prasanna D</option>
                  <option value="Saravanan M">Saravanan M</option>
                  <option value="Nagaraj VR">Nagaraj VR</option>
                  <option value="Yalini A">Yalini A</option>
                  <option value="Vishnu Priya">Vishnu Priya</option>
                  <option value="Kavitha">Kavitha</option>
                </select>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <label>Rating</label>&nbsp;&nbsp;
                <select
                  id="rating"
                  className="form-size form-select"
                  name="rating"
                >
                  <option value="--">--</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  {...formik.getFieldProps("account_name")}
                  className="form-select form-size"
                  name="account_name"
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(accountOption) &&
                    accountOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row pb-4 sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.account_name &&
                    formik.errors.account_name && (
                      <div className="text-danger ">
                        {formik.errors.account_name}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Account Site</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="account_site"
                  id="account_site"
                  placeholder="--"
                />
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Parent Account</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("parent_account")}
                  type="text"
                  className="form-size form-control"
                  id="parent_account"
                  name="parent_account"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.parent_account &&
                    formik.errors.parent_account && (
                      <div className="text-danger ">
                        {formik.errors.parent_account}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Fax</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="fax"
                  id="fax"
                  placeholder="--"
                />
              </div>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Website</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="Website"
                  id="Website"
                  placeholder="--"
                />
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Account Number</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("account_number")}
                  type="text"
                  className="form-size form-control"
                  name="account_number"
                  id="account_number"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.account_number &&
                    formik.errors.account_number && (
                      <div className="text-danger ">
                        {formik.errors.account_number}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Ticker Symbol</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="ticker_symbol"
                  id="ticker_symbol"
                  placeholder="--"
                />
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Account Type</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("account_type")}
                  type="text"
                  className="form-size form-control"
                  name="account_type"
                  id="account_type"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.account_type &&
                    formik.errors.account_type && (
                      <div className="text-danger ">
                        {formik.errors.account_type}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Ownership</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="owner_ship"
                  id="owner_ship"
                  placeholder="--"
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <label htmlFor="accountOwner">Industry</label>&nbsp;&nbsp;
                <select
                  id="industry"
                  className="form-size form-select"
                  name="industry"
                >
                  <option value="--">--</option>
                  <option value="option1">Option 1</option>
                  <option value="option1">Option 2</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Employees</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="employees"
                  id="employees"
                  placeholder="--"
                />
              </div>
            </div> */}
{/* 
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>SIC Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="sic_code"
                  id="sic_code"
                  placeholder="--"
                />
              </div>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Annual Revenue</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="annual_revenue"
                  id="annual_revenue"
                  placeholder="--"
                />
              </div>
            </div> */}
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Shipping Street</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_street")}
                  type="text"
                  className="form-size form-control"
                  name="shipping_street"
                  id="shipping_street"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_street &&
                    formik.errors.shipping_street && (
                      <div className="text-danger ">
                        {formik.errors.shipping_street}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Billing Street</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_street")}
                  type="text"
                  className="form-size form-control"
                  name="billing_street"
                  id="billing_street"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_street &&
                    formik.errors.billing_street && (
                      <div className="text-danger ">
                        {formik.errors.billing_street}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Shipping City</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_city")}
                  type="text"
                  className="form-size form-control"
                  name="shipping_city"
                  id="shipping_city"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_city &&
                    formik.errors.shipping_city && (
                      <div className="text-danger ">
                        {formik.errors.shipping_city}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Billing City</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_city")}
                  type="text"
                  className="form-size form-control"
                  name="billing_city"
                  id="billing_city"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_city &&
                    formik.errors.billing_city && (
                      <div className="text-danger ">
                        {formik.errors.billing_city}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Shipping State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_state")}
                  type="text"
                  className="form-size form-control"
                  name="shipping_state"
                  id="shipping_state"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_state &&
                    formik.errors.shipping_state && (
                      <div className="text-danger ">
                        {formik.errors.shipping_state}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Billing State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_state")}
                  type="text"
                  className="form-size form-control"
                  name="billing_state"
                  id="billing_state"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_state &&
                    formik.errors.billing_state && (
                      <div className="text-danger ">
                        {formik.errors.billing_state}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 ">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Shipping Code</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_code")}
                  type="text"
                  className="form-size form-control"
                  name="shipping_code"
                  id="shipping_code"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_code &&
                    formik.errors.shipping_code && (
                      <div className="text-danger ">
                        {formik.errors.shipping_code}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Billing Code</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_code")}
                  type="text"
                  className="form-size form-control"
                  name="billing_code"
                  id="billing_code"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_code &&
                    formik.errors.billing_code && (
                      <div className="text-danger ">
                        {formik.errors.billing_code}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Shipping Country</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_country")}
                  type="text"
                  className="form-size form-control"
                  name="shipping_country"
                  id="shipping_country"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_country &&
                    formik.errors.shipping_country && (
                      <div className="text-danger ">
                        {formik.errors.shipping_country}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Billing Country</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_country")}
                  type="text"
                  className="form-size form-control"
                  name="billing_country"
                  id="billing_country"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_country &&
                    formik.errors.billing_country && (
                      <div className="text-danger ">
                        {formik.errors.billing_country}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Description Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-start justify-content-center mb-3 sm-device">
                <lable>Description</lable> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description_info")}
                  name="description_info"
                  id="description_info"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default AccountsEdit;
