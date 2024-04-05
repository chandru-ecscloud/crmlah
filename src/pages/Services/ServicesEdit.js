import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

function ServicesEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    service_name: "",
    duration: "",
    price: "",
    location: "",
    service_owner: "",
    members: "",
    available_days: "",
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
    navigate(`/services`);
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allService/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  const updateClient = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateService/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Service Updated Successfully.");
        navigate("/services");
      } else {
        toast.error("Service Updated Unsuccessful.");
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="editLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Edit Service</b>
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
                onClick={updateClient}
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
              <option
                value="Suriya"
                selected={formData.service_owner === "Suriya"}
              >
                Suriya
              </option>
              <option
                value="Vignesh Devan"
                selected={formData.service_owner === "Vignesh Devan"}
              >
                Vignesh Devan
              </option>
              <option
                value="Chandru R"
                selected={formData.service_owner === "Chandru R"}
              >
                Chandru R
              </option>
              <option
                value="Gayathri M"
                selected={formData.service_owner === "Gayathri M"}
              >
                Gayathri M
              </option>
              <option
                value="Poongodi K"
                selected={formData.service_owner === "Poongodi K"}
              >
                Poongodi K
              </option>
              <option
                value="Suriya G"
                selected={formData.service_owner === "Suriya G"}
              >
                Suriya G
              </option>
              <option
                value="Leela Prasanna D"
                selected={formData.service_owner === "Leela Prasanna D"}
              >
                Leela Prasanna D
              </option>
              <option
                value="Saravanan M"
                selected={formData.service_owner === "Saravanan M"}
              >
                Saravanan M
              </option>
              <option
                value="Nagaraj VR"
                selected={formData.service_owner === "Nagaraj VR"}
              >
                Nagaraj VR
              </option>
              <option
                value="Yalini A"
                selected={formData.service_owner === "Yalini A"}
              >
                Yalini A
              </option>
              <option
                value="Vishnu Priya"
                selected={formData.service_owner === "Vishnu Priya"}
              >
                Vishnu Priya
              </option>
              <option
                value="Kavitha"
                selected={formData.service_owner === "Kavitha"}
              >
                Kavitha
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Service Name</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="service_name"
              id="service_name"
              value={formData.service_name || ""}
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
              <option value="None" selected={formData.duration === "None"}>
                None
              </option>
              <option
                value="2 Hours"
                selected={formData.duration === "2 Hours"}
              >
                2 Hours
              </option>
              <option
                value="4 Hours"
                selected={formData.duration === "4 Hours"}
              >
                4 Hours
              </option>
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
              <option
                value="Business Address"
                selected={formData.location === "Business Address"}
              >
                Business Address
              </option>
              <option
                value="Client Address"
                selected={formData.location === "Client Address"}
              >
                Client Address
              </option>
              <option
                value="Business Address and Client Address"
                selected={
                  formData.location === "Business Address and Client Address"
                }
              >
                Business Address and Client Address
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Member(s)</lable> &nbsp;&nbsp;
            <input
              type="tel"
              className="form-size form-control"
              name="members"
              id="members"
              value={formData.members || ""}
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
              <option
                value="Every Business Days"
                selected={formData.available_days === "Every Business Days"}
              >
                Every Business Days
              </option>
              <option
                value="Specific Date Range"
                selected={formData.available_days === "Specific Date Range"}
              >
                Specific Date Range
              </option>
              <option
                value="Specific Date(s)"
                selected={formData.available_days === "Specific Date(s)"}
              >
                Specific Date(s)
              </option>
              <option
                value="Specific Day(s)"
                selected={formData.available_days === "Specific Day(s)"}
              >
                Specific Day(s)
              </option>
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
              <option
                value="Same as Business Time"
                selected={formData.available_time === "Same as Business Time"}
              >
                Same as Business Time
              </option>
              <option
                value="Option 1"
                selected={formData.available_time === "Option 1"}
              >
                Option 1
              </option>
              <option
                value="Option 2"
                selected={formData.available_time === "Option 2"}
              >
                Option 2
              </option>
              <option
                value="Option 3"
                selected={formData.available_time === "Option 3"}
              >
                Option 3
              </option>
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
              value={formData.price || ""}
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
              <option value="None" selected={formData.tax === "None"}>
                None
              </option>
              <option
                value="Option 1"
                selected={formData.tax === "Option 1"}
              >
                Option 1
              </option>
              <option
                value="Option 2"
                selected={formData.tax === "Option 2"}
              >
                Option 2
              </option>
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
              value={formData.description_info || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesEdit;
