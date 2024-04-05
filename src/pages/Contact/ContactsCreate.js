import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css"; 

const schema = yup.object().shape({
  first_name: yup.string().required("!Enter FirstName"),
  last_name: yup.string().required("!Enter LastName"),
  email: yup.string().email().required("!Enter Email"),
  country_code: yup.string().required("!Enter Country Code Number"), 
  phone: yup
    .string()
    .required("!Enter Phone Number")
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10),
  contact_owner: yup.string().required("!Select Contact Owner"),
});

function ContactsLead() {
  const owner = sessionStorage.getItem('user_name');
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem('role');
  const userId = sessionStorage.getItem("userId");
  const [accountOption, setAccountOption] = useState([]);
  console.log(accountOption);

  const [userImage, setUserImage] = useState(User); 

  const navigate = useNavigate();

  const { register,handleSubmit,formState: { errors },} = useForm({
    resolver: yupResolver(schema),
  });

  const handelCancel = () => {
    navigate("/contacts");
  };

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

  const handleApiSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}newContact`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/contacts");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    console.log("Api Contact Data:",data);
  };

  useEffect(() => {
    AccountList();
  }, []);

  return (
    <section className="createContacts">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Create Contacts</b>
              <br></br>
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
            </h4>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
            <span>
              <button className="btn btn-danger" onClick={handelCancel}>
                Cancel
              </button>
            </span>
            &nbsp;
            <span>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSubmit((data => {
                  handleApiSubmit(data)
                }))}
              >
                Save
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
        <input type="hidden" {...register("company_id")} value={userId} name="company_id" />

          <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Contact Owner</lable> &nbsp;&nbsp;
                <select
                  {...register("contact_owner")}
                  type="text"
                  className="form-size form-select"
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

              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  <p className="text-danger">{errors.contact_owner?.message}</p>
                </div>
              </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Lead Source</lable> &nbsp;&nbsp;
            <input
            {...register("lead_source")}
              type="text"
              className="form-size form-control"
              name="lead_source"
              id="lead_source"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>FirstName</lable> &nbsp;&nbsp;
                <input
                  {...register("first_name")}
                  type="text"
                  className="form-size form-control"
                  id="first_name"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-5">
                  <p className="text-danger">{errors.first_name?.message}</p>
                </div>
              </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Last Name</lable> &nbsp;&nbsp;
                <input
                  {...register("last_name")}
                  type="text"
                  className="form-size form-control"
                  id="last_name"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-5 align-items-start">
                  <p className="text-danger">{errors.last_name?.message}</p>
                </div>
              </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Email</lable> &nbsp;&nbsp;
                <input
                  {...register("email")}
                  type="text"
                  className="form-size form-control"
                  id="email"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-5">
                  <p className="text-danger">{errors.email?.message}</p>
                </div>
              </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
            <lable>Phone</lable> &nbsp;&nbsp;
              <div className="input-group" style={{ width: "60%" }}>
                <div>
                  <select
                    className="form-size form-select"
                    {...register("country_code")}
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
                 {...register("phone")}
                  type="tel"
                  name="phone"
                  id="phone"
                  className="form-control"
                  aria-label="Text input with checkbox"
                />
              </div>
            </div>

            <div className="row">
                <div className="col-5"></div>
                <div className="col-5">
                  <p className="text-danger">{errors.phone?.message}</p>
                </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Title</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="title"
              id="title"
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Account Name</lable> &nbsp;&nbsp;
            {/* <input
            {...register("account_name")}
              type="text"
              className="form-size form-control"
              name="account_name"
              id="account_name"
            /> */}
            <select style={{ width: '60%' }} {...register("account_name")} className="form-select">
                <option value="" selected disabled></option>
                {Array.isArray(accountOption) &&
                  accountOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
          </div>
          
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Vendor Name</lable> &nbsp;&nbsp;
            <input
            {...register("vendor_name")}
              type="text"
              className="form-size form-control"
              name="vendor_name"
              id="vendor_name"
            />
          </div>
    
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Department</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="department"
              id="department"
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
              placeholder="--"
              
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label>Land Line</label>&nbsp;&nbsp;
            <input
            {...register("land_line")}
              type="tel"
              className="form-size form-control"
              name="land_line"
              id="land_line"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Fax</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="fax"
              id="fax"
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
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Email Opt Out</lable> &nbsp;&nbsp;
            <input
              class="form-size form-control"
              type="email"
              id="email_opt"
              name="email_opt"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Skype ID</lable> &nbsp;&nbsp;
            <input
             {...register("skype_id")}
              type="text"
              className="form-size form-control"
              name="skype_id"
              id="skype_id"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Secondary Email</lable> &nbsp;&nbsp;
            <input
              type="email"
              className="form-size form-control"
              name="secondary_email"
              id="secondary_email"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Twitter</lable> &nbsp;&nbsp;
            <input
            {...register("twitter")}
              type="text"
              className="form-size form-control"
              name="twitter"
              id="twitter"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Reporting To</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="reporting_to"
              id="reporting_to"
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
            <button className="copyAddress btn btn-primary" style={{backgroundColor: "#d8d8d8"}}>Copy Address</button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Mailing Street</lable> &nbsp;&nbsp;
            <input
             {...register("mailing_street")}
              type="text"
              className="form-size form-control"
              name="mailing_street"
              id="mailing_street"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Other Street</lable> &nbsp;&nbsp;
            <input
            {...register("other_street")}
              type="text"
              className="form-size form-control"
              name="other_street"
              id="other_street"
              
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Mailing City</lable> &nbsp;&nbsp;
            <input
            {...register("mailing_city")}
              type="text"
              className="form-size form-control"
              name="mailing_city"
              id="mailing_city"
              
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Other City</lable> &nbsp;&nbsp;
            <input
            {...register("other_city")}
              type="text"
              className="form-size form-control"
              name="other_city"
              id="other_city"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Mailing State</lable> &nbsp;&nbsp;
            <input
            {...register("mailing_state")}
              type="text"
              className="form-size form-control"
              name="mailing_state"
              id="mailing_state"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Other State</lable> &nbsp;&nbsp;
            <input
            {...register("other_state")}
              type="text"
              className="form-size form-control"
              name="other_state"
              id="other_state"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Mailing Zip</lable> &nbsp;&nbsp;
            <input
            {...register("mailing_zip")}
              type="text"
              className="form-size form-control"
              name="mailing_zip"
              id="mailing_zip"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Other Zip</lable> &nbsp;&nbsp;
            <input
            {...register("other_zip")}
              type="text"
              className="form-size form-control"
              name="other_zip"
              id="other_zip"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Mailing Country</lable> &nbsp;&nbsp;
            <input
            {...register("mailing_country")}
              type="text"
              className="form-size form-control"
              name="mailing_country"
              id="mailing_country"
              
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Other Country</lable> &nbsp;&nbsp;
            <input
             {...register("other_country")}
              type="text"
              className="form-size form-control"
              name="other_country"
              id="other_country"
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
            {...register("description_info")}
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="description_info"
              id="description_info"
              
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactsLead;
