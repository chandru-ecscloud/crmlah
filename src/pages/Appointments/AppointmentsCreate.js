import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import appoinmentCreateTemplete from "../Email/AppoinmentCreateTemplete";

function AppointmentsCreate({ name, schedule, getData }) {
  const [show, setShow] = useState(false);
  const appointmentRole = sessionStorage.getItem("appointmentRole");
  const [serviceData, setserviceData] = useState([]);
  console.log(serviceData);
  const [leadData, setleadData] = useState([]);
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("user_name");
  const [appointmentTime, setAppointmentTime] = useState([]);
  // console.log("appointmentTime", appointmentTime);

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
    // location: Yup.string().required("*Location is required"),
    // member: Yup.string().required("*Member is required"),
    appointmentMode: Yup.string().required("*Appointment mode is required"),
    additionalInformation: Yup.string().required("*Description is required"),
  });
  // console.log("object", schedule);
  const currentData = new Date().toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      // serviceId: "",
      email: "",
      // serviceName: "",
      appointmentStartDate: currentData,
      timeSlotId: "",
      // duration: "",
      appointmentName: "",
      location: "",
      // member: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      typeOfAppointment: "",
      additionalInformation: "",
      appointmentMode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data, { resetForm }) => {
      console.log("Add appointment", data);
      console.log("User Data", leadData);
      if (name === "Create Appointment") {
        let selectedLeadName = "";
        // let selectedServiceName = "";

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

        // data.serviceName = selectedServiceName;
        data.appointmentFor = selectedLeadName.name;
        data.email = selectedLeadName.email;
        data.typeOfAppointment = "Leads";
        data.typeOfAppointment = "Leads";
      }
      let selectedTimeSlot = "";
      appointmentTime.forEach((time) => {
        if (parseInt(data.timeSlotId) === time.id) {
          selectedTimeSlot = time.slotTime || "--";
        }
      });
      data.appointmentStartTime = selectedTimeSlot;
      data.appointmentstatus = "PENDING";
      data.companyId = companyId;
      data.appointmentOwner = userName;
      data.reminder = 2;
      data.appointmentRoleType = appointmentRole;
      data.userId = userId;
      // data.phoneNumber = data.phoneNumber;
      data.companyName = "ECS";

      // console.log("Add appointment", data);
      try {
        const response = await axios.post(`${API_URL}book-appointment`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          // console.log(response.data.appointmentId);
          const appointmentId = response.data.appointmentId;
          getData();
          resetForm();
          toast.success(response.data.message);
          setShow(false);
          // console.log("Appoinment Created");

          // if (data.appointmentMode === "ONLINE") {
          try {
            // console.log("Link Generated function")
            const linkResponse = await axios.post(
              `${API_URL}GenerateSingaporeZoomMeetingLink`,
              {
                meetingTitle: data.typeOfAppointment,
                startDate: data.appointmentStartDate,
                startTime: data.appointmentStartTime.split(" ")[0],
                duration: 30,
              }
            );
            if (linkResponse.status === 200) {
              appoinmentCreateTemplete(
                data,
                appointmentId,
                linkResponse,
                companyId
              );
            }
          } catch (e) {
            toast.error("Error Generating Zoom Link ", e);
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
    },
  });

  const filterAvailableSlots = (slots, selectedDate) => {
    const currentTime = new Date();

    if (new Date(selectedDate).toDateString() !== currentTime.toDateString()) {
      return slots;
    }

    // Convert slotTime to a Date object for comparison
    const convertSlotToDate = (slotTime) => {
      const [time, period] = slotTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      } else if (period.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      const slotDate = new Date(selectedDate);
      slotDate.setHours(hours, minutes, 0, 0);

      return slotDate;
    };

    // Filter out past slots
    const availableSlots = slots.filter(
      (slot) => convertSlotToDate(slot.slotTime) > currentTime
    );

    return availableSlots;
  };

  const fetchAppointmentTime = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getTodayAvailableSlotsByCompanyId/${companyId}?date=${formik.values.appointmentStartDate}&userId=1`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const availableSlots = filterAvailableSlots(
        response.data,
        formik.values.appointmentStartDate
      );
      formik.setFieldValue("timeSlotId", "");
      setAppointmentTime(availableSlots);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openModal = () => {
    setShow(true);
    formik.setFieldValue("appointmentStartDate", currentData);

    // console.log("scheduleDataM", schedule);

    if (name === "Schedule") {
      let scheduleData = {
        appointmentFor: schedule.appointmentName,
        email: schedule.email,
        typeOfAppointment: schedule.model,
      };
      if (schedule.model === "Contacts") {
        scheduleData.contactId = schedule.id;
      } else if (schedule.model === "Accounts") {
        scheduleData.accountId = schedule.id;
      } else if (schedule.model === "Deals") {
        scheduleData.dealId = schedule.id;
      } else if (schedule.model === "Leads") {
        scheduleData.leadId = schedule.id;
      }
      formik.setValues(scheduleData);
    }
  };
  
  const fetchServiceData = async () => {
    try {
      const response = await axios(`${API_URL}getAllIdAndServiceName`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setserviceData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
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
      setleadData(response.data);
      // console.log("userid", leadData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
    fetchLeadData();
    formik.setFieldValue("appointmentStartDate", currentData);

    if (name === "Schedule") {
      formik.setFieldValue("phoneNumber", schedule.phone);
      formik.setFieldValue("street", schedule.street);
      formik.setFieldValue("city", schedule.city);
      formik.setFieldValue("state", schedule.state);
      formik.setFieldValue("zipCode", schedule.zipCode);
      formik.setFieldValue("country", schedule.country);
    }
  }, [show]);

  useEffect(() => {
    fetchAppointmentTime();
  }, [formik.values.appointmentStartDate]);

  const userData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}allClients/${formik.values.leadId}`
      );
      formik.setFieldValue("phoneNumber", response.data.phone);
      formik.setFieldValue("street", response.data.street);
      formik.setFieldValue("city", response.data.city);
      formik.setFieldValue("state", response.data.state);
      formik.setFieldValue("zipCode", response.data.zipCode);
      formik.setFieldValue("country", response.data.country);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (name !== "Schedule" && formik.values.leadId !== "") {
      userData();
    }
  }, [formik.values.leadId]);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  return (
    <>
      <button
        className={`btn btn-primary ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER"}
        onClick={openModal}
      >
        {name}
      </button>
      <Modal
        size="xl"
        show={show}
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
                      <button className="btn btn-danger" onClick={handleClose}>
                        Cancel
                      </button>
                    </span>
                    &nbsp;
                    <span>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          formik.handleSubmit();
                          formik.setTouched(
                            Object.keys(formik.initialValues).reduce(
                              (touched, key) => {
                                touched[key] = true;
                                return touched;
                              },
                              {}
                            )
                          );
                        }}
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
                    {name === "Schedule" ? (
                      <>
                        <div className="d-flex align-items-center justify-content-end sm-device">
                          <lable>Appointment</lable>{" "}
                          <span className=" text-danger">*</span>
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
                      </>
                    ) : (
                      <>
                        <div className="d-flex align-items-center justify-content-end sm-device">
                          <lable>Appointment </lable>{" "}
                          <span className=" text-danger">*</span> &nbsp;&nbsp;
                          <select
                            name="leadId"
                            className={`form-select form-size ${
                              formik.touched.leadId && formik.errors.leadId
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps("leadId")}
                          >
                            <option value=""></option>
                            {leadData.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.leadId && formik.errors.leadId && (
                          <div className="text-danger">
                            {formik.errors.leadId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Appointment Name</lable>
                      <span className=" text-danger">*</span> &nbsp;&nbsp;
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
                            <p className="text-danger">
                              {formik.errors.appointmentName}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Date</lable>
                      <span className=" text-danger">*</span> &nbsp;&nbsp;
                      <input
                        type="date"
                        name="appointmentStartDate"
                        id="appointmentStartDate"
                        min={currentData}
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
                            <p className="text-danger">
                              {formik.errors.appointmentStartDate}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label>Start Time</label>
                      <span className=" text-danger">*</span> &nbsp;&nbsp;
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
                        {formik.touched.timeSlotId &&
                          formik.errors.timeSlotId && (
                            <p className="text-danger">
                              {formik.errors.timeSlotId}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Location</label>
                      &nbsp;&nbsp;
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
                          <p className="text-danger">
                            {formik.errors.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Phone Number</lable>
                      <span className=" text-danger">*</span> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={"9797979797"}
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
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Appointment Mode</label>
                      <span className=" text-danger">*</span> &nbsp;&nbsp;
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
                          <p className="text-danger">{formik.errors.street}</p>
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
                          <p className="text-danger">{formik.errors.city}</p>
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
                          <p className="text-danger">{formik.errors.state}</p>
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
                          <p className="text-danger">{formik.errors.zipCode}</p>
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
                          <p className="text-danger">{formik.errors.country}</p>
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
                      <lable>Description</lable>
                      <span className=" text-danger">*</span> &nbsp;&nbsp;
                      <textarea
                        rows={5}
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
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.additionalInformation &&
                          formik.errors.additionalInformation && (
                            <p className="text-danger">
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
