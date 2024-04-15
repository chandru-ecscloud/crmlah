import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

const validationSchema = yup.object().shape({
  company: yup.string().required("*Company is required"),
  first_name: yup.string().required("*First Name is required"),
  last_name: yup.string().required("*Last Name is required"),
  phone: yup
    .string()
    .required("*Phone is required")
    .matches(/^[0-9]{10}$/, "*Phone Number must be 10 digits"),
  email: yup.string().required("*Email is required"),
  landLine: yup.string().required("*Land Line is required"),
  lead_source: yup.string().required("*Lead Source is required"),
  lead_status: yup.string().required("*Lead Status is required"),
  skypeId: yup.string().required("*Skype ID is required"),
  twitter: yup.string().required("*Twitter is required"),

  street: yup.string().required("*Street is required"),
  city: yup.string().required("*City is required"),
  state: yup.string().required("*State is required"),
  zipCode: yup.string().required("*Zipcode is required"),
  country: yup.string().required("*Country is required"),
});

function LeadsEdit() {
  const { id } = useParams();
  const companyId = sessionStorage.getItem("companyId");
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      lead_owner: "",
      company_id: companyId,
      company: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      landLine: "",
      lead_source: "",
      lead_status: "",
      skypeId: "",
      twitter: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log(newData);
      try {
        const response = await axios.put(`${API_URL}updateClient/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/leads");
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
        const response = await axios(`${API_URL}allClients/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        const payload = {
          lead_owner: getData.lead_owner,
          company: getData.company,
          first_name: getData.first_name,
          last_name: getData.last_name,
          phone: getData.phone,
          email: getData.email,
          landLine: getData.land_line,
          lead_source: getData.lead_source,
          lead_status: getData.lead_status,
          skypeId: getData.skype_id,
          twitter: getData.twitter,
          street: getData.street,
          city: getData.city,
          state: getData.state,
          zipCode: getData.zipCode,
          country: getData.country,
          description_info: getData.description_info,
        };
        // console.log("Converted Data", payload)
        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

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
                <b>Update Lead</b>
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
                {/* Input for image upload  */}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                {/* <FaCamera className="cameraIcon" /> */}
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/leads"}>
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
            <b>Lead Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Lead Owner</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className="form-size form-select"
                  {...formik.getFieldProps("lead_owner")}
                  id="lead_owner"
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

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Company</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.company && formik.errors.company
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("company")}
                  name="company"
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

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>First Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.first_name && formik.errors.first_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("first_name")}
                  name="first_name"
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

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Phone</lable> &nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      className={`form-size form-control  ${
                        formik.touched.phone && formik.errors.phone
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
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

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Mobile</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="mobile"
                placeholder="--"
              />
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Fax</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="fax"
                placeholder="--"
              />
            </div> */}

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Land Line</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.landLine && formik.errors.landLine
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("landLine")}
                  name="landLine"
                  id="landLine"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.landLine && formik.errors.landLine && (
                    <p className="text-danger">{formik.errors.landLine}</p>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Website</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="Website"
                placeholder="--"
              />
            </div> */}

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Lead Source</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.lead_source && formik.errors.lead_source
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("lead_source")}
                  id="lead_source"
                >
                  <option value=""></option>
                  <option value="Whatsapp">Whatsapp</option>
                  <option value="FaceBook">FaceBook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
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
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Lead Status</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.lead_status && formik.errors.lead_status
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("lead_status")}
                  id="lead_status"
                >
                  <option value=""></option>
                  <option value="Analysed">Analysed</option>
                  <option value="Processed">Processed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Intermediated">Intermediated</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.lead_status && formik.errors.lead_status && (
                    <p className="text-danger">{formik.errors.lead_status}</p>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <label>Industry</label>&nbsp;&nbsp;
              <select
                type="text"
                className="form-size form-select"
                {...formik.getFieldProps("industry")}
                id="industry"
              >
                <option value="--">--</option>
                <option value="IT">IT</option>
                <option value="None IT">None IT</option>
              </select>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>No. of Employees</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="employees"
                placeholder="--"
              />
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Annual Revenue</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="annual"
                placeholder="--"
              />
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <label htmlFor="lead_owner">Rating</label>&nbsp;&nbsp;
              <select id="rating" className="form-size form-select">
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
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Email Opt Out</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="email_opt"
                placeholder="--"
              />
            </div> */}

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Skype ID</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.skypeId && formik.errors.skypeId
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("skypeId")}
                  name="skypeId"
                  id="skypeId"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.skypeId && formik.errors.skypeId && (
                    <p className="text-danger">{formik.errors.skypeId}</p>
                  )}
                </div>
              </div>
            </div>
{/* 
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3 sm-device">
              <lable>Secondary Email</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="secondary_email"
                id="secondary_email"
                placeholder="--"
              />
            </div> */}

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
                <lable>Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.street && formik.errors.street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("street")}
                  name="street"
                  id="street"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.street && formik.errors.street && (
                    <p className="text-danger">{formik.errors.street}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
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

export default LeadsEdit;
