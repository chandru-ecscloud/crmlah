import React, { useState } from "react";
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
  first_name: yup.string().required("!Enter First Name"),
  last_name: yup.string().required("!Enter Last Name"),
  company: yup.string().required("!Enter Cpmoany Name"),
  email: yup.string().email().required("!Enter Email"),
  phone: yup
    .string()
    .required("!Enter Phone Number")
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10),
  country_code: yup.string().required("!Enter Country Code Number"), 
  lead_owner: yup.string().required("!Select Lead Owner"),
});



function LeadsCreate() {
  const owner = sessionStorage.getItem('user_name');
  const role = sessionStorage.getItem('role');
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const userId = sessionStorage.getItem("userId");

  const navigate = useNavigate();

  const { register,handleSubmit,formState: { errors },} = useForm({
    resolver: yupResolver(schema),
  });

  const handelCancel = () => {
    navigate("/leads");
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
      const response = await axios.post(`${API_URL}newClient`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/leads");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    console.log("Api Data:",data);
  };

  return (
    <section className="createLead">
      <form onSubmit={handleSubmit(handleApiSubmit)}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Lead</b>
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
                  type="submit"
                >
                  Save
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
          <input type="hidden" {...register("company_id")} value={userId} name="company_id" />

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Lead Owner</lable> &nbsp;&nbsp;
                <select
                  {...register("lead_owner")}
                  type="text"
                  className="form-size form-control"
                  id="lead_owner"
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
                  <p className="text-danger">{errors.lead_owner?.message}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Company</lable> &nbsp;&nbsp;
                <input
                  {...register("company")}
                  type="text"
                  className="form-size form-control"
                  id="company"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  <p className="text-danger">{errors.company?.message}</p>
                </div>
              </div>
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
                <lable>LastName</lable> &nbsp;&nbsp;
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

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Mobile</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="mobile"
                placeholder="--"
              />
            </div>
           
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Fax</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="fax"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Land Line</lable> &nbsp;&nbsp;
              <input
              {...register("landLine")}
                type="text"
                className="form-size form-control"
                id="landLine"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Website</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="Website"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label htmlFor="lead_source">Lead Source</label>&nbsp;&nbsp;
              <select
              {...register("lead_source")}
                id="lead_source"
                className="form-size form-select"
              >
                <option value=""></option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="FaceBook">FaceBook</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label htmlFor="lead_status">Lead Status</label>&nbsp;&nbsp;
              <select
              {...register("lead_status")}
                id="lead_status"
                className="form-size form-select"
              >
                <option value=""></option>
                <option value="Analysed">Analysed</option>
                <option value="Processed">Processed</option>
                <option value="Delivered">Delivered</option>
                <option value="Intermediated">Intermediated</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label>Industry</label>&nbsp;&nbsp;
              <select
                id="industry"
                className="form-size form-select"
              >
                <option value="--">--</option>
                <option value="IT">IT</option>
                <option value="None IT">None IT</option>
              </select>
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>No. of Employees</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="employees"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Annual Revenue</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="annual"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label htmlFor="leadowner">Rating</label>&nbsp;&nbsp;
              <select
                id="rating"
                className="form-size form-select"
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

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Email Opt Out</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                id="email_opt"
                placeholder="--"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Skype ID</lable> &nbsp;&nbsp;
              <input
              {...register("skypeId")}
                type="text"
                className="form-size form-control"
                id="skypeId"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Secondary Email</lable> &nbsp;&nbsp;
              <input
                type="text"
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
                id="twitter"
              />
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
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Street</lable> &nbsp;&nbsp;
              <input
                {...register("street")}
                type="text"
                className="form-size form-control"
                id="street"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>City</lable> &nbsp;&nbsp;
              <input
              {...register("city")}
                type="text"
                className="form-size form-control"
                id="city"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>State</lable> &nbsp;&nbsp;
              <input
              {...register("state")}
                type="text"
                className="form-size form-control"
                id="state"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Zip Code</lable> &nbsp;&nbsp;
              <input
              {...register("zipCode")}
                type="text"
                className="form-size form-control"
                id="zipCode"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Country</lable> &nbsp;&nbsp;
              <input
              {...register("country")}
                type="text"
                className="form-size form-control"
                id="country"
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
                id="description_info"
              />
            </div>
          </div>
        </div>
        </form>
    </section>
  );
}

export default LeadsCreate;
