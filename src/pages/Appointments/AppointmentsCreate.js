import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  appointmentfor: Yup.string().required("*Appointment for is required"),
  serviceName: Yup.string().required("*Service is required"),
  duration: Yup.string().required("*Duration is required"),
  appointmentName: Yup.string().required("*Appointment name is required"),
  appointmentStartDate: Yup.string().required(
    "*Appointment start date is required"
  ),
  appointmentStartTime:Yup.string().required(
    "*Appointment start Time is required"
  ),
  location: Yup.string().required("*Location is required"),
  member: Yup.string().required("*Member is required"),
  minutes: Yup.string().required("*Minutes is required"),
  time: Yup.string().required("*Time is required"),
  hour: Yup.string().required("*Hour is required"),
  none: Yup.string().required("*None is required"),
 street: Yup.string().required("*Street is required"),
  city: Yup.string().required("*City is required"),
  state: Yup.string().required("*State is required"),
  zipCode: Yup.string().required("*Zip code is required"),
  country: Yup.string().required("*Country is required"),
  description_info: Yup.string().required("*Description is required"),
});

function AppointmentsCreate() {
  const [lgShow, setLgShow] = useState(false);
  const role = sessionStorage.getItem("role");

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      company_id: "userId",
      appointmentfor: "",
      serviceName: "",
      appointmentStartDate: "",
      appointmentStartTime: "",
      duration: "",
      appointmentName: "",
      location: "",
      member: "",
      minutes: "",
      time: "",
      hour: "",
      none: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("User Datas:", values);
      // try {
      //   const response = await axios.post(`${API_URL}newAppointment`, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   if (response.status === 201) {
      //     toast.success("Appointment Created Successfully.");
      //     navigate("/appointment");
      //   } else {
      //     toast.error("Appointment Created Unsuccessful.");
      //   }
      // } catch (error) {
      //   toast.error("Failed: " + error.message);
      // }
    },
  });

  return (
    <>
      <Button
        className={`btn btn-primary ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER"}
        onClick={() => setLgShow(true)}
      >
        Create Appointment
      </Button>
      <Modal
        size="xl"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Create Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="createLead">
            <form onSubmit={formik.handleSubmit}>
              <div className="container-fluid">
                <div className="row mt-3">
                  <div className="col-12 d-flex justify-content-end justify-content-end">
                    <span>
                      <button
                        className="btn btn-danger"
                        onClick={() => setLgShow(false)}
                      >
                        Cancel
                      </button>
                    </span>
                    &nbsp;
                    <span>
                      <button
                        className="btn btn-primary"
                        type="submit" onClick={formik.handleSubmit}
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
                      <lable>Appointment </lable> &nbsp;&nbsp;
                      <select
                        name="appointmentfor"
                        className={`form-select form-size ${formik.touched.appointmentfor && formik.errors.appointmentfor
                          ? "is-invalid"
                          : ""
                          }`}
                        {...formik.getFieldProps("appointmentfor")}
                      >
                        <option value=""></option>
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
                    {formik.touched.appointmentfor && formik.errors.appointmentfor && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentfor}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                    <lable>Service Name</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      name="serviceName"
                      id="serviceName"
                      {...formik.getFieldProps("serviceName")}
                      className={`form-size form-control ${formik.touched.serviceName && formik.errors.serviceName
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.serviceName && formik.errors.serviceName && (
                        <p className="text-danger text-end">
                          {formik.errors.serviceName}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                    <lable>Start Date</lable> &nbsp;&nbsp;
                    <input
                      type="date"
                      // className="form-size form-control"
                      name="appointmentStartDate"
                      id="appointmentStartDate"
                      {...formik.getFieldProps("appointmentStartDate")}
                      className={`form-size form-control   ${formik.touched.appointmentStartDate && formik.errors.appointmentStartDate
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.appointmentStartDate && formik.errors.appointmentStartDate && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentStartDate}
                        </p>
                      )}
                  </div>
                 
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                    <lable>Start Time</lable> &nbsp;&nbsp;
                    <input
                      type="time"
                      //className="form-size form-control"
                      name="appointmentStartTime"
                      id="appointmentStartTime"
                      {...formik.getFieldProps("appointmentStartTime")}
                      className={`form-size form-control   ${formik.touched.appointmentStartTime && formik.errors.appointmentStartTime
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.appointmentStartTime && formik.errors.appointmentStartTime && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentStartTime}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                    <label htmlFor="duration">Duration</label>&nbsp;&nbsp;
                    <select
                      id="duration"
                      //className="form-size form-select"
                      name="duration"
                      {...formik.getFieldProps("duration")}
                      className={`form-size form-select   ${formik.touched.duration && formik.errors.duration
                        ? "is-invalid"
                        : ""
                        }`}
                    >
                      <option value=""></option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="3 Hour">3 Hour</option>
                      <option value="5 Hour">5 Hour</option>
                    </select>
                    </div>
                    {formik.touched.duration && formik.errors.duration && (
                        <p className="text-danger text-end">
                          {formik.errors.duration}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>Name</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      //className="form-size form-control"
                      name="appointmentName"
                      id="appointmentName"
                      {...formik.getFieldProps("appointmentName")}
                      className={`form-size form-control   ${formik.touched.appointmentName && formik.errors.appointmentName
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.appointmentName && formik.errors.appointmentName && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentName}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <label htmlFor="leadowner">Location</label>&nbsp;&nbsp;
                    <select
                      id="location"
                      //className="form-size form-select"
                      name="location"
                      {...formik.getFieldProps("location")}
                      className={`form-size form-select   ${formik.touched.location && formik.errors.location
                        ? "is-invalid"
                        : ""
                        }`}
                    >
                      <option value=""></option>
                      <option value="Client Address">Client Address</option>
                      <option value="Billing Address">Billing Address</option>
                      <option value="Client Address & Billing Address">
                        Client Address & Billing Address
                      </option>
                    </select>
                  </div>
                  {formik.touched.location && formik.errors.location && (
                        <p className="text-danger text-end">
                          {formik.errors.location}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>Member</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      //className="form-size form-control"
                      name="member"
                      id="member"
                      {...formik.getFieldProps("member")}

                      className={`form-size form-control   ${formik.touched.member && formik.errors.member
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.member && formik.errors.member && (
                        <p className="text-danger text-end">
                          {formik.errors.member}
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <div className="container-fluid my-5">
                <h4>
                  <b>Reminder</b>
                </h4>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <label htmlFor="minutes">Minutes</label>&nbsp;&nbsp;
                    <select
                      id="minutes"
                      //className="form-size form-select"
                      name="minutes"
                      {...formik.getFieldProps("minutes")}
                      className={`form-size form-select   ${formik.touched.minutes && formik.errors.minutes
                        ? "is-invalid"
                        : ""
                        }`}
                    >
                       <option value=""></option>
                      <option value="15 minutes before">15 minutes before</option>
                      <option value="30 minutes before">30 minutes before</option>
                      <option value="45 minutes before">45 minutes before</option>
                      <option value="50 minutes before">50 minutes before</option>
                    </select>
                    </div>
                    {formik.touched.minutes && formik.errors.minutes && (
                        <p className="text-danger text-end">
                          {formik.errors.minutes}
                        </p>
                      )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <label htmlFor="days">Days</label>&nbsp;&nbsp;
                    <select
                      id="time"
                      //className="form-size form-select"
                      name="time"
                      {...formik.getFieldProps("time")}
                      className={`form-size form-select   ${formik.touched.time && formik.errors.time
                        ? "is-invalid"
                        : ""
                        }`}
                    >
                      <option value=""></option>
                      <option value="At time of appointment">
                        At time of appointment
                      </option>
                      <option value="option 1">1 day before</option>
                      <option value="option 2">2 day before</option>
                      <option value="option 3">3 day before</option>
                    </select>
                    </div>
                    {formik.touched.time && formik.errors.time && (
                        <p className="text-danger text-end">
                          {formik.errors.time}
                        </p>
                      )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <label htmlFor="hours">Hours</label>&nbsp;&nbsp;
                    <select
                      id="hour"
                      //className="form-size form-select"
                      name="hour"
                      {...formik.getFieldProps("hour")}
                      className={`form-size form-select   ${formik.touched.hour && formik.errors.hour
                        ? "is-invalid"
                        : ""
                        }`}
                    >
                    <option value=""></option>
                      <option value="1 hour before">1 hour before</option>
                      <option value="2 hour before">2 hour before</option>
                      <option value="3 hour before">3 hour before</option>
                      <option value="4 hour before">4 hour before</option>
                    </select>

                  </div>
                  {formik.touched.hour && formik.errors.hour && (
                        <p className="text-danger text-end">
                          {formik.errors.hour}
                        </p>
                      )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <label htmlFor="none">Not Neccessary</label>&nbsp;&nbsp;
                    <select
                      id="none"
                      // className="form-size form-select"
                      name="none"
                      {...formik.getFieldProps("none")}
                      className={`form-size form-select   ${formik.touched.none && formik.errors.none
                        ? "is-invalid"
                        : ""
                        }`}
                    >
                      <option ></option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                    </div>
                    {formik.touched.none && formik.errors.none && (
                        <p className="text-danger text-end">
                          {formik.errors.none}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="container-fluid my-5">
                <h4>
                  <b>Address Information</b>
                </h4>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>Street</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      //className="form-size form-control"
                      name="street"
                      id="street"
                      // value={formData.street || ""}
                      {...formik.getFieldProps("street")}
                      className={`form-size form-control   ${formik.touched.street && formik.errors.street
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.street && formik.errors.street && (
                        <p className="text-danger text-end">
                          {formik.errors.street}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>City</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      //className="form-size form-control"
                      name="city"
                      id="city"
                      //value={formData.city || ""}
                      {...formik.getFieldProps("city")}
                      className={`form-size form-control   ${formik.touched.city && formik.errors.city
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.city && formik.errors.city && (
                        <p className="text-danger text-end">
                          {formik.errors.city}
                        </p>
                      )}
                      
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>State</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      //className="form-size form-control"
                      name="state"
                      id="state"
                      // value={formData.state || ""}
                      {...formik.getFieldProps("state")}
                      className={`form-size form-control   ${formik.touched.state && formik.errors.state
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.state && formik.errors.state && (
                        <p className="text-danger text-end">
                          {formik.errors.state}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>Zip Code</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      //className="form-size form-control"
                      name="zipCode"
                      id="zipCode"
                      // value={formData.zipCode || ""}
                      {...formik.getFieldProps("zipCode")}
                      className={`form-size form-control   ${formik.touched.zipCode && formik.errors.zipCode
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.zipCode && formik.errors.zipCode && (
                        <p className="text-danger text-end">
                          {formik.errors.zipCode}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                  <lable>Country</lable> &nbsp;&nbsp;
                    <input
                      type="text"
                      // className="form-size form-control"
                      name="country"
                      id="country"
                      // value={formData.country || ""}
                      {...formik.getFieldProps("country")}
                      className={`form-size form-control   ${formik.touched.country && formik.errors.country
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.country && formik.errors.country && (
                        <p className="text-danger text-end">
                          {formik.errors.country}
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
                      name="description_info"
                      //value={formData.description_info || ""}
                      id="description_info"
                      {...formik.getFieldProps("description_info")}
                      className={`form-control  ${formik.touched.description_info && formik.errors.description_info
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    </div>
                    {formik.touched.description_info && formik.errors.description_info && (
                        <p className="text-danger text-end">
                          {formik.errors.description_info}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </form>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AppointmentsCreate;
