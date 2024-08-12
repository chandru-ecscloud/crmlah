import React, { useEffect, useState } from "react";
import "../styles/user.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import success from "../assets/success.mp4";
import { RiDoubleQuotesL } from "react-icons/ri";
import { API_URL } from "../../src/Config/URL";
import axios from "axios";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  companyName: yup.string().required("*Company Name is required"),
  businessEmail: yup.string().required("*Bussiness email is required"),
  firstName: yup.string().required("*First Name is required"),
  lastName: yup.string().required("*Last Name is required"),
  phone: yup
    .string()
    .required("*Phone is required")
    .matches(/^[0-9]{8}$|^[0-9]{10}$/, "*Phone Number must be 8 or 10 digits"),
  description_info: yup.string().required("*Enquiry is required"),
});

const EventRegister = () => {
  const { id } = useParams();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJDTVBfT1dORVIiXSwic3ViIjoiTUlUX1NwYWNlIiwiaWF0IjoxNzIzMjkyMzcxLCJleHAiOjE3MjMyOTU5NzF9.PxIofwfurcW2A8RSetFWiWhoK_K-ogS67JFfvVhDcMG_bs2Gq9laGlI3GSYGAc0yBTGr04Jqhqo-IVFY6HPgig";
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      companyName: "",
      businessEmail: "",
      firstName: "",
      lastName: "",
      phone: "",
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload = {
        companyName: data.companyName,
        firstName: data.firstName,
        lastName: data.lastName,
        businessEmail: data.businessEmail,
        phone: data.phone,
        message: data.description_info,
        eventMemberStatus: "NEW",
        eventManagementId: id,
      };
      try {
        const response = await axios.post(
          `${API_URL}createEventMembers`,
          payload,
        );
        if (response.status === 201) {
          // toast.success(response.data.message);
          setShow(true);
          formik.resetForm();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const calculateTimeLeft = () => {
    console.log("backend Date is ", data?.eventDate?.substring(0, 19));
    const targetDate = new Date(data?.eventDate?.substring(0, 19)); // Set your target date and time
    console.log("Target Date", targetDate); // Set your target date and time

    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update the timer every minute

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}getAllEventManagementById/${id}`
        );
        setData(response.data);
      } catch (e) {
        console.log("Error Fetching Data");
      }
    };

    getData();
  }, []);

  return (
    <div className="container-fluid">
      <div style={{ backgroundColor: "#e0f7fa" }} className="p-3">
        <div className="heading-register text-center">
          <span className="register fw-bold fs-1">Registration Link:</span>
          <span className="community">{data.eventName}</span>
        </div>
        
        <div className="d-flex justify-content-center align-items-center my-1">
          <div className="p-3 bg-dark text-white rounded d-flex">
            <div className="text-center me-4">
              <h2 className="m-0 large-number">
                {String(timeLeft.days).padStart(2, "0")}
              </h2>
              <small>Days</small>
            </div>
            <div className="text-center me-4">
              <h2 className="m-0 large-number">
                {String(timeLeft.hours).padStart(2, "0")}
              </h2>
              <small>Hours</small>
            </div>
            <div className="text-center">
              <h2 className="m-0 large-number">
                {String(timeLeft.minutes).padStart(2, "0")}
              </h2>
              <small>Minutes</small>
            </div>
          </div>
        </div>

        <span className="time-in">
          <strong>Date:</strong>
          {"  "}
          &nbsp;{new Date(data?.eventDate?.substring(0, 10)).toDateString()}
        </span>

        <p className=" text-center">
          <strong>Venue:</strong> Peninsula Plaza, Singapore 179098
        </p>
        <div className="text-start">
          <h2 className="fw-bold " style={{ marginLeft: "23px" }}>
            Event Agenda
          </h2>
          <p style={{ marginLeft: "23px", whiteSpace: "pre-wrap" }}>
            {data.eventAgenda || "--"}
          </p>{" "}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <h3 className=" text-start fw-bold">Register Now</h3>
              <div className="col-12 mb-3 text-start">
                <label className="contactFields">
                  Company Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg  ${
                    formik.touched.companyName && formik.errors.companyName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("companyName")}
                  name="companyName"
                  id="companyName"
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <p className="text-danger">{formik.errors.companyName}</p>
                )}
              </div>
              <div className="col-12 mb-3 text-start">
                <label className="contactFields">
                  Bussiness Email Address (Please provide an valid company
                  domain)<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg  ${
                    formik.touched.businessEmail && formik.errors.businessEmail
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("businessEmail")}
                  name="businessEmail"
                  id="businessEmail"
                />
                {formik.touched.businessEmail &&
                  formik.errors.businessEmail && (
                    <p className="text-danger">{formik.errors.businessEmail}</p>
                  )}
              </div>
              <div className="col-12 mb-3 text-start">
                <label className="contactFields">
                  First Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg   ${
                    formik.touched.firstName && formik.errors.firstName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("firstName")}
                  name="firstName"
                  id="firstName"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-danger">{formik.errors.firstName}</p>
                )}
              </div>
              <div className="col-12 mb-3 text-start">
                <label className="contactFields">
                  Last Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg   ${
                    formik.touched.lastName && formik.errors.lastName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("lastName")}
                  name="lastName"
                  id="lastName"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-danger">{formik.errors.lastName}</p>
                )}
              </div>
              <div className="col-12 mb-3 text-start">
                <label className="contactFields">
                  Phone<span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-size form-control form-control-lg  ${
                    formik.touched.phone && formik.errors.phone
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("phone")}
                  id="phone"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-danger">{formik.errors.phone}</p>
                )}
              </div>
              {/* <div className="col-12 mb-3 text-start">
                <label className="contactFields">
                  Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-size form-control form-control-lg  ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                  id="email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger">{formik.errors.email}</p>
                )}
              </div> */}

              <div className="col-12 mb-4 text-start">
                <label className="contactFields">
                  Message<span className="text-danger">*</span>
                </label>
                <textarea
                  {...formik.getFieldProps("description_info")}
                  name="description_info"
                  className="form-control form-control-lg "
                ></textarea>
                {formik.touched.description_info &&
                  formik.errors.description_info && (
                    <p className="text-danger">
                      {formik.errors.description_info}
                    </p>
                  )}
              </div>
              <div className="col-12 mb-3 d-flex justify-content-center ">
                <button type="submit" className="btn donateBtn  ">
                  {loadIndicator && (
                    <span
                      class="spinner-border spinner-border-sm me-2 "
                      aria-hidden="true"
                    ></span>
                  )}
                  Submit
                </button>
              </div>
              <Modal
                show={show}
                onHide={handleClose}
                className="d-flex align-items-center"
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <div className="d-flex justify-content-center">
                    <video src={success} autoPlay loop muted className="w-50" />
                  </div>
                  <div className="text-center">
                    <h3 className="fw-bold">Thank You!</h3>
                  </div>
                  <div className="text-center">
                    <p className="fw-bold">
                      Your registration was successful! Our team will contact
                      you soon.
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="fw-bold">
                      We are excited to see you at {data.eventName}.
                    </p>
                  </div>
                </Modal.Body>
              </Modal>
              {/* <span className="d-flex justify-content-center col-12 ">
                  <button className="btn btn-primary">Submit Form</button>
                </span> */}
            </div>
          </form>
        </div>
        <div className="col-md-6 p-4 d-flex flex-column align-items-center justify-content-center">
          <div className="">
            <div className="quote-container">
              <p className=" text-danger">
                <RiDoubleQuotesL size={50} />
              </p>
              <h1 className="quote-text mb-4">
                Let’s Make it <br />
                Happen Together!
              </h1>
            </div>
            <p className="my-2 text-center">{data.eventDescription || "--"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegister;
