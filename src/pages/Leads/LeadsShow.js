import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { Link, useNavigate } from "react-router-dom";
// import { BsThreeDots } from "react-icons/bs";
// import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
// import BookAppointment from "../Appointments/BookAppointment";
// import { FaArrowAltCircleLeft, FaArrowCircleLeft } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Appointment from "../Appointments/AppointmentsCreate";
import SendEmailFollowUp from "../Email/SendEmailFollowUp";
import { FaEdit } from "react-icons/fa";
import AppointmentsEdit from "../Appointments/AppointmentsEdit";

function LeadsShow() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [clientData, setClientData] = useState({});
  const [appointments, setAppointments] = useState([]);
  console.log("appointData,", appointments);
  const navigate = useNavigate();
  // const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [leadName, setLeadName] = useState([]);

  // const handleClose = () => {
  //   setSelectedFiles([]);
  //   setShow(false);
  // };
  // const handleShow = () => setShow(true);
  // const handleHide = () => {
  //   setSelectedFiles([]);
  //   setShow(false);
  // };
  const scheduleData = {
    model: "Leads",
    id: id,
    appointmentName: `${clientData.first_name} ${clientData.last_name}`,
    email: clientData.email,
    phone: clientData.phone,
    city: clientData.city,
    state: clientData.state,
    street: clientData.street,
    zipCode: clientData.zipCode,
    country: clientData.country,
  };

  const userData = async () => {
    try {
      const response = await axios.get(`${API_URL}allClients/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      // const { first_name, last_name } = response.data;
      // const concatenatedName = `${first_name || ""} ${last_name || ""}`.trim();
      setClientData(response.data);
      setAppointments(response.data.appointmentModels || []);
      // setLeadName(concatenatedName);
      console.log("Lead Show :", response.data);
      // console.log("setLeadName :", concatenatedName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/leads/edit/${id}`);
  };

  // const iconStyle = {
  //   filter: 'drop-shadow(-3px -3px 2px rgba(255, 255, 255, 0.3)) drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.2)) drop-shadow(15px 15px 15px rgba(0, 0, 0, 0.2))'
  // };

  // const handleFileChange = (event) => {
  //   const files = event.target.files;
  //   setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  // };

  // const handleFile2Change = (event) => {
  //   const files = event.target.files;
  //   setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  // };

  return (
    <div>
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
                    onClick={() => navigate("/leads")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>

                {/* <img
                  className="img-fluid"
                  style={{ width: "5rem" }}
                  src={USER}
                  alt="profile"
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          {/* <BookAppointment />  */}

          {/* {clientData.email && (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="button-tooltip-2" className="mailtip">
                  Send Email
                </Tooltip>
              }
            >
              <span>
                <SendEmailFollowUp
                  toEmail={clientData.email}
                  leadId={id}
                  leadName={leadName}
                />
              </span>
            </OverlayTrigger>
          )} */}
          {/* <button
            className="btn bg-primary bg-gradient mx-2 text-white shadow-none"
            onClick={handleShow}
          >
            Send Email
          </button> */}
          <Appointment
            name={"Schedule"}
            schedule={scheduleData}
            getData={userData}
          />
          <button
            className={`btn btn-warning ms-2 ${
              role === "CMP_USER" && "disabled"
            }`}
            disabled={role === "CMP_USER"}
            onClick={handelEdit}
          >
            Edit
          </button>

          {/* <button className="btn bg-light bg-gradient mx-2  text-dark shadow-none">
            <BsThreeDots />
          </button> */}
        </div>
      </section>

      {/* Leads Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* center Content  */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* {/ Details /} */}
          {/* <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-12">
              <div className="address-item">
                <label className="text-dark col-6 text-center">Lead Owner</label>
                <span className="col-6" >
                  &nbsp; : &nbsp;{clientData.lead_owner}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark col-6 text-center">Phone</label>
                <span className="col-6" >
                  &nbsp; : &nbsp; + {clientData.countryCode || ""}&nbsp;
                  {clientData.phone || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark col-6 text-center">Lead Source</label>
                <span className="col-6" >
                  &nbsp; : &nbsp;{clientData.lead_source || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark col-6 text-center">Land Line</label>
                <span className="col-6" >
                  &nbsp; : &nbsp;{clientData.land_line || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark col-6 text-center">Company</label>
                <span className="col-6" >
                  &nbsp; : &nbsp;{clientData.company || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark col-6 text-center">Amount</label>
                <span className="col-6" >
                  &nbsp; : &nbsp;{clientData.amount || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark col-6 text-center">Country</label>
                <span className="col-6" >
                  &nbsp; : &nbsp;{clientData.country || ""}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div> */}

          {/* {/ Hide Details /} */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Lead Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Leads Owner
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.lead_owner || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Company</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.company || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Phone</label>
                <span className="col-6">
                  &nbsp; : &nbsp; + {clientData.countryCode || ""}&nbsp;
                  {clientData.phone || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Lead Source
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.lead_source || ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Skype Id</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.skype_id || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Created At
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;
                  {clientData.created_at
                    ? clientData.created_at.split("T")[0]
                    : "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Updated At
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;
                  {clientData.updated_at
                    ? clientData.updated_at.split("T")[0]
                    : "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  First Name
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.first_name || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Last Name</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.last_name || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Email</label>
                <span className="col-6 text-break">
                  &nbsp; : &nbsp;{clientData.email || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Land Line</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.land_line || ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Lead Status
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.lead_status || "--"}
                </span>
              </div>

              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Twitter</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.twitter || "--"}
                </span>
              </div>

              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Created By
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.created_by || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Updated By
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{clientData.updated_by || "--"}
                </span>
              </div>
            </div>

            {/* {/ Address Information /} */}
            <div className="py-3">
              <span className="fs-6 fw-bold"> Address Information</span>
            </div>
            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Street</label>
                <span className="col-6">
                  : &nbsp;{clientData.street || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">State</label>
                <span className="col-6">
                  : &nbsp;{clientData.state || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Country</label>
                <span className="col-6">
                  : &nbsp;{clientData.country || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">City</label>
                <span className="col-6">: &nbsp;{clientData.city || "--"}</span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Zip Code</label>
                <span className="col-6">
                  : &nbsp;{clientData.zipCode || "--"}
                </span>
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
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        S No
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Appointment name
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Start Date
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Start Time
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Appointment Owner
                      </th>
                      <th scope="col">Mode</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientData.appointmentModels?.length > 0 ? (
                      clientData.appointmentModels.map((appointment, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{appointment.appointmentName}</td>
                          <td>{appointment.appointmentStartDate}</td>
                          <td>{appointment.appointmentStartTime}</td>
                          <td>{appointment.appointmentOwner}</td>
                          <td>
                            {appointment.appointmentMode === "ONLINE" ? (
                              <span className="badge text-bg-success">
                                Online
                              </span>
                            ) : (
                              <span className="badge text-bg-danger">
                                Offline
                              </span>
                            )}
                          </td>
                          <td>
                            {appointment.appointmentstatus === "CONFIRMED" ? (
                              <span className="badge text-bg-warning">
                                CONFIRMED
                              </span>
                            ) : appointment.appointmentstatus ===
                              "COMPLETED" ? (
                              <span className="badge text-bg-success">
                                COMPLETED
                              </span>
                            ) : appointment.appointmentstatus ===
                              "CANCELLED" ? (
                              <span className="badge text-bg-danger">
                                CANCELLED
                              </span>
                            ) : appointment.appointmentstatus ===
                              "RESCHEDULED" ? (
                              <span className="badge text-bg-success">
                                RESCHEDULED
                              </span>
                            ) : (
                              <span className="badge text-bg-primary">
                                PENDING
                              </span>
                            )}
                          </td>
                          <td>
                            <AppointmentsEdit
                              id={appointment.id}
                              name="Edit"
                              getData={userData}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          {" "}
                          No Appointment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* {/ Description Information /} */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Description Information
                </span>
              </div>

              <div className="row mb-3">
                <label className="text-dark col-4 text-center">
                  Description &nbsp; : &nbsp;
                </label>
                <span className="col-8">
                  {clientData.description_info || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes --*/}
        </div>
      </section>
    </div>
  );
}

export default LeadsShow;
