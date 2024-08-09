import React, { useEffect, useState } from 'react';
import "../styles/user.css";
import { useFormik } from 'formik';
import * as yup from "yup";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import success from "../assets/success.mp4";




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
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          setShow(true);
        }
      });

      const calculateTimeLeft = () => {
        const targetDate = new Date('2024-08-12T00:00:00'); // Set your target date and time
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
      }, []);
    
    

  return (
    <div className="container-fluid">
      <div style={{ backgroundColor: '#e0f7fa' }} className="p-3">
     <div className="heading-register text-center">
     <span className="register fw-bold fs-1">Registration Link:</span>

            <span className="community">ISV Community Day Singapore</span>
        </div>
        <div className="d-flex justify-content-center align-items-center my-1">
  <div className="p-3 bg-dark text-white rounded d-flex">
    <div className="text-center me-4">
      <h2 className="m-0 large-number">{String(timeLeft.days).padStart(2, '0')}</h2>
      <small>Days</small>
    </div>
    <div className="text-center me-4">
      <h2 className="m-0 large-number">{String(timeLeft.hours).padStart(2, '0')}</h2>
      <small>Hours</small>
    </div>
    <div className="text-center">
      <h2 className="m-0 large-number">{String(timeLeft.minutes).padStart(2, '0')}</h2>
      <small>Minutes</small>
    </div>
  </div>
</div>


      <span className="time-in"><strong>Date:</strong> 11th Aug 2024</span>

      <p className=" text-center"><strong>Venue:</strong> AWS Singapore,23 Church Street, Level 8 Capital Square, Singapore 049481</p>
      <div className="text-start">
      <h2 className="fw-bold "style={{marginLeft:"23px"}}>Event Agenda</h2>
      <ul className='agenda'>
        <li className="my-1"><strong>09:00:</strong> Breakfast & Registration</li>
        <li className="my-1"><strong>09:30:</strong> Opening Key Note & Welcome Address</li>
        <li className="my-1"><strong>09:50:</strong> SaaS Innovations - Trends and Opportunities</li>
        <li className="my-1"><strong>10:10:</strong> Hear from Our ISVs - AWS Journeys, Expert Tips & Tricks, and Interactive Q&A</li>
        <li className="my-1"><strong>10:30:</strong> Watermelon Software - AI Driven Software Reliability</li>
        <li className="my-1"><strong>10:45:</strong> DataStax - Building Agent Apps and GenAI Chat</li>
        <li className="my-1"><strong>11:00:</strong> JustPerform - Achieving Streamlined Business Performance Management with an Intelligent Platform</li>
        <li className="my-1"><strong>11:15:</strong> CyncLair - Elevating Your Cybersecurity Security Posture with OpenXDR</li>
      </ul>
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
                    className={`form-control form-control-lg  ${
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
                    className={`form-control form-control-lg   ${
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
                    className={`form-control form-control-lg   ${
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
                <div className="col-12 mb-3 text-start">
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
                </div>

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
          <div className="d-flex justify-content-center">
            <p className="fw-bold ">Thank You!</p>
          </div>
          <div className="d-flex justify-content-center">
            <p className="fw-bold">Your Link Is successfully Generated!</p>
          </div>
          <div className="d-flex justify-content-center">
            <p className="fw-bold"> We look forward to seeing you at ISV Community Day Singapore.</p>
          </div>
        
        </Modal.Body>
      </Modal>
                {/* <span className="d-flex justify-content-center col-12 ">
                  <button className="btn btn-primary">Submit Form</button>
                </span> */}
              </div>
            </form>
          </div>
            <div className="col-md-6 p-4">
            <div className="quote-container">
      <div className="quote-icon">“</div>
      <h1 className="quote-text">
        Let’s Make <br />
        it Happen <br />
        Together!
      </h1>
    </div>
    <p className='my-2'>Join us for an engaging day at the ISV Community Day in Singapore, where independent software vendors (ISVs) come together to explore the latest industry trends, share insights, and collaborate on innovative solutions. This event offers a unique opportunity to network with peers, learn from experts, and discover new ways to drive success in the software development landscape. Whether you're looking to expand your knowledge, connect with potential partners, or simply be inspired, ISV Community Day Singapore is the place to be.</p>

            </div>
            </div>
          
    </div>
  );
};

export default EventRegister;
