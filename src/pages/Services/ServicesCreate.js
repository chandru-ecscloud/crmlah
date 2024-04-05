import React, { useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";

function ServicesCreate() {
  const [formData, setFormData] = useState({
    service_name: "",
    duration: "",
    price: "",
    location: "",
    service_owner: "",
    members: "",
    available_day: "",
    available_time: "",
    tax: "",
    description_info: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handelCancel = () => {
    navigate("/services");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}newService`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        toast.success("Service Created Successfully.");
        navigate("/services");
      } else {
        toast.error("Service Created Unsuccessful.");
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="createLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Create Service</b>
              <br></br>
              <img
                src={User}
                className="img-fluid"
                style={{ width: "70px", height: "70px" }}
                alt="user"
              />
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
                onClick={handleSubmit}
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Service Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label htmlFor="service_owner">Service Owner</label>&nbsp;&nbsp;
            <select
              id="service_owner"
              className="form-size form-select"
              name="service_owner"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="Suriya">Suriya</option>
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
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Service Name</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="service_name"
              id="service_name"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Duration</lable> &nbsp;&nbsp;
            <select
              id="duration"
              className="form-size form-select"
              name="duration"
              onChange={handleChange}
            >
              <option value="None">None</option>
              <option value="2 Hours">2 Hours</option>
              <option value="4 Hours">4 Hours</option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Location</lable> &nbsp;&nbsp;
            <select
              id="location"
              className="form-size form-select"
              name="location"
              onChange={handleChange}
            >
              <option value="Business Address">Business Address</option>
              <option value="Client Address">Client Address</option>
              <option value="Business Address and Client Address">Business Address and Client Address</option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Member(s)</lable> &nbsp;&nbsp;
            <input
              type="tel"
              className="form-size form-control"
              name="members"
              id="members"
              onChange={handleChange}
            />
          </div>
          
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Availability Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
        <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Available Day(s)</lable> &nbsp;&nbsp;
            <select
              id="available_days"
              className="form-size form-select"
              name="available_days"
              onChange={handleChange}
            >
              <option value="Every Business Days">Every Business Days</option>
              <option value="Specific Date Range">Specific Date Range</option>
              <option value="Specific Date(s)">Specific Date(s)</option>
              <option value="Specific Day(s)">Specific Day(s)</option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Available Time</lable> &nbsp;&nbsp;
            <select
              id="available_time"
              className="form-size form-select"
              name="available_time"
              onChange={handleChange}
            >
              <option value="Same as Business Time">Same as Business Time</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </select>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Price Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
        <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Price</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="price"
              id="price"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Tax</lable> &nbsp;&nbsp;
            <select
              id="tax"
              className="form-size form-select"
              name="tax"
              onChange={handleChange}
            >
              <option value="None">None</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </select>
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesCreate;
