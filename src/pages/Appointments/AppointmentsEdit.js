import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  // leadId: Yup.string().required("*Appointment is required"),
  // firstName:Yup.string().required("*First Name is required"),
  // lastName:Yup.string().required("*Last Name is required"),
  phoneNumber: Yup.string()
    .required("*Phone Number is required")
    .matches(/^[0-9]{8,10}$/, "*Phone Number must be 8 to 10 digits"),
  // serviceId: Yup.string().required("*Service is required"),
  // duration: Yup.string().required("*Duration is required"),
  appointmentName: Yup.string().required("*Name is required"),
  appointmentStartDate: Yup.date().required("*Start date is required"),
  timeSlotId: Yup.string().required("*Start Time is required"),
  location: Yup.string().required("*Location is required"),
  appointmentstatus: Yup.string().required("*Appointment Status is required"),
  appointmentMode: Yup.string().required("*Appointment mode is required"),
  additionalInformation: Yup.string().required("*Description is required"),
});

function AppointmentsCreate({ name, id, getData }) {
  const [lgShow, setLgShow] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [leadData, setleadData] = useState([]);
  const [apidata, setApiData] = useState([]);
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const userName = sessionStorage.getItem("user_name");
  const [appointmentTime, setAppointmentTime] = useState([]);

  const formik = useFormik({
    initialValues: {
      companyId: companyId,
      leadId: "",
      serviceId: "",
      appointmentStartDate: "",
      phoneNumber: "",
      timeSlotId: "",
      duration: "",
      appointmentstatus: "",
      appointmentName: "",
      location: "",
      member: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      additionalInformation: "",
      appointmentMode: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (data) => {
      let selectedLeadName = "";
      let selectedServiceName = "";

      leadData.forEach((lead) => {
        if (parseInt(data.leadId) === lead.id) {
          selectedLeadName = lead || "--";
        }
      });

      // serviceData.forEach((service) => {
      //   if (parseInt(data.serviceId) === service.id) {
      //     selectedServiceName = service.serviceName || "--";
      //   }
      // });

      let selectedTimeSlot = "";
      appointmentTime.forEach((time) => {
        if (parseInt(data.timeSlotId) === time.id) {
          selectedTimeSlot = time.slotTime || "--";
        }
      });

      data.appointmentFor = selectedLeadName.name;
      data.appointmentStartTime = selectedTimeSlot;
      data.email = selectedLeadName.email;
      // data.serviceName = selectedServiceName;
      data.appointmentOwner = userName;
      data.reminder = 2;
      data.appointmentName = data.appointmentName;
      // console.log(data);

      try {
        const response = await axios.put(
          `${API_URL}updateAppointment/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          getData();
          toast.success(response.data.message);
          handleClose();
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
    },
  });

  const findDataById = async () => {
    try {
      const response = await axios(`${API_URL}allAppointments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      formik.setValues(response.data);
      // console.log("response.data", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchServiceData = async () => {
    try {
      const response = await axios(`${API_URL}getAllIdAndServiceName`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setServiceData(response.data);
      // console.log("idAndName", ServiceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAppointmentTime = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getTodayAvailableSlotsByCompanyId/${companyId}?date=${formik.values.appointmentStartDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAppointmentTime(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchLeadData = async () => {
    try {
      const response = await axios(
        `${API_URL}getLeadBasicDetails/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data)
      setleadData(response.data);
      console.log("userid", leadData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchServiceData();
    fetchLeadData();
    findDataById();
  }, []);

  useEffect(() => {
    fetchAppointmentTime();
  }, [formik.values.appointmentStartDate]);

  const handleClose = () => {
    setLgShow(false);
  };

  return (
    <>
      <button
        className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER"}
        onClick={() => setLgShow(true)}
      >
        {name}
      </button>
      <Modal
        size="xl"
        show={lgShow}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton closeVariant="white" className="Calenderview">
          <Modal.Title id="example-modal-sizes-title-lg">{name}</Modal.Title>
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
                        onClick={handleClose}
                        type="button"
                      >
                        Cancel
                      </button>
                    </span>
                    &nbsp;
                    <span>
                      <button className="btn btn-primary" type="submit">
                        Update
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
                      <lable>Appointment</lable>
                      <span className="text-danger">*</span> &nbsp;&nbsp;
                      <select
                        name="leadId"
                        className={`form-select form-size ${
                          formik.touched.leadId && formik.errors.leadId
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("leadId")}
                      >
                        <option value=" "></option>
                        {leadData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.leadId && formik.errors.leadId && (
                          <p className="text-danger ">{formik.errors.leadId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Service Name</lable> &nbsp;&nbsp;
                      <select
                        type="text"
                        name="serviceId"
                        id="serviceId"
                        {...formik.getFieldProps("serviceId")}
                        className={`form-size form-select ${
                          formik.touched.serviceId && formik.errors.serviceId
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        {serviceData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.serviceName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.serviceId &&
                          formik.errors.serviceId && (
                            <p className="text-danger ">
                              {formik.errors.serviceId}
                            </p>
                          )}
                      </div>
                    </div>
                  </div> */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Appoint Name</lable>
                      <span className="text-danger">*</span> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="appointmentName"
                        id="appointmentName"
                        {...formik.getFieldProps("appointmentName")}
                        className={`form-size form-control   ${
                          formik.touched.appointmentName &&
                          formik.errors.appointmentName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentName &&
                          formik.errors.appointmentName && (
                            <p className="text-danger ">
                              {formik.errors.appointmentName}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Date</lable>
                      <span className="text-danger">*</span> &nbsp;&nbsp;
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
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentStartDate &&
                          formik.errors.appointmentStartDate && (
                            <p className="text-danger ">
                              {formik.errors.appointmentStartDate}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Time</lable>
                      <span className="text-danger">*</span> &nbsp;&nbsp;
                      <select
                        type="text"
                        name="timeSlotId"
                        className="form-select form-size"
                        {...formik.getFieldProps("timeSlotId")}
                        id="timeSlotId"
                      >
                        <option value="">Select a start time</option>
                        {appointmentTime.map((option) => (
                          <option
                            key={option.id}
                            value={option.id}
                            disabled={option.allocated}
                          >
                            {option.slotTime} {option.allocated ? "" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentStartTime &&
                          formik.errors.appointmentStartTime && (
                            <p className="text-danger ">
                              {formik.errors.appointmentStartTime}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Appointment Status</label>
                      <span className="text-danger">*</span>
                      &nbsp;&nbsp;
                      <select
                        id="appointmentstatus"
                        //className="form-size form-select"
                        name="appointmentstatus"
                        {...formik.getFieldProps("appointmentstatus")}
                        className={`form-size form-select   ${
                          formik.touched.appointmentstatus &&
                          formik.errors.appointmentstatus
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentstatus &&
                          formik.errors.appointmentstatus && (
                            <p className="text-danger ">
                              {formik.errors.appointmentstatus}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="duration">Duration</label>&nbsp;&nbsp;
                      <select
                        id="duration"
                        //className="form-size form-select"
                        name="duration"
                        {...formik.getFieldProps("duration")}
                        className={`form-size form-select   ${
                          formik.touched.duration && formik.errors.duration
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
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.duration && formik.errors.duration && (
                          <p className="text-danger ">
                            {formik.errors.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </div> */}

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Location</label>
                      <span className="text-danger">*</span>&nbsp;&nbsp;
                      <select
                        id="location"
                        //className="form-size form-select"
                        name="location"
                        {...formik.getFieldProps("location")}
                        className={`form-size form-select   ${
                          formik.touched.location && formik.errors.location
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
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.location && formik.errors.location && (
                          <p className="text-danger ">
                            {formik.errors.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Phone Number</lable>
                      <span className="text-danger">*</span> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="phoneNumber"
                        id="phoneNumber"
                        {...formik.getFieldProps("phoneNumber")}
                        className={`form-size form-control   ${
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.phoneNumber &&
                          formik.errors.phoneNumber && (
                            <p className="text-danger">
                              {formik.errors.phoneNumber}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Member</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="member"
                        id="member"
                        {...formik.getFieldProps("member")}
                        className={`form-size form-control   ${
                          formik.touched.member && formik.errors.member
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.member && formik.errors.member && (
                          <p className="text-danger ">{formik.errors.member}</p>
                        )}
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Appointment Mode</label>
                      &nbsp;&nbsp;
                      <select
                        id="appointmentMode"
                        //className="form-size form-select"
                        name="appointmentMode"
                        {...formik.getFieldProps("appointmentMode")}
                        className={`form-size form-select   ${
                          formik.touched.appointmentMode &&
                          formik.errors.appointmentMode
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="ONLINE">ONLINE</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentMode &&
                          formik.errors.appointmentMode && (
                            <p className="text-danger">
                              {formik.errors.appointmentMode}
                            </p>
                          )}
                      </div>
                    </div>
                  </div> */}
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
                        className={`form-size form-control   ${
                          formik.touched.street && formik.errors.street
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.street && formik.errors.street && (
                          <p className="text-danger ">{formik.errors.street}</p>
                        )}
                      </div>
                    </div>
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
                        className={`form-size form-control   ${
                          formik.touched.city && formik.errors.city
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.city && formik.errors.city && (
                          <p className="text-danger ">{formik.errors.city}</p>
                        )}
                      </div>
                    </div>
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
                        className={`form-size form-control   ${
                          formik.touched.state && formik.errors.state
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.state && formik.errors.state && (
                          <p className="text-danger ">{formik.errors.state}</p>
                        )}
                      </div>
                    </div>
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
                        className={`form-size form-control   ${
                          formik.touched.zipCode && formik.errors.zipCode
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.zipCode && formik.errors.zipCode && (
                          <p className="text-danger ">
                            {formik.errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
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
                        className={`form-size form-control   ${
                          formik.touched.country && formik.errors.country
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.country && formik.errors.country && (
                          <p className="text-danger ">
                            {formik.errors.country}
                          </p>
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
                  <div className="col-8 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Description</lable><span className="text-danger">*</span> &nbsp;&nbsp;
                      <textarea
                        type="text"
                        rows={5}
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
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.additionalInformation &&
                          formik.errors.additionalInformation && (
                            <p className="text-danger ">
                              {formik.errors.additionalInformation}
                            </p>
                          )}
                      </div>
                    </div>
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
