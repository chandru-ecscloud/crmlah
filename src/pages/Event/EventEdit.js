import React from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  companyName: yup.string().required("*Company Name is Required"),
  eventName: yup.string().required("*Event Name is Required"),
  firstName: yup.string().required("*First Name is Required"),
  lastName: yup.string().required("*Last Name is Required"),
  email: yup.string().email("Invalid email").required("*Email is required"),
  phone: yup.string().required("*Phone is Required"),
  agenda: yup.string().required("*Agenda is Required"),
});

function EventEdit() {
  const formik = useFormik({
    initialValues: {
      companyName: "ECS Cloud",
      eventName: "ECS Cloud",
      eventDate: "07/8/2024",
      firstName: "Sakthivel",
      lastName: "Jayabal",
      email: "sakthiveljayabal23@gmail.com",
      phone: "6382307159",
      enquiry: "ECS Cloud",
      agenda: "ECS Cloud",
      eventDescription: "ECS Cloud Infotech",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Event Data:", data);
    },
  });

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Event</b>
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
        <div className="container pt-5">
        <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyName && formik.errors.companyName
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
                  className={`form-size form-control  ${
                    formik.touched.eventName && formik.errors.eventName
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
                  className={`form-size form-control  ${
                    formik.touched.firstName && formik.errors.firstName
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
                  className={`form-size form-control  ${
                    formik.touched.lastName && formik.errors.lastName
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
                  className={`form-size form-control  ${
                    formik.touched.eventDate && formik.errors.eventDate
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
                  className={`form-size form-control  ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                  name="email"
                  id="email"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-danger">{formik.errors.email}</p>
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
                  className={`form-size form-control  ${
                    formik.touched.phone && formik.errors.phone
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
                    className={` form-control  ${
                      formik.touched.agenda && formik.errors.agenda
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("agenda")}
                    name="agenda"
                    id="agenda"
                  />
                  {formik.touched.agenda && formik.errors.agenda && (
                    <p className="text-danger">{formik.errors.agenda}</p>
                  )}
                </div>
              </div>
            </div>
            <div className=" col-12 mb-3">
              <div className="row align-items-center">
                <div className="col-2 text-end">
                  <lable>Enquiry</lable>
                </div>
                <div className="col-10">
                  <textarea
                    type="text"
                    className={` form-control  ${
                      formik.touched.enquiry && formik.errors.enquiry
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
                    className={` form-control  ${
                      formik.touched.eventDescription &&
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
