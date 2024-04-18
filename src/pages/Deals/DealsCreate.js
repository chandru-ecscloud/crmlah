import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  amount: yup.string()
  .matches(/^\d+$/, "Must be only digits")
  .required("*Amount is required"),
  email: yup
    .string()
    .email("*Enter valid email")
    .required("*Email is required"),
  deal_name: yup.string().required("*Deal name is required"),
  contact_name: yup.string().required("*Contact name is required"),
  account_name: yup.string().required("*Account name is required"),
  closing_date: yup.string().required("*Closing date is required"),
  stage: yup.string().required("*stage is required"),
  probability: yup.string()
  .matches(/^\d+$/, "Must be only digits")
  .required("*Probability is required"),
  campaign_source: yup.string().required("*Campaign source is required"),
  lead_source: yup.string().required("*Lead source is required"),
  shipping_street: yup.string().required("*Shipping street is required"),
  shipping_city: yup.string().required("*Shipping city is required"),
  billing_state: yup.string().required("*Billing state is required"),
  billing_city: yup.string().required("*Billing city is required"),
  billing_street: yup.string().required("*Billing street is required"),
  shipping_state: yup.string().required("*Shipping state is required"),
  shipping_code: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")

    .required("*Shipping code is required"),
  billing_code: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")

    .required("*Billing code is required"),
  shipping_country: yup.string().required("*Shipping country is required"),
  billing_country: yup.string().required("*Billing country is required"),
});

