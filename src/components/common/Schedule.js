import React, { useEffect, useState } from "react";
import CRM from "../../assets/heroImage.png";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";

const validationSchema = Yup.object().shape({
  appointmentStartDate: Yup.string().required(
    "*Appointment start date is required"
  ),
  timeSlotId: Yup.string().required("*Appointment start Time is required"),
});
const currentData = new Date().toISOString().split("T")[0];
const Schedule = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const link = searchParams.get("link");
  // console.log(name, email);
  // console.log("ID:",id);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loadIndicatorca, setLoadIndicatorca] = useState(false);
  // const navigate = useNavigate();
  const [appointmentStartTime, setAppointmentStartTime] = useState([]);
  // console.log("appoinment Time", appointmentStartTime);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      appointmentStartDate: currentData,
      appointmentStartTime: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data, { resetForm }) => {
      console.log(data);
      let selectedTimeSlot = "";
      appointmentStartTime.forEach((time) => {
        if (parseInt(data.timeSlotId) === time.id) {
          selectedTimeSlot = time.slotTime || "--";
        }
      });
      data.appointmentStartTime = selectedTimeSlot;
      data.appointmentstatus = "RESCHEDULED";

      setLoadIndicator(true);
      try {
        const response = await axios.put(`${API_URL}reschedule/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          // console.log(response.data.appointmentId)
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.href = "https://crmlah.com/"; // Redirect to the external site
          }, 2000);

          const zoomLink = link
            ? `
              <h3 style="margin-bottom: 0;">you can join:</h3>
              <h4 style="margin:0 ;">${link}</h4>      
              <p style="margin: 1.5rem 0px 2rem 0px;">You Can Still <span><a href="https://crmlah.com/reschedule/index.html?id=${id}&name=${name}&email=${email}&link=${link}">Reschedule or Cancel</a> Your Appointment</p>
              `
            : "";

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
                          <b>Date:</b> ${currentData}<br />
                          The Alexcier, 237 Alexandra Road,<br />
                          #04-10, Singapore-159929.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>


              <div class="invoice" >
              <h1 style="color: black;">Hi, ${name}</h1>
              <p style="margin: 2rem 0 0; font-size: 1rem;">We are pleased to inform you that your appointment has been successfully rescheduled. The appointment has been rescheduled for  ${data.appointmentStartDate} at ${data.appointmentStartTime}. We hope this new schedule is convenient for you. <br />
              </p>
              <hr />
              ${zoomLink}
              <hr />
              <p style=" margin: 2rem 0 0;">See You Soon,</p>
              <p style=" margin: 0 ; ">ECS Cloud</p>
              <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
              <hr />
            </div>
            </div>
          </body>
          </html>`;

          try {
            const response = await axios.post(`${API_URL}sendMail`, {
              toMail: email,
              fromMail: email,
              // subject: data.appointmentName,
              subject: "Your Appointment Has Been Successfully Rescheduled",
              htmlContent: mailContent,
            });

            if (response.status === 200) {
              toast.success(response.data.message);
              setTimeout(() => {
                window.location.href = "https://crmlah.com/";
              }, 2000);
              // toast.success("Mail Send Successfully");
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            // toast.error("Mail Not Send");
            console.error("Failed to send email:", error);
          }
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.warning(error.response?.data.message);
        } else {
          toast.error(error.response?.data.message);
        }
      } finally {
        setLoadIndicator(false); // Set loading indicator back to false after request completes
      }
      resetForm();
    },
  });

  const filterAvailableSlots = (slots, selectedDate) => {
    const currentTime = new Date();

    // If the selected date is not today, return all slots
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
        `https://crmlah.com/ecscrm/api/getTodayAvailableSlotsByCompanyId/${2}?date=${formik.values.appointmentStartDate
        }`,
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
      setAppointmentStartTime(availableSlots);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const CancelAppointment = async (data) => {
    setLoadIndicatorca(true);
    try {
      const response = await axios.delete(`${API_URL}cancelAppointment/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        handleClose();
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.href = "https://crmlah.com/"; // Redirect to the external site
        }, 2000);

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
                        <b>Date:</b> ${currentData}<br />
                        The Alexcier, 237 Alexandra Road,<br />
                        #04-10, Singapore-159929.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>


            <div class="invoice" >
            <h1 style="color: black;">Hi, ${name}</h1>
            <p style="margin: 2rem 0 0; font-size: 1rem;">We regret to inform you that your scheduled appointment has been cancelled at your request. If you have any questions or need further assistance, please do not hesitate to contact us.<br />
            </p>

                <hr />
            
            <p style=" margin: 2rem 0 0;">See You Soon,</p>
            <h4 style=" margin: 0; ">${name}</h4>
            <p style=" margin: 0 ; ">ECS Cloud</p>
            <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
            <hr />
          </div>
          </div>
        </body>
        </html>`;
        try {
          const response = await axios.post(`${API_URL}sendMail`, {
            toMail: email,
            fromMail: email,
            // subject: data.appointmentName,
            subject: "Your Appointment Has Been Cancelled",
            htmlContent: mailContent,
          });

          if (response.status === 200) {
            toast.success(response.data.message);
            // toast.success("Mail Send Successfully");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          // toast.error("Mail Not Send");
          // console.error("Failed to send email:", error);
        }
      } else {
        toast.error("Appointment Cancel Unsuccessful");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.warning(error.response?.data.message);
      } else {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoadIndicatorca(false); // Set loading indicator back to false after request completes
    }
  };

  useEffect(() => {
    fetchAppointmentTime();
    // getData();
    // formik.setFieldValue("appointmentStartDate", currentData);
  }, [formik.values.appointmentStartDate]);

  return (
    <section className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <h3 className="registerWord text-center">
                Reschedule Appointment
              </h3>
              <div className="container px-5">
                <form onSubmit={formik.handleSubmit}>
                  <div className="my-4">
                    <label htmlFor="">Select new Date of Appointment</label>

                    <input
                      type="date"
                      name="appointmentStartDate"
                      id="appointmentStartDate"
                      min={currentData}
                      {...formik.getFieldProps("appointmentStartDate")}
                      className={`form-size form-control   ${formik.touched.appointmentStartDate &&
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

                  <div className="mt-4 mb-5">
                    <label htmlFor="">Select new Time of Appointment</label>

                    <select
                      type="text"
                      name="timeSlotId"
                      className="form-select form-size"
                      {...formik.getFieldProps("timeSlotId")}
                      id="timeSlotId"
                    >
                      <option value="">Select a start time</option>
                      {appointmentStartTime.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}
                          disabled={option.allocated}
                        >
                          {option.slotTime} {option.allocated ? "" : ""}
                        </option>
                      ))}
                    </select>
                    {formik.touched.timeSlotId && formik.errors.timeSlotId && (
                      <p className="text-danger">{formik.errors.timeSlotId}</p>
                    )}
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      className="btn btn-primary rounded-pill w-100 px-5"
                      style={{ background: "#385fe5" }}
                      type="submit"
                      disabled={loadIndicator}
                    >
                      {loadIndicator && (
                        <span
                          class="spinner-border spinner-border-sm me-2 "
                          aria-hidden="true"
                        ></span>
                      )}
                      Reschedule
                    </button>

                    <div className="d-flex justify-content-center align-items-center">
                      <div
                        className="container-fluid"
                        style={{
                          flex: "0.1 1 0%",
                          borderBottom: "1px solid rgb(192, 185, 185)",
                          maxWidth: "40%",
                        }}
                      ></div>
                      <p
                        className="my-3"
                        style={{
                          marginBottom: "0rem",
                          color: "rgb(150, 149, 149)",
                        }}
                      >
                        OR
                      </p>
                      <div
                        className="container-fluid"
                        style={{
                          flex: "0.1 1 0%",
                          borderBottom: "1px solid rgb(192, 185, 185)",
                          maxWidth: "40%",
                        }}
                      ></div>
                    </div>

                    <button
                      className="btn btn-danger rounded-pill w-100 px-5"
                      type="button"
                      onClick={handleShow}
                      disabled={loadIndicatorca}
                    >
                      {loadIndicatorca && (
                        <span
                          class="spinner-border spinner-border-sm me-2 "
                          aria-hidden="true"
                        ></span>
                      )}
                      Cancel Appoinment
                    </button>

                    <Modal
                      size="sm"
                      show={show}
                      onHide={handleClose}
                      aria-labelledby="example-modal-sizes-title-lg"
                      centered
                    >
                      <Modal.Header className="bg-light p-2">
                        <Modal.Title className="fs-5">
                          Cancel Appointment
                        </Modal.Title>
                      </Modal.Header>
                      <hr className="m-0" />
                      <Modal.Body>
                        Are you sure you want to Cancel The Appoinment?
                      </Modal.Body>
                      <hr className="m-0" />
                      <Modal.Footer className="d-flex justify-content-between align-items-center">
                        <button
                          className="btn btn-sm btn-danger"
                          variant="secondary"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={CancelAppointment}
                        >
                          {loadIndicatorca && (
                            <span
                              class="spinner-border spinner-border-sm me-2"
                              aria-hidden="true"
                            ></span>
                          )}
                          Confirm
                        </button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
