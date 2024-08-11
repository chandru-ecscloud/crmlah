import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";

const validationSchema = yup.object().shape({
  companyName: yup.string().required("*Company Name is Required"),
  eventName: yup.string().required("*Event Name is Required"),
  firstName: yup.string().required("*First Name is Required"),
  lastName: yup.string().required("*Last Name is Required"),
  businessEmail: yup.string().email("Invalid email").required("*Email is required"),
  eventAgenda: yup.string().required("*Agenda is Required"),
  phone: yup.string().required("*Phone is Required"),
  eventStatus: yup.string().required("*Event Status is Required"),
});

function EventEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      companyName: "",
      eventName: "",
      eventDate: "",
      firstName: "",
      lastName: "",
      businessEmail: "",
      phone: "",
      enquiry: "",
      eventAgenda: "",
      eventStatus: "",
      eventLink: "",
      eventDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Event Data:", data);
      data.eventLink = `https://crmlah.com/eventregister/${id}`;
      try {
        const response = await axios.put(`${API_URL}updateEventManagement/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/event");
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
        const response = await axios(`${API_URL}getAllEventManagementById/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        formik.setValues(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    userData();
  }, [id]);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Event</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/event"}>
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
        <div className="container my-5">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.companyName && formik.errors.companyName
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("companyName")}
                  name="companyName"
                  id="companyName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-danger">{formik.errors.companyName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Event Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.eventName && formik.errors.eventName
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("eventName")}
                  name="eventName"
                  id="eventName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.eventName && formik.errors.eventName && (
                    <p className="text-danger">{formik.errors.eventName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>First Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.firstName && formik.errors.firstName
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("firstName")}
                  name="firstName"
                  id="firstName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-danger">{formik.errors.firstName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Last Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.lastName && formik.errors.lastName
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("lastName")}
                  name="lastName"
                  id="lastName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-danger">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Event Date</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control  ${formik.touched.eventDate && formik.errors.eventDate
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("eventDate")}
                  name="eventDate"
                  id="eventDate"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.eventDate && formik.errors.eventDate && (
                    <p className="text-danger">{formik.errors.eventDate}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Bussiness Email</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="email"
                  className={`form-size form-control  ${formik.touched.businessEmail && formik.errors.businessEmail
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("businessEmail")}
                  name="businessEmail"
                  id="businessEmail"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.businessEmail && formik.errors.businessEmail && (
                    <p className="text-danger">{formik.errors.businessEmail}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Phone</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${formik.touched.phone && formik.errors.phone
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("phone")}
                  name="phone"
                  id="phone"
                />
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
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Event Status</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select`}
                  {...formik.getFieldProps("eventStatus")}
                  id="eventStatus"
                >
                  <option selected></option>
                  <option value="INPROCESS">Inprocess</option>
                  <option value="NEW">New</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="RESCHEDULED">Rescheduled</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.eventStatus && formik.errors.eventStatus && (
                    <p className="text-danger">{formik.errors.eventStatus}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <div className="row align-items-center">
                <div className="col-2 text-end">
                  <lable>
                    Event Agenda <span className="text-danger">*</span>
                  </lable>
                </div>
                <div className="col-10">
                  <textarea
                    type="text"
                    className={` form-control  ${formik.touched.eventAgenda && formik.errors.eventAgenda
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("eventAgenda")}
                    name="eventAgenda"
                    id="eventAgenda"
                  />
                  {formik.touched.eventAgenda && formik.errors.eventAgenda && (
                    <p className="text-danger">{formik.errors.eventAgenda}</p>
                  )}
                </div>
              </div>
            </div>
            <div className=" col-12 mb-3">
              <div className="row align-items-center">
                <div className="col-2 text-end">
                  <lable>
                    Enquiry
                  </lable>
                </div>
                <div className="col-10">
                  <textarea
                    type="text"
                    className={` form-control  ${formik.touched.enquiry && formik.errors.enquiry
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("enquiry")}
                    name="enquiry"
                    id="enquiry"
                  />
                  {formik.touched.enquiry && formik.errors.enquiry && (
                    <p className="text-danger">{formik.errors.enquiry}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 mb-3">
              <div className="row align-items-center">
                <div className="col-2 text-end">
                  <lable>Event Description</lable>
                </div>
                <div className="col-10">
                  <textarea
                    type="text"
                    className={` form-control  ${formik.touched.eventDescription &&
                      formik.errors.eventDescription
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("eventDescription")}
                    name="eventDescription"
                    id="eventDescription"
                  />
                  {formik.touched.eventDescription &&
                    formik.errors.eventDescription && (
                      <p className="text-danger">
                        {formik.errors.eventDescription}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default EventEdit;