function DealsCreate() {
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [accountOption, setAccountOption] = useState([]);
  const [dealOption, setDealOption] = useState([]);
  const [contactOption, setContactOption] = useState([]);
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      deal_owner: owner,
      company_id: companyId,
      amount: "",
      email: "",
      deal_name: "",
      contact_name: "",
      account_name: "",
      closing_date: "",
      stage: "",
      probability: "",
      campaign_source: "",
      lead_source: "",
      shipping_street: "",
      shipping_city: "",
      shipping_state: "",
      shipping_country: "",
      shipping_code: "",
      billing_state: "",
      billing_city: "",
      billing_street: "",
      billing_code: "",
      billing_country: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Deals Datas:", data);
      try {
        const response = await axios.post(`${API_URL}newDeal`, data, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/deals");
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

  const DealList = async () => {
    try {
      const response = await axios(`${API_URL}dealNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setDealOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ContactList = async () => {
    try {
      const response = await axios(`${API_URL}contactNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setContactOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    AccountList();
    DealList();
    ContactList();
  }, []);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Deal</b>
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
                {/* {/ Input for image upload /} */}
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
              <Link to={"/deals"}>
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
            <b>Deal Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Deal Owner</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  name="deal_owner"
                  className=" form-select form-size"
                  {...formik.getFieldProps("deal_owner")}
                  id="deal_owner"
                >
                  <option selected value={owner}>
                    {owner}
                  </option>
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

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>amount</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.amount && formik.errors.amount
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("amount")}
                  name="amount"
                  id="amount"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="text-danger">{formik.errors.amount}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
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
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Deal Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  className="form-size form-select"
                  {...formik.getFieldProps("deal_name")}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(dealOption) &&
                    dealOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.deal_name && formik.errors.deal_name && (
                    <p className="text-danger">{formik.errors.deal_name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Contact Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  className="form-size form-select"
                  {...formik.getFieldProps("contact_name")}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(contactOption) &&
                    contactOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.contact_name &&
                    formik.errors.contact_name && (
                      <p className="text-danger">
                        {formik.errors.contact_name}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  className="form-size form-select"
                  {...formik.getFieldProps("account_name")}
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
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.account_name &&
                    formik.errors.account_name && (
                      <p className="text-danger">
                        {formik.errors.account_name}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Closing Date</lable> &nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control  ${
                    formik.touched.closing_date && formik.errors.closing_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("closing_date")}
                  name="closing_date"
                  id="closing_date"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.closing_date &&
                    formik.errors.closing_date && (
                      <p className="text-danger">
                        {formik.errors.closing_date}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Account</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="account"
                id="account"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Pipeline</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="pipeline"
                id="pipeline"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Type</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="type"
                id="type"
                placeholder="--"
              />
            </div> */}

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>stage</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.stage && formik.errors.stage
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("stage")}
                  id="stage"
                >
                  <option selected></option>
                  <option value="Processing">Processing</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.stage && formik.errors.stage && (
                    <p className="text-danger">{formik.errors.stage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Next Step</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="next_step"
                id="next_step"
                placeholder="--"
              />
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>probability(%)</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.probability && formik.errors.probability
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("probability")}
                  name="probability"
                  id="probability"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.probability && formik.errors.probability && (
                    <p className="text-danger">{formik.errors.probability}</p>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Career Source</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="career_source"
                id="career_source"
                placeholder="--"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Expected Revenue</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="expected_revenue"
                id="expected_revenue"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Lead Name</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="lead_name"
                id="lead_name"
                placeholder="--"
              />
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Campaign Source</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.campaign_source &&
                    formik.errors.campaign_source
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("campaign_source")}
                  name="campaign_source"
                  id="campaign_source"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.campaign_source &&
                    formik.errors.campaign_source && (
                      <p className="text-danger">
                        {formik.errors.campaign_source}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Lead Source</lable> &nbsp;&nbsp;
                <select
                  className={`form-size form-select  ${
                    formik.touched.lead_source && formik.errors.lead_source
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("lead_source")}
                  id="lead_source"
                  name="lead_source"
                >
                  <option selected></option>
                  <option value="Instagram">Instagram</option>
                  <option value="Whatsapp">Whatsapp</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Website">Website</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.lead_source && formik.errors.lead_source && (
                    <p className="text-danger">{formik.errors.lead_source}</p>
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
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.shipping_street &&
                    formik.errors.shipping_street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_street")}
                  name="shipping_street"
                  id="shipping_street"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_street &&
                    formik.errors.shipping_street && (
                      <p className="text-danger">
                        {formik.errors.shipping_street}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.billing_street &&
                    formik.errors.billing_street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_street")}
                  name="billing_street"
                  id="billing_street"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_street &&
                    formik.errors.billing_street && (
                      <p className="text-danger">
                        {formik.errors.billing_street}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.shipping_city && formik.errors.shipping_city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_city")}
                  name="shipping_city"
                  id="shipping_city"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_city &&
                    formik.errors.shipping_city && (
                      <p className="text-danger">
                        {formik.errors.shipping_city}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.billing_city && formik.errors.billing_city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_city")}
                  name="billing_city"
                  id="billing_city"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_city &&
                    formik.errors.billing_city && (
                      <p className="text-danger">
                        {formik.errors.billing_city}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.shipping_state &&
                    formik.errors.shipping_state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_state")}
                  name="shipping_state"
                  id="shipping_state"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_state &&
                    formik.errors.shipping_state && (
                      <p className="text-danger">
                        {formik.errors.shipping_state}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.billing_state && formik.errors.billing_state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_state")}
                  name="billing_state"
                  id="billing_state"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_state &&
                    formik.errors.billing_state && (
                      <p className="text-danger">
                        {formik.errors.billing_state}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.shipping_code && formik.errors.shipping_code
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_code")}
                  name="shipping_code"
                  id="shipping_code"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_code &&
                    formik.errors.shipping_code && (
                      <p className="text-danger">
                        {formik.errors.shipping_code}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.billing_code && formik.errors.billing_code
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_code")}
                  name="billing_code"
                  id="billing_code"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_code &&
                    formik.errors.billing_code && (
                      <p className="text-danger">
                        {formik.errors.billing_code}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.shipping_country &&
                    formik.errors.shipping_country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_country")}
                  name="shipping_country"
                  id="shipping_country"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_country &&
                    formik.errors.shipping_country && (
                      <p className="text-danger">
                        {formik.errors.shipping_country}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.billing_country &&
                    formik.errors.billing_country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_country")}
                  name="billing_country"
                  id="billing_country"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_country &&
                    formik.errors.billing_country && (
                      <p className="text-danger">
                        {formik.errors.billing_country}
                      </p>
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
            <div className="col-12 mb-3 ">
              <div className="d-flex align-items-start justify-content-center sm-device">
                <lable>Description</lable> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  // {...formik.getFieldProps("description_info")}
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

export default DealsCreate;
