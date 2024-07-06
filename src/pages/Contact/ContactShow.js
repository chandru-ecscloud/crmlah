import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { IoArrowBack } from "react-icons/io5";
import Appointment from "../Appointments/AppointmentsCreate";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

function ContactShow() {
  const { id } = useParams();
  const [contactData, setContactData] = useState({});
  const navigate = useNavigate();
  // const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const scheduleData = {
    model: "Contacts",
    id: id,
    appointmentName: `${contactData.firstName} ${contactData.lastName}`,
    email: contactData.email,
    phone: contactData.phone,
    city: contactData.mailingCity,
    state: contactData.mailingState,
    street: contactData.mailingStreet,
    zipCode: contactData.mailingZip,
    country: contactData.mailingCountry,
  };

  // console.log("scheduleData",scheduleData)
  const userData = async () => {
    try {
      const response = await axios(`${API_URL}allContacts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setContactData(response.data);
      console.log("Contact Show :", contactData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/contacts/edit/${id}`);
  };

  return (
    <>
      {/* header section */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-3 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="button-tooltip-2">Back</Tooltip>}
                >
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/contacts")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          <Appointment
            name={"Schedule"}
            schedule={scheduleData}
            getData={userData}
          />
          <button
            className={`btn btn-warning ms-2 ${
              role === "CMP_USER"
            }`}
            disabled={role === "CMP_USER"}
            onClick={handelEdit}
          >
            Edit
          </button>
        </div>
      </section>

      {/* Leads Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* center Side Content */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-12">
              <div className="address-item">
                <label className="text-dark Label">Contact Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contactOwner || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.email || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;+{contactData.countryCode || ""}&nbsp;
                  {contactData.phone || ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.companyName || ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.amount || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.mailingCountry || ""}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Hide Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Contact Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Contact Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contactOwner || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Contact Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {`${contactData.firstName}${contactData.lastName}`}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.phone || ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {contactData.createdAt
                    ? contactData.createdAt.split("T")[0]
                    : ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {contactData.updatedAt
                    ? contactData.updatedAt.split("T")[0]
                    : ""}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.email || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.createdBy || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Skype Id</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.skypeId || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Twitter</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.twitter || ""}
                </span>
              </div>
            </div>

            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Mailing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingStreet || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Mailing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingState || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Mailing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingCity || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Mailing Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingZip || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Mailing Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingCountry || ""}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Other Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.otherStreet || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Other State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.otherState || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Other City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.otherCity || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Other Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.otherZip || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Other Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.otherCountry || ""}
                  </span>
                </div>
              </div>
            </div>

             {/* Appointment Modal  */}
             <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Appointment
                </span>
              </div>
              <div className="container overflow-x-scroll">
                <table className="table">
                  <thead class="table-light">
                    <tr>
                      <th scope="col" style={{whiteSpace: "nowrap"}}>S No</th>
                      <th scope="col" style={{whiteSpace: "nowrap"}}>Appointment name</th>
                      <th scope="col" style={{whiteSpace: "nowrap"}}>Start Date</th>
                      <th scope="col" style={{whiteSpace: "nowrap"}}>Start Time</th>
                      <th scope="col" style={{whiteSpace: "nowrap"}}>Appointment Owner</th>
                      <th scope="col">Mode</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactData.appointmentModels?.length > 0 ? (
                      contactData.appointmentModels.map((appointment, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{appointment.appointmentName}</td>
                          <td>{appointment.appointmentStartDate}</td>
                          <td>{appointment.appointmentStartTime}</td>
                          <td>{appointment.appointmentOwner}</td>
                          <td>
                            {appointment.appointmentMode === "ONLINE" ? (
                              <span className="badge text-bg-success">Online</span>
                            ) : (
                              <span className="badge text-bg-danger">Offline</span>
                            )}
                          </td>
                          <td>
                          {appointment.appointmentstatus === "CONFIRMED" ? (
                              <span className="badge bg-warning">CONFIRMED</span>
                            ) : appointment.appointmentstatus === "COMPLETED" ?  (
                              <span className="badge bg-successr">COMPLETED</span>
                            ) : appointment.appointmentstatus === "CANCELLED" ? (
                              <span className="badge bg-danger py-2">CANCELLED</span>
                            ) : appointment.appointmentstatus === "RESCHEDULED" ? (
                              <span className="badge bg-info py-2">RESCHEDULED</span>
                            ) : (
                              <span className="badge bg-primary py-2">PENDING</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center"> No Appointment</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Description Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Description Information
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.descriptionInfo || ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactShow;
