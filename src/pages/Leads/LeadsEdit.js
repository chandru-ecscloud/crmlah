import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import LogIn from "../../components/common/LogIn";

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
  lead_owner: yup.string().required("!Select Lead Owner"),
});

function LeadsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setdata] = useState({});
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [userImage, setUserImage] = useState(User);

  const handelCancel = () => {
    navigate(`/leads`);
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allClients/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setdata(response.data);
        // Set form values using setValue
        setValue("lead_owner", response.data.lead_owner);
        setValue("company", response.data.company);
        setValue("first_name", response.data.first_name);
        setValue("last_name", response.data.last_name);
        setValue("country_code", response.data.countryCode);
        setValue("phone", response.data.phone);
        setValue("email", response.data.email);
        setValue("lead_source", response.data.lead_source);
        setValue("lead_status", response.data.lead_status);
        setValue("land_line", response.data.land_line);
        setValue("skype_id", response.data.skype_id);
        setValue("twitter", response.data.twitter);
        setValue("street", response.data.street);
        setValue("city", response.data.city);
        setValue("zipCode", response.data.zipCode);
        setValue("country", response.data.country);
        setValue("description_info", response.data.description_info);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id, setValue]);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await axios.put(
        `${API_URL}updateClient/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/leads");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="editLead">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Lead</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <button className="btn btn-danger" onClick={handelCancel}>
                Cancel
              </button>
              &nbsp;
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-2">
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
              {/* Input for image upload */}
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <FaCamera className="cameraIcon" />
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
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Lead Owner</lable> &nbsp;&nbsp;
                <select
                  {...register("lead_owner")}
                  type="text"
                  className="form-size form-select"
                  id="lead_owner"
                >
                  <option value={owner} selected={data.lead_owner === owner}>
                    {owner}
                  </option>
                  <option
                    value="Vignesh Devan"
                    selected={data.lead_owner === "Vignesh Devan"}
                  >
                    Vignesh Devan
                  </option>
                  <option
                    value="Chandru R"
                    selected={data.lead_owner === "Chandru R"}
                  >
                    Chandru R
                  </option>
                  <option
                    value="Gayathri M"
                    selected={data.lead_owner === "Gayathri M"}
                  >
                    Gayathri M
                  </option>
                  <option
                    value="Poongodi K"
                    selected={data.lead_owner === "Poongodi K"}
                  >
                    Poongodi K
                  </option>
                  <option
                    value="Suriya G"
                    selected={data.lead_owner === "Suriya G"}
                  >
                    Suriya G
                  </option>
                  <option
                    value="Leela Prasanna D"
                    selected={data.lead_owner === "Leela Prasanna D"}
                  >
                    Leela Prasanna D
                  </option>
                  <option
                    value="Saravanan M"
                    selected={data.lead_owner === "Saravanan M"}
                  >
                    Saravanan M
                  </option>
                  <option
                    value="Nagaraj VR"
                    selected={data.lead_owner === "Nagaraj VR"}
                  >
                    Nagaraj VR
                  </option>
                  <option
                    value="Yalini A"
                    selected={data.lead_owner === "Yalini A"}
                  >
                    Yalini A
                  </option>
                  <option
                    value="Vishnu Priya"
                    selected={data.lead_owner === "Vishnu Priya"}
                  >
                    Vishnu Priya
                  </option>
                  <option
                    value="Kavitha"
                    selected={data.lead_owner === "Kavitha"}
                  >
                    Kavitha
                  </option>
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
                <lable>company</lable> &nbsp;&nbsp;
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
                <lable>First Name</lable> &nbsp;&nbsp;
                <input
                  {...register("first_name")}
                  type="text"
                  className="form-size form-control"
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
                      <option value="+65" selected={data.countryCode === "+65"}>
                        +65
                      </option>
                      <option value="+91" selected={data.countryCode === "+91"}>
                        +91
                      </option>
                    </select>
                  </div>

                  <input
                    {...register("phone")}
                    type="tel"
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
                <label>Email</label> &nbsp;&nbsp;
                <input
                  {...register("email")}
                  type="text"
                  className="form-size form-control"
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
                name="mobile"
                id="mobile"
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
                placeholder="--"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Land Line</lable> &nbsp;&nbsp;
              <input
                {...register("land_line")}
                type="text"
                className="form-size form-control"
                id="land_line"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Website</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="Website"
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
                name="lead_source"
              >
                <option value=""></option>
                <option
                  value="Whatsapp"
                  selected={data.lead_source === "Whatsapp"}
                >
                  Whatsapp
                </option>
                <option
                  value="FaceBook"
                  selected={data.lead_source === "FaceBook"}
                >
                  FaceBook
                </option>
                <option
                  value="Twitter"
                  selected={data.lead_source === "Twitter"}
                >
                  Twitter
                </option>
                <option
                  value="Instagram"
                  selected={data.lead_source === "Instagram"}
                >
                  Instagram
                </option>
              </select>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label htmlFor="lead_status">Lead Status</label>&nbsp;&nbsp;
              <select
                {...register("lead_status")}
                id="lead_status"
                className="form-size form-select"
                name="lead_status"
              >
                <option value=""></option>
                <option
                  value="Analysed"
                  selected={data.lead_status === "Analysed"}
                >
                  Analysed
                </option>
                <option
                  value="Processed"
                  selected={data.lead_status === "Processed"}
                >
                  Processed
                </option>
                <option
                  value="Delivered"
                  selected={data.lead_status === "Delivered"}
                >
                  Delivered
                </option>
                <option
                  value="Intermediated"
                  selected={data.lead_status === "Intermediated"}
                >
                  Intermediated
                </option>
                <option
                  value="Terminated"
                  selected={data.lead_status === "Terminated"}
                >
                  Terminated
                </option>
              </select>
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label htmlFor="industry">Industry</label>&nbsp;&nbsp;
              <select
                id="industry"
                className="form-size form-select"
                name="industry"
              >
                <option value="--">--</option>
                <option value="option1" selected={data.industry === "option1"}>
                  Option 1
                </option>
                <option value="option2" selected={data.industry === "option2"}>
                  Option 2
                </option>
                <option value="option3" selected={data.industry === "option3"}>
                  Option 3
                </option>
              </select>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>No. of Employees</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="employees"
                id="employees"
                placeholder="--"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Annual Revenue</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="annual"
                id="annual"
                placeholder="--"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <label htmlFor="leadowner">Rating</label>&nbsp;&nbsp;
              <select
                id="rating"
                className="form-size form-select"
                name="rating"
              >
                <option value="">--</option>
                <option value="1" selected={data.rating === "1"}>
                  1
                </option>
                <option value="2" selected={data.rating === "2"}>
                  2
                </option>
                <option value="3" selected={data.rating === "3"}>
                  3
                </option>
                <option value="4" selected={data.rating === "4"}>
                  4
                </option>
                <option value="5" selected={data.rating === "5"}>
                  5
                </option>
                <option value="6" selected={data.rating === "6"}>
                  6
                </option>
                <option value="7" selected={data.rating === "7"}>
                  7
                </option>
                <option value="8" selected={data.rating === "8"}>
                  8
                </option>
                <option value="9" selected={data.rating === "9"}>
                  9
                </option>
                <option value="10" selected={data.rating === "10"}>
                  10
                </option>
              </select>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Email Opt Out</lable> &nbsp;&nbsp;
              <input
                type="text"
                className="form-size form-control"
                name="email_opt"
                id="email_opt"
                placeholder="--"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Skype Id</lable> &nbsp;&nbsp;
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
                name="twitter"
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
                name="street"
                id="street"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>City</lable> &nbsp;&nbsp;
              <input
                {...register("city")}
                type="text"
                className="form-size form-control"
                name="city"
                id="city"
              />
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Zip Code</lable> &nbsp;&nbsp;
              <input
                {...register("zipCode")}
                type="text"
                className="form-size form-control"
                name="zipCode"
                id="zipCode"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
              <lable>Country</lable> &nbsp;&nbsp;
              <input
                {...register("country")}
                type="text"
                className="form-size form-control"
                name="country"
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
                name="description_info"
                id="description_info"
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default LeadsEdit;
