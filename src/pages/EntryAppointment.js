import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../Config/URL";
import CRM from "../assets/heroImage.png";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  appointmentFor: Yup.string().required("*Appointment for is required"),
  appointmentStartDate: Yup.string().required(
    "*Appointment start date is required"
  ),
  appointmentStartTime: Yup.string().required(
    "*Appointment start Time is required"
  ),
  email: Yup.string().required("*Member is required"),
  additionalInformation: Yup.string().required("*Description is required"),
});
const EntryAppointment = () => {
  const formik = useFormik({
    initialValues: {
      appointmentFor: "",
      email: "",
      appointmentStartDate: "",
      appointmentStartTime: "",
      additionalInformation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data, { resetForm }) => {
      data.companyId = 2;
      data.typeOfAppointment = "website";
      data.appointmentName = "General Enquiry";
      console.log(data);
      try {
        const response = await axios.post(`${API_URL}book-appointment`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success("Thank You for Request Demo! We'll be in touch soon!");
          const mailContent = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Invoice</title>
              <style>
                body{
                  background-color: #ddd;
                }
                .invoice-box {
                  font-size: 12px;
                  max-width: 600px;
                  background-color: #fff;
                  margin: auto;
                  padding: 30px;
                  border-bottom: 3px solid #0059ff;
                  line-height: 24px;
                  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                  color: #555;
                  min-height: 85vh;
                }
          
              .invoice-box table {
                width: 100%;
                line-height: inherit;
                text-align: left;
              }
          
              .invoice-box table td {
                padding: 5px;
                vertical-align: top;
              }
          
              .invoice-box table td.third {
                text-align: right;
              }
          
              .invoice-box table tr.heading td {
                background: #eee;
                border-bottom: 1px solid #ddd;
                font-weight: bold;
              }
          
              .invoice-box table tr.item td {
                border-bottom: 1px solid #eee;
              }
          
              .invoice-box table tr.item.last td {
                border-bottom: none;
              }
          
              .invoice-box table tr.total td:nth-child(2) {
                border-top: 2px solid #eee;
                font-weight: bold;
              }
              .invoice{
                  padding: 1rem;
              }
          
              #scan {
                float: right;
              }
          
              #scan img {
                max-width: 100%;
                height: auto;
              }
          
              @media print {
                .invoice-box {
                  border: 0;
                }
              }
              
            </style>
            </head>
            <body >
              <div class="invoice-box">
                <table>
                  <tr class="top">
                    <td colspan="2">
                      <table>
                        <tr>
                          <td class="title">
                            <img
                              src="https://ecscloudinfotech.com/ecs/static/media/logo1.9c3a01a2a3d275bf1c44.png"
                              style="width: 75%; max-width: 180px"
                              alt="Logo"
                            />
                          </td>
                          <td class="third">
                            <b>Date:</b> 24-01-2024<br />
                            The Alexcier, 237 Alexandra Road,<br />
                            #04-10, Singapore-159929.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
          
                
               <div class="invoice" >
                <h1 style="color: black;">Hi there, ${data.appointmentFor}!</h1>
          
                <p style="margin: 3rem 0 2rem;">
                  You're welcome! I'm glad to hear you've booked an appointment.
                </p>
          
                <p style="margin: 3rem 0 5rem;">You've Scheduled An Appointment With ${data.appointmentFor} for ${data.appointmentName} On 
                ${data.appointmentStartDate} at ${data.appointmentStartTime} <br />(Asia/Kolkata GMT +05:30).
                </p>

                <p style="margin: 3rem 0 2rem; font-size: 1.2vw; "
                >Your demo appointment is <span style="color: green; font-weight: bold;">Confirmed!</span>
                Our team will reach out to you shortly.
                </p>
                <!-- <p>The Invoice Number is: EC-000012.</p> -->
              
          
                <hr />
          
                <p style=" margin: 4rem 0 0;">See You Soon,</p>
                <h4 style=" margin: 0; color: #000; ">${data.email}</h4>
                <p style=" margin: 0 ; color: #016ce4;">ECS Cloud</p>
                <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
                <hr />
              </div>
              </div>
            </body>
          </html>`;
          try {
            const response = await axios.post(`${API_URL}sendMail`, {
              toMail: data.email,
              fromMail: data.email,
              subject: data.appointmentName,
              htmlContent: mailContent,
            });

           } catch (error) {
            toast.error("Mail Not Send");
          }
        } else {
          toast.error("Appointment Created Unsuccessful.");
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.warning(error.response?.data.message);
        } else {
          toast.error(error.response?.data.message);
        }
      }
        resetForm()
    },
  });
  return (
    <section className="signIn">
      <div style={{ backgroundColor: "#ecfafe" }}>
        <div className="container-fluid ">
          <div className="row py-5 px-4">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center ">
              <form onSubmit={formik.handleSubmit}>
                <div className="container">
                  <div className="row">
                    <h3
                      className=" text-center  my-3"
                      style={{ fontFamily: "Nunito Sans, sans-serif",fontSize:"2vw",fontWeight:"bold" }}
                    >
                      Book A Demo
                    </h3>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label ">Appointment</lable>
                        <input
                          type="text"
                          name="appointmentFor"
                          id="appointmentFor"
                          {...formik.getFieldProps("appointmentFor")}
                          className={`form-size form-control mt-1 ${
                            formik.touched.appointmentFor &&
                            formik.errors.appointmentFor
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.appointmentFor &&
                        formik.errors.appointmentFor && (
                          <p className="text-danger">
                            {formik.errors.appointmentFor}
                          </p>
                        )}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label">Prefer Date</lable>
                        <input
                          type="date"
                          name="appointmentStartDate"
                          id="appointmentStartDate"
                          {...formik.getFieldProps("appointmentStartDate")}
                          className={`form-size form-control mt-1  ${
                            formik.touched.appointmentStartDate &&
                            formik.errors.appointmentStartDate
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.appointmentStartDate &&
                        formik.errors.appointmentStartDate && (
                          <p className="text-danger">
                            {formik.errors.appointmentStartDate}
                          </p>
                        )}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label">Prefer Time</lable>
                        <input
                          type="time"
                          //className="form-size form-control"
                          name="appointmentStartTime"
                          id="appointmentStartTime"
                          {...formik.getFieldProps("appointmentStartTime")}
                          className={`form-size form-control mt-1  ${
                            formik.touched.appointmentStartTime &&
                            formik.errors.appointmentStartTime
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.appointmentStartTime &&
                        formik.errors.appointmentStartTime && (
                          <p className="text-danger">
                            {formik.errors.appointmentStartTime}
                          </p>
                        )}
                    </div>

                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label">Email</lable>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          {...formik.getFieldProps("email")}
                          className={`form-size form-control mt-1  ${
                            formik.touched.email && formik.errors.email
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-danger">{formik.errors.email}</p>
                      )}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label">Enquiry</lable>
                        <input
                          type="text"
                          name="additionalInformation"
                          //value={formData.additionalInformation || ""}
                          id="additionalInformation"
                          {...formik.getFieldProps("additionalInformation")}
                          className={`form-control mt-1 ${
                            formik.touched.additionalInformation &&
                            formik.errors.additionalInformation
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.additionalInformation &&
                        formik.errors.additionalInformation && (
                          <p className="text-danger">
                            {formik.errors.additionalInformation}
                          </p>
                        )}
                    </div>
                    <div className="col-12 mb-3 d-flex justify-content-center ">
                      <button
                        className="btn donateBtn "
                        type="submit"
                        onClick={formik.handleSubmit}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
                <div className="container-fluid">
                  <div className="row mt-3">
                    <div className="col-12 d-flex "></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntryAppointment;
