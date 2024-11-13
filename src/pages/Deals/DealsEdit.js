import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";
import UseScrollToError from "../UseScrollToError";

const validationSchema = yup.object().shape({
  // amount: yup.string()
  //   .matches(/^\d+$/, "Must be only digits")
  //   .required("*Amount is required"),
  email: yup
    .string()
    .email("*Enter valid email")
    .required("*Email is required"),
  deal_name: yup.string().required("*Deal name is required"),
  // contact_name: yup.string().required("*Contact name is required"),
  // account_name: yup.string().required("*Account name is required"),
  stage: yup.string().required("*Stage is required"),
  country_code: yup.string().required("*Country Code is required"),
  company: yup.string().required('Company Name is required'),
  phone: yup.string()
    .required('Phone number is required')
    .test('phone-length', function (value) {
      const { country_code } = this.parent;
      if (country_code === '65') {
        return value && value.length === 8 ? true : this.createError({ message: 'Phone number must be 8 digits only' });
      }
      if (country_code === '91') {
        return value && value.length === 10 ? true : this.createError({ message: 'Phone number must be 10 digits only' });
      }
      return true; // Default validation for other country codes
    }),
});

function DealsEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [accountOption, setAccountOption] = useState([]);
  const [dealOption, setDealOption] = useState([]);
  const [contactOption, setContactOption] = useState([]);
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      deal_owner: "",
      company_id: companyId,
      amount: "",
      email: "",
      company: "",
      deal_name: "",
      contact_name: "",
      account_name: "",
      closing_date: "",
      stage: "",
      probability: "",
      country_code: "",
      phone: "",
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
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Deals Datas:", data);
      try {
        const response = await axios.put(`${API_URL}updateDeal/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
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

  const handleSameAsShippingChange = () => {
    setSameAsShipping(!sameAsShipping);
    if (!sameAsShipping) {
      formik.setValues({
        ...formik.values,
        billing_street: formik.values.shipping_street,
        billing_city: formik.values.shipping_city,
        billing_state: formik.values.shipping_state,
        billing_code: formik.values.shipping_code,
        billing_country: formik.values.shipping_country,
      });
    }
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allDeals/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        console.log(getData);

        const payload = {
          deal_owner: getData.dealOwner,
          company_id: companyId,
          amount: getData.amount,
          email: getData.email,
          deal_name: getData.dealName,
          contact_name: getData.contactName,
          account_name: getData.accountName,
          closing_date: getData?.closingDate.slice(0,10),
          stage: getData.stage,
          company: getData.companyName,
          country_code: getData.countryCode || "65",
          phone: getData.phone,
          probability: getData.probability,
          campaign_source: getData.campaignSource,
          lead_source: getData.leadSource,
          shipping_street: getData.shippingStreet,
          shipping_city: getData.shippingCity,
          shipping_state: getData.shippingState,
          shipping_country: getData.shippingCountry,
          shipping_code: getData.shippingCode,
          billing_state: getData.billingState,
          billing_city: getData.billingCity,
          billing_street: getData.billingStreet,
          billing_code: getData.billingCode,
          billing_country: getData.billingCountry,
          description_info: getData.descriptionInfo,
        };

        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
    AccountList();
    DealList();
    ContactList();
  }, [id]);
  UseScrollToError(formik)

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Update Deal</b>
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
                  Update
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
                <lable>Deal Owner</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="deal_owner"
                  className=" form-control form-size"
                  {...formik.getFieldProps("deal_owner")}
                  id="deal_owner"
                  value={owner}
                  readOnly
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.company && formik.errors.company
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("company")}
                  id="company"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.company && formik.errors.company && (
                    <p className="text-danger">{formik.errors.company}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Amount</lable>
                {/* <span className="text-danger">*</span>&nbsp;&nbsp; */}
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.amount && formik.errors.amount
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
                <lable>Phone</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      {...formik.getFieldProps("country_code")}
                      id="country_code"
                      name="country_code"
                      className={`form-size form-control  ${formik.touched.country_code && formik.errors.country_code
                        ? "is-invalid"
                        : ""
                        }`}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <option value="65" selected>+65</option>
                      <option value="91">+91</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-size form-control  ${formik.touched.phone && formik.errors.phone
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
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Email</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="email"
                  className={`form-size form-control  ${formik.touched.email && formik.errors.email
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
                <lable>Deal Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                {/* <select
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
                </select> */}
                <input
                  type="text"
                  id="deal_name"
                  name="deal_name"
                  className={`form-size form-control  ${formik.touched.deal_name && formik.errors.deal_name
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("deal_name")}
                />
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

            {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Contact Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  className={`form-size form-select  ${
                    formik.touched.contact_name && formik.errors.contact_name
                      ? "is-invalid"
                      : ""
                  }`}
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
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12  mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Account Name</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  className={`form-size form-select  ${
                    formik.touched.account_name && formik.errors.account_name
                      ? "is-invalid"
                      : ""
                  }`}
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
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Closing Date</lable> &nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("closing_date")}
                  name="closing_date"
                  id="closing_date"
                />
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
                <lable>Stage</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select`}
                  {...formik.getFieldProps("stage")}
                  id="stage"
                >
                  <option selected></option>
                  <option value="Processing">Processing</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Approved">Approved</option>
                </select>
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
                  className={`form-size form-control`}
                  {...formik.getFieldProps("probability")}
                  name="probability"
                  id="probability"
                />
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
                  className={`form-size form-control`}
                  {...formik.getFieldProps("campaign_source")}
                  name="campaign_source"
                  id="campaign_source"
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Lead Source</lable> &nbsp;&nbsp;
                <select
                  className={`form-size form-select`}
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
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>
        <div className="col-lg-12 col-md-12 col-12 mb-3">
          <div className="d-flex justify-content-center align-items-center mb-4 gap-2" style={{ marginLeft: "54rem" }}>
            <label htmlFor="sameAsShipping"> Same as Shipping Address</label>
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={handleSameAsShippingChange}
              className="form-check-input"
            />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("shipping_street")}
                  name="shipping_street"
                  id="shipping_street"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("billing_street")}
                  name="billing_street"
                  id="billing_street"
                  value={
                    sameAsShipping
                      ? formik.values.shipping_street
                      : formik.values.billing_street
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={sameAsShipping}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("shipping_city")}
                  name="shipping_city"
                  id="shipping_city"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("billing_city")}
                  name="billing_city"
                  id="billing_city"
                  value={
                    sameAsShipping
                      ? formik.values.shipping_city
                      : formik.values.billing_city
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={sameAsShipping}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("shipping_state")}
                  name="shipping_state"
                  id="shipping_state"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("billing_state")}
                  name="billing_state"
                  id="billing_state"
                  value={
                    sameAsShipping
                      ? formik.values.shipping_state
                      : formik.values.billing_state
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={sameAsShipping}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("shipping_code")}
                  name="shipping_code"
                  id="shipping_code"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control `}
                  {...formik.getFieldProps("billing_code")}
                  name="billing_code"
                  id="billing_code"
                  value={
                    sameAsShipping
                      ? formik.values.shipping_code
                      : formik.values.billing_code
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={sameAsShipping}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("shipping_country")}
                  name="shipping_country"
                  id="shipping_country"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("billing_country")}
                  name="billing_country"
                  id="billing_country"
                  value={
                    sameAsShipping
                      ? formik.values.shipping_country
                      : formik.values.billing_country
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={sameAsShipping}
                />
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

export default DealsEdit;
