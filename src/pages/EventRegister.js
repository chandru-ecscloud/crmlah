import React, { useState } from 'react';
import "../styles/user.css";
import { useFormik } from 'formik';
import * as yup from "yup";



const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>Class has started!</span>;
  } else {
    return (
      <div className="countdown">
        <div className="countdown-item">
          <span className="time">{days}</span>
          <span className="label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="time">{hours}</span>
          <span className="label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="time">{minutes}</span>
          <span className="label">Minutes</span>
        </div>
      </div>
    );
  }
};

const validationSchema = yup.object().shape({
    company_name: yup.string().required("*Company Name is required"),
    bussiness_email: yup.string().required("*Bussiness email is required"),
    first_name: yup.string().required("*First Name is required"),
    last_name: yup.string().required("*Last Name is required"),
    phone: yup
      .string()
      .required("*Phone is required")
      .matches(/^[0-9]{10}$/, "*Phone Number must be 10 digits"),
    email: yup.string().required("*Email is required"),
    description_info: yup.string().required("*Enquiry is required"),
  });
  

const EventRegister = () => {
    const [loadIndicator, setLoadIndicator] = useState(false);

    const formik = useFormik({
        initialValues: {
          company_name: "",
          bussiness_email: "",
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          description_info: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (data) => {
          // console.log(data);
        }
      });

  return (
    <div className="container">
      <h1 className="title">
      Registration Link: ISV Community Day Singapore 
      </h1>
      <Countdown date={new Date('2024-08-11T10:30:00')} renderer={renderer} />
      <span className="date">Date: 11th Aug 2024</span>
      <p className="date">Venue: AWS Singapore,23 Church Street, Level 8 Capital Square, Singapore 049481</p>
      <div className="text-start">
      <h2>Event Agenda</h2>
      <ul>
        <li><strong>0900:</strong> Breakfast & Registration</li>
        <li><strong>0930:</strong> Opening Key Note & Welcome Address</li>
        <li><strong>0950:</strong> SaaS Innovations - Trends and Opportunities</li>
        <li><strong>1010:</strong> Hear from Our ISVs - AWS Journeys, Expert Tips & Tricks, and Interactive Q&A</li>
        <li><strong>1030:</strong> Watermelon Software - AI Driven Software Reliability</li>
        <li><strong>1045:</strong> DataStax - Building Agent Apps and GenAI Chat</li>
        <li><strong>1100:</strong> JustPerform - Achieving Streamlined Business Performance Management with an Intelligent Platform</li>
        <li><strong>1115:</strong> CyncLair - Elevating Your Cybersecurity Security Posture with OpenXDR</li>
      </ul>
    </div>
    <div className="col-lg-6 col-md-6 col-12 p-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <h3 className=" text-start">CONTACT</h3>
                <div className="col-12 mb-3 text-start">
                  <label className="contactFields">
                   Company Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.company_name && formik.errors.company_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("company_name")}
                    name="company_name"
                    id="company_name"
                  />
                  {formik.touched.company_name && formik.errors.company_name && (
                    <p className="text-danger">{formik.errors.company_name}</p>
                  )}
                </div>
                <div className="col-12 mb-3 text-start">
                  <label className="contactFields">
                   Bussiness Email Address (Please provide an valid company domain)<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.bussiness_email && formik.errors.bussiness_email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bussiness_email")}
                    name="bussiness_email"
                    id="bussiness_email"
                  />
                  {formik.touched.bussiness_email && formik.errors.bussiness_email && (
                    <p className="text-danger">{formik.errors.bussiness_email}</p>
                  )}
                </div>
                <div className="col-12 mb-3 text-start">
                  <label className="contactFields">
                   First Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.first_name && formik.errors.first_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("first_name")}
                    name="first_name"
                    id="first_name"
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-danger">{formik.errors.first_name}</p>
                  )}
                </div>
                <div className="col-12 mb-3 text-start">
                  <label className="contactFields">
                   Last Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.last_name && formik.errors.last_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("last_name")}
                    name="last_name"
                    id="last_name"
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="text-danger">{formik.errors.last_name}</p>
                  )}
                </div>
                <div className="col-12 mb-3 text-start">
                  <label className="contactFields">
                    Phone<span className="text-danger">*</span>
                  </label>
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
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-danger">{formik.errors.phone}</p>
                  )}
                </div>
                <div className="col-12 mb-3 text-start">
                  <label className="contactFields">
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-size form-control  ${
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
                </div>

                <div className="col-12 mb-4 text-start">
                  <label className="contactFields">
                    Message<span className="text-danger">*</span>
                  </label>
                  <textarea
                    {...formik.getFieldProps("description_info")}
                    name="description_info"
                    className="form-control "
                  ></textarea>
                  {formik.touched.description_info &&
                    formik.errors.description_info && (
                      <p className="text-danger">
                        {formik.errors.description_info}
                      </p>
                    )}
                </div>
                <div className="col-12 mb-3 d-flex justify-content-center ">
                <button
                    type="submit"
                    className="btn donateBtn  "
                  >
                    {loadIndicator && <span
                        class="spinner-border spinner-border-sm me-2 "
                        aria-hidden="true"
                      ></span>}
                    Submit
                  </button>
                </div>
                {/* <span className="d-flex justify-content-center col-12 ">
                  <button className="btn btn-primary">Submit Form</button>
                </span> */}
              </div>
            </form>
          </div>
    </div>
  );
};

export default EventRegister;
