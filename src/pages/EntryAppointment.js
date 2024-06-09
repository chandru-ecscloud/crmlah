import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../Config/URL";
import CRM from "../assets/heroImage.png";
import { useFormik } from "formik";
import * as Yup from "yup";

const getCurrentLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now.getTime() - offset)
    .toISOString()
    .split("T")[0];
  return localISOTime;
};

const validationSchema = Yup.object().shape({
  // appointmentFor: Yup.string().required("*Appointment for is required"),
  first_name: Yup.string().required("*First Name is required"),
  last_name: Yup.string().required("*Last Name is required"),
  appointmentStartDate: Yup.string().required("*Prefer Date is required"),
  timeSlotId: Yup.string().required("*Prefer Time is required"),
  email: Yup.string().email("*Invalid Email").required("*Email is required"),
  phone: Yup.string()
    .required("*Phone Number is required")
    .matches(/^[0-9]{10}$/, "*Phone Number must be 10 digits"),
  additionalInformation: Yup.string().required("*Enquiry is required"),
});
const EntryAppointment = () => {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState([]);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      appointmentStartDate: "",
      phone: "",
      timeSlotId: "",
      additionalInformation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data, { resetForm }) => {
      data.companyId = 2;
      data.typeOfAppointment = "website";
      data.appointmentName = "General Enquiry";
      console.log(data);
      let selectedTimeSlot = "";
      appointmentTime.forEach((time) => {
        if (parseInt(data.timeSlotId) === time.id) {
          selectedTimeSlot = time.slotTime || "--";
        }
      });
      data.appointmentStartTime = selectedTimeSlot;
      data.appointmentstatus = "PENDING";

      data.appointmentFor = `${data.first_name}${data.last_name}`;
      setLoadIndicator(true);
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        company_id: 2,
        company: "ECSCloudInfotech",
        lead_status: "Pending",
        description_info: data.additionalInformation,
        phone: data.phone,
      };
      try {
        const response = await axios.post(`${API_URL}newClient`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Lead Created Successfully");
        console.log(response.data.message);
        // console.log("newclient Id",response.data.leadId);
        data.leadId = response.data.leadId;
        // console.log("New client Id:", payload);
      } catch (error) {
        // toast.error("Lead Not Create");
        console.log("Error");
      }

      try {
        const response = await axios.post(`${API_URL}book-appointment`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          console.log("data", data);
          toast.success("Thank You for Request Demo! We'll be in touch soon!");
          setLoadIndicator(false);
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
                              src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png"
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
                ${data.appointmentStartDate} at ${data.appointmentStartTime} <br />(Asia/Singapore).
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
            toast.success("Mail Send Successfully");
          } catch (error) {
            // toast.error("Mail Not Send");
            console.log("Error");
            setLoadIndicator(false);
          }
        } else {
          toast.error("Appointment Created Unsuccessful.");
          setLoadIndicator(false);
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.warning(error.response?.data.message);
          toast.error(error.response1?.data.message);
        } else {
          toast.error(error.response?.data.message);
        }
      } finally {
        setLoadIndicator(false);
      }
      resetForm();
    },
  });

  const fetchAppointmentTime = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getTodayAvailableSlotsByCompanyId/${2}?date=${
          formik.values.appointmentStartDate
        }`,
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

  useEffect(() => {
    formik.setFieldValue("appointmentStartDate", getCurrentLocalDate());
  }, []);

  useEffect(() => {
    fetchAppointmentTime();
  }, [formik.values.appointmentStartDate]);

  console.log("appointmentTime", appointmentTime);

  return (
    <section className="signIn">
      <div style={{ backgroundColor: "#ecfafe" }}>
        <div className="container-fluid ">
          <div className="row py-5 px-4">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center  justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center ">
              <form onSubmit={formik.handleSubmit}>
                <div className="container">
                  <div className="row">
                    <h3
                      className=" text-center  my-3 mb-4"
                      style={{
                        fontFamily: "Nunito Sans, sans-serif",
                        fontSize: "3vw",
                        fontWeight: "bold",
                      }}
                    >
                      Book A Demo
                    </h3>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label ">First Name</lable>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          {...formik.getFieldProps("first_name")}
                          className={`form-size form-control mt-1 ${
                            formik.touched.first_name &&
                            formik.errors.first_name
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.first_name &&
                        formik.errors.first_name && (
                          <p className="text-danger">
                            {formik.errors.first_name}
                          </p>
                        )}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label ">Last Name</lable>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          {...formik.getFieldProps("last_name")}
                          className={`form-size form-control mt-1 ${
                            formik.touched.last_name && formik.errors.last_name
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.last_name && formik.errors.last_name && (
                        <p className="text-danger">{formik.errors.last_name}</p>
                      )}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="row">
                        <div className="col-6">
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

                          {formik.touched.appointmentStartDate &&
                            formik.errors.appointmentStartDate && (
                              <p className="text-danger">
                                {formik.errors.appointmentStartDate}
                              </p>
                            )}
                        </div>
                        <div className="col-6">
                          <div className="">
                            <lable className="form-label">Prefer Time</lable>
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
                          {formik.touched.timeSlotId &&
                            formik.errors.timeSlotId && (
                              <p className="text-danger">
                                {formik.errors.timeSlotId}
                              </p>
                            )}
                        </div>
                      </div>
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
                        <lable className="form-label">Phone</lable>
                        <input
                          type="phone"
                          name="phone"
                          id="phone"
                          {...formik.getFieldProps("phone")}
                          className={`form-size form-control mt-1  ${
                            formik.touched.phone && formik.errors.phone
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-danger">{formik.errors.phone}</p>
                      )}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="">
                        <lable className="form-label">Enquiry</lable>
                        <textarea
                          rows={5}
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
                        className="btn donateBtn px-5 py-3"
                        type="submit"
                        onClick={formik.handleSubmit}
                      >
                        {loadIndicator && (
                          <span
                            class="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          ></span>
                        )}
                        Book Demo
                      </button>
                    </div>
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
