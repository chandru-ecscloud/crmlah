import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css"; 

// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";

// const schema = yup.object().shape({
//   firstName: yup.string().required("!Enter FirstName"),
//   lastName: yup.string().required("!Enter LastName"),
//   email: yup.string().email().required("!Enter Email"),
//   phone: yup
//     .string()
//     .required("!Enter Phone Number")
//     .matches(/^\d+$/, "Must be only digits")
//     .min(8)
//     .max(10),
//   contactOwner: yup.string().required("!Select Contact Owner"),
// });

function CreateEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem('user_name');
  const token = sessionStorage.getItem("token");
  const [data, setdata] = useState({});
  const role = sessionStorage.getItem('role');
  const [userImage, setUserImage] = useState(User);
  const [accountOption, setAccountOption] = useState([]);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact_owner: "",
    account_name: "",
    email: "",
    country_code:"",
    phone: "",
    lead_source: "",
    vendor_name: "",
    land_line: "",
    skype_id: "",
    twitter: "",
    mailing_street: "",
    mailing_city: "",
    mailing_state: "",
    mailing_zip: "",
    mailing_country: "",
    other_street: "",
    other_city: "",
    other_state: "",
    other_zip: "",
    other_country: "",
    description_info: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handelCancel = () => {
    navigate("/contacts");
  };

  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  //   setValue,
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  const AccountList = async () => {
    try {
      const response = await axios(`${API_URL}accountNamesList`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        const response = await axios(`${API_URL}allContacts/${id}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const keyMapping = {
          firstName: "first_name",
          lastName: "last_name",
          contactOwner: "contact_owner",
          leadSource: "lead_source",
          accountName: "account_name",
          vendorName: "vendor_name",
          email: "email",
          countryCode:"country_code",
          phone: "phone",
          landLine: "land_line",
          skypeId: "skype_id",
          twitter: "twitter",
          mailingStreet: "mailing_street",
          mailingCity: "mailing_city",
          mailingState: "mailing_state",
          mailingZip: "mailing_zip",
          mailingCountry: "mailing_country",
          otherStreet: "other_street",
          otherCity: "other_city",
          otherState: "other_state",
          otherZip: "other_zip",
          otherCountry: "other_country",
          descriptionInfo: "description_info",
          createdAt: "created_at",
          createdBy: "created_by",
          updatedAt: "updated_at",
          updatedBy: "updated_by",
        };

        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            const newKey = keyMapping[key] || key;
            acc[newKey] = response.data[key];
            return acc;
          },
          {}
        );
        setFormData(transformedData);

        // setdata(response.data);
        // // Set form values using setValue
        // setValue("contactOwner", response.data.contactOwner);
        // setValue("firstName", response.data.firstName);
        // setValue("lastName", response.data.lastName);
        // setValue("leadSource", response.data.leadSource);
        // setValue("phone", response.data.phone);
        // setValue("email", response.data.email);
        // setValue("skypeId", response.data.skypeId);
        // setValue("twitter", response.data.twitter);
        // setValue("street", response.data.street);
        // setValue("city", response.data.city);
        // setValue("zipCode", response.data.zipCode);
        // setValue("country", response.data.country);
        // setValue("descriptionInfo", response.data.descriptionInfo);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
    AccountList();
  }, [id]);

  const updateContact = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateContact/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/contacts");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="editLead">
      <form >
          <div className="container-fluid">
            <div className="row mt-3">
              <div className="col-lg-6 col-md-6 col-12">
                <h4>
                  <b>Edit Contact</b>
                </h4>
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
                <button className="btn btn-danger" onClick={handelCancel}>
                  Cancel
                </button>
                &nbsp;
                <button className="btn btn-primary" type="button"
                onClick={updateContact}>
                  Save
                </button>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-2">
                <img
                    src={userImage}
                    className="img-fluid mt-3"
                    style={{ width: "70px", height: "70px", cursor: "pointer", borderRadius: '50%' }}
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
                    <FaCamera className="cameraIcon"/>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="container-fluid my-5">
            <h4>
              <b>Contact Information</b>
            </h4>
          </div>

          <div className="container">
            <div className="row">

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <label htmlFor="contact_owner">Contact Owner</label>&nbsp;&nbsp;
                <select
                  id="contact_owner"
                  className="form-size form-select"
                  name="contact_owner"
                 
                >
                  <option value={owner} selected={formData.contact_owner === owner}>
                    {owner}
                  </option>
                  <option
                    value="Suriya"
                    selected={formData.contact_owner === "Suriya"}
                  >
                    Suriya
                  </option>
                  <option
                    value="Vignesh Devan"
                    selected={formData.contact_owner === "Vignesh Devan"}
                  >
                    Vignesh Devan
                  </option>
                  <option
                    value="Chandru R"
                    selected={formData.contact_owner === "Chandru R"}
                  >
                    Chandru R
                  </option>
                  <option
                    value="Gayathri M"
                    selected={formData.contact_owner === "Gayathri M"}
                  >
                    Gayathri M
                  </option>
                  <option
                    value="Poongodi K"
                    selected={formData.contact_owner === "Poongodi K"}
                  >
                    Poongodi K
                  </option>
                  <option
                    value="Suriya G"
                    selected={formData.contact_owner === "Suriya G"}
                  >
                    Suriya G
                  </option>
                  <option
                    value="Leela Prasanna D"
                    selected={formData.contact_owner === "Leela Prasanna D"}
                  >
                    Leela Prasanna D
                  </option>
                  <option
                    value="Saravanan M"
                    selected={formData.contact_owner === "Saravanan M"}
                  >
                    Saravanan M
                  </option>
                  <option
                    value="Nagaraj VR"
                    selected={formData.contact_owner === "Nagaraj VR"}
                  >
                    Nagaraj VR
                  </option>
                  <option
                    value="Yalini A"
                    selected={formData.contact_owner === "Yalini A"}
                  >
                    Yalini A
                  </option>
                  <option
                    value="Vishnu Priya"
                    selected={formData.contact_owner === "Vishnu Priya"}
                  >
                    Vishnu Priya
                  </option>
                  <option
                    value="Kavitha"
                    selected={formData.contact_owner === "Kavitha"}
                  >
                    Kavitha
                  </option>
                </select>
              </div>

              {/* <div className="col-lg-6 col-md-6 col-12">
                <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Contact Owner</lable> &nbsp;&nbsp;
                <select
                  {...register("contactOwner")}
                  type="text"
                  className="form-size form-select"
                >
                  <option value={owner} selected={data.contact_owner === owner}>
                    {owner}
                  </option>
                  <option
                    value="Suriya"
                    selected={data.contact_owner === "Suriya"}
                  >
                    Suriya
                  </option>
                  <option
                    value="Vignesh Devan"
                    selected={data.contact_owner === "Vignesh Devan"}
                  >
                    Vignesh Devan
                  </option>
                  <option
                    value="Chandru R"
                    selected={data.contact_owner === "Chandru R"}
                  >
                    Chandru R
                  </option>
                  <option
                    value="Gayathri M"
                    selected={data.contact_owner === "Gayathri M"}
                  >
                    Gayathri M
                  </option>
                  <option
                    value="Poongodi K"
                    selected={data.contact_owner === "Poongodi K"}
                  >
                    Poongodi K
                  </option>
                  <option
                    value="Suriya G"
                    selected={data.contact_owner === "Suriya G"}
                  >
                    Suriya G
                  </option>
                  <option
                    value="Leela Prasanna D"
                    selected={data.contact_owner === "Leela Prasanna D"}
                  >
                    Leela Prasanna D
                  </option>
                  <option
                    value="Saravanan M"
                    selected={data.contact_owner === "Saravanan M"}
                  >
                    Saravanan M
                  </option>
                  <option
                    value="Nagaraj VR"
                    selected={data.contact_owner === "Nagaraj VR"}
                  >
                    Nagaraj VR
                  </option>
                  <option
                    value="Yalini A"
                    selected={data.contact_owner === "Yalini A"}
                  >
                    Yalini A
                  </option>
                  <option
                    value="Vishnu Priya"
                    selected={data.contact_owner === "Vishnu Priya"}
                  >
                    Vishnu Priya
                  </option>
                  <option
                    value="Kavitha"
                    selected={data.contact_owner === "Kavitha"}
                  >
                    Kavitha
                  </option>
                </select>
              </div>

              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  <p className="text-danger">{errors.contactOwner?.message}</p>
                </div>
              </div>
              </div> */}

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Lead Source</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="lead_source"
                  id="lead_source"
                  value={formData.lead_source || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>First Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="first_name"
                  id="first_name"
                  onChange={handleChange}
                  value={formData.first_name || ""}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Last Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="last_name"
                  id="last_name"
                  onChange={handleChange}
                  value={formData.last_name || ""}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select style={{ width: '60%' }} className="form-select" onChange={handleChange} name="account_name" id="account_name">
                    <option value=""></option>
                    {Array.isArray(accountOption) &&
                      accountOption.map((option) => (
                        <option key={option} value={option}  selected={formData.account_name === option}>
                          {option}
                        </option>
                      ))}
                  </select>
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Vendor Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="vendor_name"
                  id="vendor_name"
                  onChange={handleChange}
                  value={formData.vendor_name || ""}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Email</lable> &nbsp;&nbsp;
                <input
                  type="email"
                  className="form-size form-control"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={formData.email || ""}
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Phone</lable> &nbsp;&nbsp;
                  <div className="input-group" style={{ width: "60%" }}>
                    <div>
                      <select
                        className="form-size form-select"
                        name="country_code"
                        value={formData.country_code || ""}
                        onChange={handleChange}
                        style={{
                          width: "80px",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
                        }}
                      >
                        <option value="+65" selected={formData.country_code === "+65"}>+65</option>
                        <option value="+91" selected={formData.country_code === "+91"}>+91</option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      aria-label="Text input with checkbox"
                      onChange={handleChange}
                      value={formData.phone || ""}
                    />
                  </div>
            </div>

            {/* <div className="row">
                <div className="col-5"></div>
                <div className="col-5">
                  <p className="text-danger">{errors.phone?.message}</p>
                </div>
            </div> */}
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Title</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="title"
                  id="title"
                  onChange={handleChange}
                  value={formData.title || ""}
                  placeholder="--"
                />
              </div>

              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Department</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="department"
                  id="department"
                  onChange={handleChange}
                  value={formData.department || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <label htmlFor="other_phone">Other phone</label>&nbsp;&nbsp;
                <input
                  type="tel"
                  className="form-size form-control"
                  name="other_phone"
                  id="other_phone"
                  onChange={handleChange}
                  value={formData.other_phone || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <label htmlFor="home_phone">Home Phone</label>&nbsp;&nbsp;
                <input
                  type="tel"
                  className="form-size form-control"
                  name="home_phone"
                  id="home_phone"
                  onChange={handleChange}
                  value={formData.home_phone || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <label htmlFor="mobile">Mobile</label>&nbsp;&nbsp;
                <input
                  type="tel"
                  className="form-size form-control"
                  name="mobile"
                  id="mobile"
                  onChange={handleChange}
                  value={formData.mobile || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Fax</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="fax"
                  id="fax"
                  onChange={handleChange}
                  value={formData.fax || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Assistant</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="assistant"
                  id="assistant"
                  onChange={handleChange}
                  value={formData.assistant || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <label htmlFor="dob">Date of Birth</label>&nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="dob"
                  id="dob"
                  onChange={handleChange}
                  value={formData.dob || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Asst Phone</lable> &nbsp;&nbsp;
                <input
                  type="tel"
                  className="form-size form-control"
                  name="asst_phone"
                  id="asst_phone"
                  onChange={handleChange}
                  value={formData.asst_phone || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Email Opt Out</lable> &nbsp;&nbsp;
                <input
                  class="form-size form-control"
                  type="email"
                  name="email_opt"
                  id="email_opt"
                  onChange={handleChange}
                  value={formData.email_opt || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Skype ID</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="skype_id"
                  id="skype_id"
                  onChange={handleChange}
                  value={formData.skype_id || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Secondary Email</lable> &nbsp;&nbsp;
                <input
                  type="email"
                  className="form-size form-control"
                  name="secondary_email"
                  id="secondary_email"
                  onChange={handleChange}
                  value={formData.secondary_email || ""}
                  placeholder="--"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Twitter</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="twitter"
                  id="twitter"
                  onChange={handleChange}
                  value={formData.twitter || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Reporting To</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="reporting_to"
                  id="reporting_to"
                  onChange={handleChange}
                  value={formData.reporting_to || ""}
                  placeholder="--"
                />
              </div>
            </div>
          </div>

          <div className="container-fluid my-5">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12">
                <h4>
                  <b>Address Information</b>
                </h4>
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end">
                <button
                  className="copyAddress btn btn-primary"
                  style={{ backgroundColor: "#d8d8d8" }}
                >
                  Copy Address
                </button>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Mailing Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="mailing_street"
                  id="mailing_street"
                  onChange={handleChange}
                  value={formData.mailing_street || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Other Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="other_street"
                  id="other_street"
                  onChange={handleChange}
                  value={formData.other_street || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Mailing City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="mailing_city"
                  id="mailing_city"
                  onChange={handleChange}
                  value={formData.mailing_city || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Other City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="other_city"
                  id="other_city"
                  onChange={handleChange}
                  value={formData.other_city || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Mailing State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="mailing_state"
                  id="mailing_state"
                  onChange={handleChange}
                  value={formData.mailing_state || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Other State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="other_state"
                  id="other_state"
                  onChange={handleChange}
                  value={formData.other_state || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Mailing Zip</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="mailing_zip"
                  id="mailing_zip"
                  onChange={handleChange}
                  value={formData.mailing_zip || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Other Zip</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="other_zip"
                  id="other_zip"
                  onChange={handleChange}
                  value={formData.other_zip || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Mailing Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="mailing_country"
                  id="mailing_country"
                  onChange={handleChange}
                  value={formData.mailing_country || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                <lable>Other Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="other_country"
                  id="other_country"
                  onChange={handleChange}
                  value={formData.other_country || ""}
                />
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
              <div className="col-8 d-flex align-items-center justify-content-end mb-3">
                <lable>Description</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  style={{ width: "70%" }}
                  className="form-control"
                  name="description_info"
                  id="description_info"
                  onChange={handleChange}
                  value={formData.description_info || ""}
                />
              </div>
            </div>
          </div>
      </form>
    </section>
  );
}

export default CreateEdit;
