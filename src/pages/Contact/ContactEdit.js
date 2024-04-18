import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  lead_source: yup.string().required("*Lead Source is required"),
  first_name: yup.string().required("*First Name is required"),
  last_name: yup.string().required("*Last Name is required"),
  email: yup.string().required("*Email is required"),
  phone: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10)
    .required("*Phone Number is required"),
  account_name: yup.string().required("*Account Name is required"),
  vendor_name: yup.string().required("*Vendor Name is required"),
  land_line: yup.string().matches(/^\d+$/, "Must be only digits")
  .required("*Land Line is required"),
  skype_id: yup.string().required("*Skype ID is required"),
  twitter: yup.string().required("*Twitter is required"),

  mailing_street: yup.string().required("*Mailing Street is required"),
  other_street: yup.string().required("*Other Street is required"),
  mailing_city: yup.string().required("*Mailing City is required"),
  other_city: yup.string().required("*Other City is required"),
  mailing_state: yup.string().required("*Mailing State is required"),
  other_state: yup.string().required("*Other State is required"),
  mailing_zip: yup.string().required("*Mailing Zip is required"),
  other_zip: yup.string().required("*Other Zip is required"),
  mailing_country: yup.string().required("*Mailing Country is required"),
  other_country: yup.string().required("*Other Country is required"),

  description_info: yup.string().required("*Description is required"),
});

function ContactEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [account_name, setaccount_name] = useState([]);
  console.log(account_name);

  const [userImage, setUserImage] = useState(User);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      contact_owner: "",
      company_id: companyId,
      lead_source: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      account_name: "",
      vendor_name: "",
      land_line: "",
      skype_id: "",
      twitter: "",
      mailing_street: "",
      other_street: "",
      mailing_city: "",
      other_city: "",
      mailing_state: "",
      other_state: "",
      mailing_zip: "",
      other_zip: "",
      mailing_country: "",
      other_country: "",
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Api Contact Data:", data);
      try {
        const response = await axios.put(
          `${API_URL}updateContact/${id}`,
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
          navigate("/contacts");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allContacts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        const payload = {
          contact_owner: getData.contactOwner,
          company_id: companyId,
          lead_source: getData.leadSource,
          first_name: getData.firstName,
          last_name: getData.lastName,
          email: getData.email,
          country_code: getData.countryCode,
          phone: getData.phone,
          account_name: getData.accountName,
          vendor_name: getData.vendorName,
          land_line: getData.landLine,
          skype_id: getData.skypeId,
          twitter: getData.twitter,
          mailing_street: getData.mailingStreet,
          other_street: getData.otherStreet,
          mailing_city: getData.mailingCity,
          other_city: getData.otherCity,
          mailing_state: getData.mailingState,
          other_state: getData.otherState,
          mailing_zip: getData.mailingZip,
          other_zip: getData.otherZip,
          mailing_country: getData.mailingCountry,
          other_country: getData.otherCountry,
          description_info: getData.descriptionInfo,
        };
        // console.log("Converted Data", payload)
        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  useEffect(() => {
    const AccountList = async () => {
      try {
        const response = await axios(`${API_URL}accountNamesList`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        setaccount_name(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    AccountList();
  }, []);

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
    <section className="createContacts">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Update Contacts</b>
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
              <Link to={"/contacts"}>
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
            <b>Contact Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Contact Owner</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className="form-size form-select"
                  {...formik.getFieldProps("contact_owner")}
                  id="contact_owner"
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
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Lead Source</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.lead_source && formik.errors.lead_source
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("lead_source")}
                  name="lead_source"
                  id="lead_source"
                />
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
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Firs Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.first_name && formik.errors.first_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("first_name")}
                  id="first_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-danger">{formik.errors.first_name}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Last Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.last_name && formik.errors.last_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("last_name")}
                  id="last_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="text-danger">{formik.errors.last_name}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Email</lable> &nbsp;&nbsp;
                <input
                  type="text"
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
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Title</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="title"
                id="title"
                placeholder="--"
              />
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  className={`form-size form-select  ${
                    formik.touched.account_name && formik.errors.account_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("account_name")}
                >
                  <option value="" disabled></option>
                  <option value="1">1</option>
                  {Array.isArray(account_name) &&
                    account_name.map((option) => (
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
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Vendor Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.vendor_name && formik.errors.vendor_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("vendor_name")}
                  name="vendor_name"
                  id="vendor_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.vendor_name && formik.errors.vendor_name && (
                    <p className="text-danger">{formik.errors.vendor_name}</p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Department</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="department"
                id="department"
                placeholder="--"
              />
            </div> */}
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <label htmlFor="other_phone">Other phone</label>&nbsp;&nbsp;
              <input
                type="tel"
                className="form-size form-control"
                name="other_phone"
                id="other_phone"
                placeholder="--"
              />
            </div> */}
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <label htmlFor="home_phone">Home Phone</label>&nbsp;&nbsp;
              <input
                type="tel"
                className="form-size form-control"
                name="home_phone"
                id="home_phone"
                placeholder="--"
              />
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Land Line</label>&nbsp;&nbsp;
                <input
                  type="tel"
                  className={`form-size form-control  ${
                    formik.touched.land_line && formik.errors.land_line
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("land_line")}
                  name="land_line"
                  id="land_line"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-5">
                  {formik.touched.land_line && formik.errors.land_line && (
                    <p className="text-danger">{formik.errors.land_line}</p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Fax</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="fax"
                id="fax"
                placeholder="--"
              />
            </div> */}
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Assistant</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="assistant"
                id="assistant"
                placeholder="--"
              />
            </div> */}
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <label htmlFor="dob">Date of Birth</label>&nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="dob"
                id="dob"
                placeholder="--"
              />
            </div> */}
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Asst Phone</lable> &nbsp;&nbsp;
              <input
                type="tel"
                className="form-size form-control"
                name="asst_phone"
                id="asst_phone"
                placeholder="--"
              />
            </div> */}
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Email Opt Out</lable> &nbsp;&nbsp;
              <input
                class="form-size form-control"
                type="email"
                id="email_opt"
                name="email_opt"
                placeholder="--"
              />
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Skype ID</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.skype_id && formik.errors.skype_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("skype_id")}
                  name="skype_id"
                  id="skype_id"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.skype_id && formik.errors.skype_id && (
                    <p className="text-danger">{formik.errors.skype_id}</p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Secondary Email</lable> &nbsp;&nbsp;
              <input
                type="email"
                className="form-size form-control"
                name="secondary_email"
                id="secondary_email"
                placeholder="--"
              />
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Twitter</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.twitter && formik.errors.twitter
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("twitter")}
                  name="twitter"
                  id="twitter"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.twitter && formik.errors.twitter && (
                    <p className="text-danger">{formik.errors.twitter}</p>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device mb-3">
              <lable>Reporting To</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="reporting_to"
                id="reporting_to"
                placeholder="--"
              />
            </div> */}
          </div>
        </div>
        <div className="container-fluid my-5">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Address Information</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end  sm-device">
              <Link to={"#"}>
                <button type="button" className="btn btn-light">
                  Copy Address
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row sm-device">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Mailing Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.mailing_street &&
                    formik.errors.mailing_street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mailing_street")}
                  name="mailing_street"
                  id="mailing_street"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.mailing_street &&
                    formik.errors.mailing_street && (
                      <p className="text-danger">
                        {formik.errors.mailing_street}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Other Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.other_street && formik.errors.other_street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("other_street")}
                  name="other_street"
                  id="other_street"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.other_street &&
                    formik.errors.other_street && (
                      <p className="text-danger">
                        {formik.errors.other_street}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Mailing City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.mailing_city && formik.errors.mailing_city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mailing_city")}
                  name="mailing_city"
                  id="mailing_city"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.mailing_city &&
                    formik.errors.mailing_city && (
                      <p className="text-danger">
                        {formik.errors.mailing_city}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Other City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.other_city && formik.errors.other_city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("other_city")}
                  name="other_city"
                  id="other_city"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.other_city && formik.errors.other_city && (
                    <p className="text-danger">{formik.errors.other_city}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Mailing State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.mailing_state && formik.errors.mailing_state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mailing_state")}
                  name="mailing_state"
                  id="mailing_state"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.mailing_state &&
                    formik.errors.mailing_state && (
                      <p className="text-danger">
                        {formik.errors.mailing_state}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Other State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.other_state && formik.errors.other_state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("other_state")}
                  name="other_state"
                  id="other_state"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.other_state && formik.errors.other_state && (
                    <p className="text-danger">{formik.errors.other_state}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Mailing Zip</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.mailing_zip && formik.errors.mailing_zip
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mailing_zip")}
                  name="mailing_zip"
                  id="mailing_zip"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.mailing_zip && formik.errors.mailing_zip && (
                    <p className="text-danger">{formik.errors.mailing_zip}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Other Zip</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.other_zip && formik.errors.other_zip
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("other_zip")}
                  name="other_zip"
                  id="other_zip"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.other_zip && formik.errors.other_zip && (
                    <p className="text-danger">{formik.errors.other_zip}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Mailing Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.mailing_country &&
                    formik.errors.mailing_country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mailing_country")}
                  name="mailing_country"
                  id="mailing_country"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.mailing_country &&
                    formik.errors.mailing_country && (
                      <p className="text-danger">
                        {formik.errors.mailing_country}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Other Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.other_country && formik.errors.other_country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("other_country")}
                  name="other_country"
                  id="other_country"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.other_country &&
                    formik.errors.other_country && (
                      <p className="text-danger">
                        {formik.errors.other_country}
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

export default ContactEdit;
