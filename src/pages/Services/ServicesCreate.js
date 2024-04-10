import React, { useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
 service_name: yup.string().required("*Service name is required"),
 service_owner: yup.string().required("*Service owner is required"),
 duration: yup.string().required("*Duration is required"),
 location: yup.string().required("*Location is required"),
 members: yup.string().required("*Members is required"),
 available_days: yup.string().required("*Available days is required"),
 available_time: yup.string().required("*Available time is required"),
 price: yup.string().required("*Price is required"),
 tax: yup.string().required("*Tax is required"),
});

function ServicesCreate() {
  const userId = sessionStorage.getItem("userId");

  const formik = useFormik({
    initialValues: {
      service_owner: "",
      company_id: userId,
      service_name: "",
      duration: "",
      location: "",
      members: "",
      available_days: "",
      available_time: "",
      price: "",
      tax: "",
      description_info: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Service Datas:", data);
    }});
  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handelCancel = () => {
    navigate("/services");
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}newService`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response.status === 201) {
  //       toast.success("Service Created Successfully.");
  //       navigate("/services");
  //     } else {
  //       toast.error("Service Created Unsuccessful.");
  //     }
  //   } catch (error) {
  //     toast.error("Failed: " + error.message);
  //   }
  // };

  return (
    <section className="createLead">
       <form onSubmit={formik.handleSubmit}>
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
          <b>Service Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
        <input
              type="hidden"
              {...formik.getFieldProps("companyId")}
              value={userId}
              name="companyId"
            />
        <div className="col-lg-6 col-md-6 col-12">
        <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <label htmlFor="service_owner">Service Owner</label>&nbsp;&nbsp;
            <select
              id="service_owner"
              className=" form-select form-size"
              {...formik.getFieldProps("service_owner")}
              name="service_owner"
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
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.service_owner && formik.errors.service_owner && (
                    <p className="text-danger">{formik.errors.service_owner}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Service Name</lable> &nbsp;&nbsp;
            <input
              type="text"
              className=" form-control form-size"
              {...formik.getFieldProps("service_name")}
              name="service_name"
              id="service_name"
            />
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.service_name && formik.errors.service_name && (
                    <p className="text-danger">{formik.errors.service_name}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Duration</lable> &nbsp;&nbsp;
            <select
              id="duration"
              className=" form-select form-size"
              {...formik.getFieldProps("duration")}
              name="duration"
            >
              <option value=""></option>
              <option value="2 Hours">2 Hours</option>
              <option value="4 Hours">4 Hours</option>
            </select>
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.duration && formik.errors.duration && (
                    <p className="text-danger">{formik.errors.duration}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Location</lable> &nbsp;&nbsp;
            <select
              id="location"
              className=" form-select form-size"
              {...formik.getFieldProps("location")}
              name="location"
            >
              <option value=""></option>
              <option value="Business Address">Business Address</option>
              <option value="Client Address">Client Address</option>
              <option value="Business Address and Client Address">Business Address and Client Address</option>
            </select>
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.location && formik.errors.location && (
                    <p className="text-danger">{formik.errors.location}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Member(s)</lable> &nbsp;&nbsp;
            <input
              type="tel"
              className=" form-control form-size"
              {...formik.getFieldProps("members")}
              name="members"
              id="members"
            />
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.members && formik.errors.members && (
                    <p className="text-danger">{formik.errors.members}</p>
                  )}
                </div>
              </div>
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
        <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Available Day(s)</lable> &nbsp;&nbsp;
            <select
              id="available_days"
              className=" form-select form-size"
              {...formik.getFieldProps("available_days")}
              name="available_days"
            >
              <option value=""></option>
              <option value="Every Business Days">Every Business Days</option>
              <option value="Specific Date Range">Specific Date Range</option>
              <option value="Specific Date(s)">Specific Date(s)</option>
              <option value="Specific Day(s)">Specific Day(s)</option>
            </select>
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.available_days && formik.errors.available_days && (
                    <p className="text-danger">{formik.errors.available_days}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Available Time</lable> &nbsp;&nbsp;
            <select
              id="available_time"
              className=" form-select form-size"
              {...formik.getFieldProps("available_time")}
              name="available_time"
            >
              <option value=""></option>
              <option value="Same as Business Time">Same as Business Time</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </select>
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.available_time && formik.errors.available_time && (
                    <p className="text-danger">{formik.errors.available_time}</p>
                  )}
                </div>
              </div>
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
        <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Price</lable> &nbsp;&nbsp;
            <input
              type="text"
              className=" form-control form-size"
              {...formik.getFieldProps("price")}
              name="price"
              id="price"
            />
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-danger">{formik.errors.price}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3 sm-device">
            <lable>Tax</lable> &nbsp;&nbsp;
            <select
              id="tax"
              className=" form-select form-size"
              {...formik.getFieldProps("tax")}
              name="tax"
            >
              <option value=""></option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </select>
          </div>
          <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.tax && formik.errors.tax && (
                    <p className="text-danger">{formik.errors.tax}</p>
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
          <div className="col-8 d-flex align-items-center justify-content-end mb-3">
            <lable>Description</lable> &nbsp;&nbsp;
            <input
              type="text"
              style={{ width: "70%" }}
              className=" form-control form-size"
              {...formik.getFieldProps("description_info")}
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

export default ServicesCreate;
