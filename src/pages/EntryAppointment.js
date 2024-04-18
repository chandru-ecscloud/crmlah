import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import CRM from "../assets/heroImage.png"
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
    member: Yup.string().required("*Member is required"),
});
const EntryAppointment = () => {
    const formik = useFormik({
        initialValues: {
          email: "",
          appointmentStartDate: "",
          appointmentStartTime: "",
          typeOfAppointment: "",
          additionalInformation: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (data, { resetForm }) => {

        }
    });
  return (
    <section className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center ">
              <div className="container card shadow-lg p-3 bg-body rounded border-0 mb-3">
                <h3 className="text-center text-danger my-3" style={{ fontFamily: "Nunito Sans, sans-serif"}}>
                  Cancel Appointment
                </h3>
                <form onSubmit={formik.handleSubmit}>
              <div className="container-fluid">
                <div className="row mt-3">
                  <div className="col-12 d-flex justify-content-end justify-content-end">
                    <span>
                      <button
                        className="btn btn-danger"
                        onClick={() => setShow(false)}
                      >
                        Cancel
                      </button>
                    </span>
                    &nbsp;
                    <span>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={formik.handleSubmit}
                      >
                        Save
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="container-fluid my-5">
                <h4>
                  <b>Appointment Information</b>
                </h4>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="d-flex align-items-center justify-content-end sm-device">
                        <lable>Appointment</lable> &nbsp;&nbsp;
                        <input
                          type="text"
                          name="appointmentFor"
                          id="appointmentFor"
                          {...formik.getFieldProps("appointmentFor")}
                          className={`form-size form-control   ${
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
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Prefer Date</lable> &nbsp;&nbsp;
                      <input
                        type="date"
                        // className="form-size form-control"
                        name="appointmentStartDate"
                        id="appointmentStartDate"
                        {...formik.getFieldProps("appointmentStartDate")}
                        className={`form-size form-control   ${
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
                 <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Prefer Time</lable> &nbsp;&nbsp;
                      <input
                        type="time"
                        //className="form-size form-control"
                        name="appointmentStartTime"
                        id="appointmentStartTime"
                        {...formik.getFieldProps("appointmentStartTime")}
                        className={`form-size form-control   ${
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
                 
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Email</lable> &nbsp;&nbsp;
                      <input
                        type="email"
                        name="email"
                        id="email"
                        {...formik.getFieldProps("email")}
                        className={`form-size form-control   ${
                          formik.touched.email && formik.errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-danger">
                        {formik.errors.email}
                      </p>
                    )}
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
                  <div className="col-8 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Description</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        style={{ width: "70%" }}
                        // className="form-control"
                        name="additionalInformation"
                        //value={formData.additionalInformation || ""}
                        id="additionalInformation"
                        {...formik.getFieldProps("additionalInformation")}
                        className={`form-control  ${
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
                </div>
              </div>
            </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EntryAppointment
