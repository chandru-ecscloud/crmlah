import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  // appointmentFor: Yup.string().required("*Appointment for is required"),
  serviceId: Yup.string().required("*Service is required"),
  duration: Yup.string().required("*Duration is required"),
  appointmentName: Yup.string().required("*Name is required"),
  // appointmentStartDate: Yup.date().required("*Start date is required"),
  // timeSlotId: Yup.string().required("*Start Time is required"),
  location: Yup.string().required("*Location is required"),
  member: Yup.string().required("*Member is required"),
  // minutes: Yup.string().required("*Minutes is required"),
  // time: Yup.string().required("*Time is required"),
  // hour: Yup.string().required("*Hour is required"),
  // none: Yup.string().required("*None is required"),
  street: Yup.string().required("*Street is required"),
  city: Yup.string().required("*City is required"),
  state: Yup.string().required("*State is required"),
  zipCode: Yup.string()
    .matches(/^\d+$/, "Must be only digits")
    .required("*Zip code is required"),
  country: Yup.string().required("*Country is required"),
  appointmentMode: Yup.string().required("*Appointment Mode is required"),
});

function CalenderAdd({ name, showModal, getData, setShowModal, eventData }) {
  const appointmentRole = sessionStorage.getItem("appointmentRole");
  const [serviceData, setserviceData] = useState([]);
  const [leadData, setleadData] = useState([]);
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("user_name");
  const [appointmentTime, setAppointmentTime] = useState([]);

  const formik = useFormik({
    initialValues: {
      serviceId: "",
      email: "",
      serviceName: "",
      appointmentStartDate: "",
      timeSlotId: "",
      duration: "",
      appointmentName: "",
      location: "",
      member: "",
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

    onSubmit: async (data, { resetForm, setSubmitting }) => {
      console.log("Add appointment", data);
      console.log("User Data", leadData);
      if (name === "Create Appointment") {
        let selectedLeadName = "";
        let selectedServiceName = "";

        leadData.forEach((lead) => {
          if (parseInt(data.leadId) === lead.id) {
            selectedLeadName = lead || "--";
          }
        });

        serviceData.forEach((service) => {
          if (parseInt(data.serviceId) === service.id) {
            selectedServiceName = service.serviceName || "--";
          }
        });

        data.serviceName = selectedServiceName;
        data.appointmentFor = selectedLeadName.name;
        data.email = selectedLeadName.email;
        data.typeOfAppointment = "Leads";
      }
      let selectedTimeSlot = "";
      appointmentTime.forEach((time) => {
        if (parseInt(data.timeSlotId) === time.id) {
          selectedTimeSlot = time.slotTime || "--";
        }
      });
      const startTime = new Date(eventData.start).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      const endTime = new Date(eventData.end).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      const StartDate = new Date(eventData.start).toISOString().slice(0, 10);
      data.appointmentStartTime = `${startTime} - ${endTime}`;
      data.companyId = companyId;
      data.appointmentOwner = userName;
      data.reminder = 2;
      data.appointmentRoleType = appointmentRole;
      data.userId = userId;

      // console.log("Add appointment", data);
      try {
        const response = await axios.post(`${API_URL}book-appointment`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          console.log(response.data.appointmentId);
          getData();
          resetForm();
          toast.success(response.data.message);
          setShowModal(false);

          try {
            const response = await axios.post(
              `${API_URL}GenerateSingaporeZoomMeetingLink`,
              {
                meetingTitle: data.typeOfAppointment,
                startDate: StartDate,
                startTime: data.appointmentStartTime.split(" ")[0],
                duration: data.duration.split(" ")[0],
              }
            );

            if (response.status === 200) {
              let mailContent;
              if (data.appointmentMode === "ONLINE") {
                mailContent = `
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
                                  src="https://ecscloudinfotech.com/ecs/static/media/ecs_logo.592342beab02474edfc6.png"
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
                    <h1 style="color: black;">Hi there, ${data.appointmentOwner}</h1>
                    <p style="margin: 2rem 0 0;">You've Scheduled An Appointment With ${data.appointmentOwner} for ${data.appointmentName} On 
                      ${data.appointmentStartDate} at ${data.timeSlotId} <br />(Asia/Kolkata GMT +05:30).
                    </p>
  
                    <h3 style="margin-bottom: 0;">you can join:</h3>
                    <h4 style="margin:0 ;">${response.data.message}</h4>
  
                    <p style="margin: 1.5rem 0px 2rem 0px;"
                    >You Can Still <span><a href="https://crmlah.com/reschedule/index.html?id=${response.data.appointmentId}">reschedule</a></span> or <a href="https://crmlah.com/cancel/index.html?id=${response.data.appointmentId}">Cancel</a> Your Appointment</p>
                    <hr />
                    <p style=" margin: 2rem 0 0;">See You Soon,</p>
                    <h4 style=" margin: 0; ">${data.appointmentOwner}</h4>
                    <p style=" margin: 0 ; ">ECS Cloud</p>
                    <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
                    <hr />
                  </div>
                  </div>
                </body>
                </html>`;
              } else {
                mailContent = `
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
                                src="https://ecscloudinfotech.com/ecs/static/media/ecs_logo.592342beab02474edfc6.png"
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
                  <h1 style="color: black;">Hi there, ${data.appointmentOwner}</h1>
                  <p style="margin: 2rem 0 0;">You've Scheduled An Appointment With ${data.appointmentOwner} for ${data.appointmentName} On 
                    ${data.appointmentStartDate} at ${data.timeSlotId} <br />(Asia/Kolkata GMT +05:30).
                  </p>

                  <h3 style="margin-bottom: 0;">Location details:</h3>
                  <h4 style="margin:0 ;">${data.state}</h4>

                  <p style="margin: 1.5rem 0px 2rem 0px;"
                  >You Can Still <span><a href="https://crmlah.com/reschedule/index.html?id=${response.data.appointmentId}">reschedule</a></span> or <a href="https://crmlah.com/cancel/index.html?id=${response.data.appointmentId}">Cancel</a> Your Appointment</p>
                  <hr />
                  
                  <p style=" margin: 2rem 0 0;">See You Soon,</p>
                  <h4 style=" margin: 0; ">${data.appointmentOwner}</h4>
                  <p style=" margin: 0 ; ">ECS Cloud</p>
                  <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
                  <hr />
                </div>
                </div>
              </body>
              </html>`;
              }
              try {
                const response = await axios.post(`${API_URL}sendMail`, {
                  toMail: data.email,
                  fromMail: data.email,
                  subject: data.appointmentName,
                  htmlContent: mailContent,
                });

                if (response.status === 200) {
                  toast.success(response.data.message);
                  toast.success("Mail Send Successfully");
                } else {
                  toast.error(response.data.message);
                }
              } catch (error) {
                toast.error("Mail Not Send");
                // console.error("Failed to send email:", error);
              }
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            toast.error("Mail Not Send");
            // console.error("Failed to send email:", error);
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
  const fetchServiceData = async () => {
    try {
      const response = await axios(`${API_URL}getAllIdAndServiceName`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setserviceData(response.data);
      // console.log("idAndName", idAndName);
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
  }, []);

  return (
    <Modal
      size="xl"
      show={showModal}
      onHide={() => setShowModal(false)}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton className="Calenderview">
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
                      onClick={() => setShowModal(false)}
                    >
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
                  {name == "schedule" ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-center justify-content-end sm-device">
                        <lable>Appointment </lable> &nbsp;&nbsp;
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
                      {formik.touched.leadId && formik.errors.leadId && (
                        <p className="text-danger">{formik.errors.leadId}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
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
                      {formik.touched.serviceId && formik.errors.serviceId && (
                        <p className="text-danger">{formik.errors.serviceId}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Date</lable> &nbsp;&nbsp;
                      <input
                        type="date"
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
                            <p className="text-danger">
                              {formik.errors.appointmentStartDate}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label>Start Time</label>&nbsp;&nbsp;
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
                  </div> */}

                {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Time</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="timeSlotId"
                        id="timeSlotId"
                        {...formik.getFieldProps("timeSlotId")}
                        className={`form-size form-control   ${
                          formik.touched.timeSlotId &&
                          formik.errors.timeSlotId
                            ? "is-invalid"
                            : ""
                        }`}
                      />
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
                  </div> */}

                <div className="col-lg-6 col-md-6 col-12  mb-3">
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
                        <p className="text-danger">{formik.errors.duration}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <div className="d-flex align-items-center justify-content-end sm-device">
                    <lable>Appointment Name</lable> &nbsp;&nbsp;
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
                    <label htmlFor="leadowner">Location</label>&nbsp;&nbsp;
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
                        <p className="text-danger">{formik.errors.location}</p>
                      )}
                    </div>
                  </div>
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
                        <p className="text-danger">{formik.errors.member}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
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
                </div>
              </div>
            </div>
            {/* <div className="container-fluid my-5">
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
                        className={`form-size form-select   ${
                          formik.touched.minutes && formik.errors.minutes
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="15 minutes before">
                          15 minutes before
                        </option>
                        <option value="30 minutes before">
                          30 minutes before
                        </option>
                        <option value="45 minutes before">
                          45 minutes before
                        </option>
                        <option value="50 minutes before">
                          50 minutes before
                        </option>
                      </select>
                    </div>
                    {formik.touched.minutes && formik.errors.minutes && (
                      <p className="text-danger">
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
                        className={`form-size form-select   ${
                          formik.touched.time && formik.errors.time
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
                      <p className="text-danger">
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
                        className={`form-size form-select   ${
                          formik.touched.hour && formik.errors.hour
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
                      <p className="text-danger">
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
                        className={`form-size form-select   ${
                          formik.touched.none && formik.errors.none
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option></option>
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </select>
                    </div>
                    {formik.touched.none && formik.errors.none && (
                      <p className="text-danger">
                        {formik.errors.none}
                      </p>
                    )}
                  </div>
                </div>
              </div> */}

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
                    <lable>Description</lable> &nbsp;&nbsp;
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
  );
}

export default CalenderAdd;
