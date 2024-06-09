import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
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

function LeadsShow() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [clientData, setClientData] = useState({});
  const navigate = useNavigate();
  // const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [leadName, setLeadName] = useState([]);

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
      const { first_name, last_name } = response.data;
      const concatenatedName = `${first_name || ""} ${last_name || ""}`.trim();
      setClientData(response.data);
      setLeadName(concatenatedName);
      console.log("Lead Show :", response.data);
      console.log("setLeadName :", concatenatedName);
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

          {clientData.email && (
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
          )}
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
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
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
        {/* left Side Content
         */}
        {/* <div className="container-fluid col-md-2 m-0" id="ulList-container">
          <h3 className="text-start ms-4 mt-3 fw-bold fw-bold">Related List</h3>
          <ul className="m-0 py-1">
            <li className="mt-2">
              <Link className="py-3">Notes</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Products</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Attachments</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Open Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Closed Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Invited Meeting</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Emails</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Campaigns</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Social</Link>
            </li>

            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">
                Add Related List
              </Link>
            </li>
          </ul>
          <h3 className="text-start ms-4 mt-4 fw-bold">Links</h3>
          <ul className="m-0 py-1">
            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">Add Links</Link>
            </li>
          </ul>
        </div> */}

        {/* Right Side Content  */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* {/ Details /} */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-12">
              <div>
                <label className="text-dark Label">Lead Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.lead_owner}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Title</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.title || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;+{clientData.countryCode || ""}&nbsp;
                  {clientData.phone || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Lead Source</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.lead_source || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Land Line</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.land_line || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.company || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.amount || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.country || ""}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* {/ Hide Details /} */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Hide Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Lead Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Leads Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.lead_owner || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Title</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.title || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.phone || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {clientData.created_at
                    ? clientData.created_at.split("T")[0]
                    : "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {clientData.updated_at
                    ? clientData.updated_at.split("T")[0]
                    : "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Industry</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.industry || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.updated_by || "--"}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.company || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Lead Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{leadName || "--"}{" "}
                  {/* {clientData.last_name} */}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.email || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Website</label>
                <span className="text-dark">--</span>
              </div> */}

              <div>
                <label className="text-dark Label">Lead Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.lead_status || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Annual Revenue</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div>

              <div>
                <label className="text-dark Label">No of Employees</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div>

              <div>
                <label className="text-dark Label">Rating</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div> */}

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.created_by || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Skype Id</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.skype_id || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Twitter</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.twitter || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Secondary Email</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div> */}
            </div>

            {/* {/ Address Information /} */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
                {/* <button className="btn bg-info col-2 text-white">
                  Locate Map
                </button> */}
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.street || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.state || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.country || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.city || "--"}
                  </span>
                </div>

                <div>
                  <label className="text-dark Label">Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.zipCode || "--"}
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
                {/* <button className="btn bg-info col-2 text-white">
                  Locate Map
                </button> */}
              </div>



              <div className="container">
                <table className="table">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">S No</th>
                      <th scope="col">Appointment name</th>
                      <th scope="col">Start Date</th>
                      <th scope="col">End Date</th>
                      <th scope="col">Appointment Owner</th>
                      <th scope="col">Mode</th>
                      <th scope="col">Status</th>
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
                              <span className="badge text-bg-success">Online</span>
                            ) : (
                              <span className="badge text-bg-danger">Offline</span>
                            )}
                          </td>
                          <td>
                            <span>
                              {appointment.appointmentstatus !== null
                                ? appointment.appointmentstatus
                                : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7"></td>
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

              <div>
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.description_info || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* {/ Notes /} */}
          {/* <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Notes</span>
              </div>
              <div className="dropdown">
                <Link
                  className="btn border border-primary text-primary dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Recent Last
                </Link>
                <ul className="dropdown-menu">
                  <li className="mt-2"></li>
                </ul>
              </div>
            </div>

            <div className="container  col-12">
              <textarea
                className="form-control py-2 m-3 textarea"
                placeholder="'Add note...'"
              ></textarea>
            </div>
          </div> */}
        </div>
        {/* <Offcanvas
          show={show}
          onHide={handleClose}
          className="emailHeader"
          placement="end"
        >
          <Offcanvas.Header>
            New Message &nbsp;&nbsp;&nbsp;&nbsp;{" "}
            <button
              onClick={handleHide}
              className="btn"
              style={{ color: "#fff", fontSize: "20px" }}
            >
              x
            </button>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div
              className="d-flex align-items-center pb-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <img className="img-fluid" src={user} width={40} alt="user" />
              <p style={{ marginBottom: "0px" }}>
                {owner || "--"} ( {clientData.email || "--"} )
              </p>
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <p style={{ marginBottom: "0px" }}>
                <b style={{ color: "#424242" }}>To :</b>
              </p>
              <p style={{ marginBottom: "0px" }}>
                {clientData.first_name || "--"} {clientData.last_name || "--"} ({" "}
                {clientData.email || "--"} )
              </p>
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <input
                type="text"
                className="form-control"
                name="subject"
                id="subject"
                placeholder="Subject"
                style={{ border: "none" }}
              />
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <textarea
                class="form-control"
                placeholder="Mail Body"
                style={{ height: "250px", border: "none" }}
              ></textarea>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span
                style={{ minHeight: "80px", gap: "10px" }}
                className="d-flex align-items-center"
              >
                <span>
                  <label
                    htmlFor="file-input-1"
                    className="btn btn-outline-primary"
                  >
                    <GrAttachment />
                  </label>
                  <input
                    id="file-input-1"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept=".pdf, .doc, .docx, .txt"
                    multiple
                  />
                </span>
                <span>
                  <label
                    htmlFor="file-input-2"
                    className="btn btn-outline-primary"
                  >
                    <MdOutlineAddPhotoAlternate />
                  </label>
                  <input
                    id="file-input-2"
                    type="file"
                    onChange={handleFile2Change}
                    style={{ display: "none" }}
                    accept=".jpg, .jpeg, .png, .gif"
                    multiple
                  />
                </span>
              </span>
              <span className="d-flex" style={{ gap: "10px" }}>
                <div class="dropup-center">
                  <button
                    type="button"
                    class="btn"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ border: "none" }}
                  >
                    <IoMdTime /> Schedule
                  </button>
                  <ul class="dropdown-menu" style={{ width: "max-content" }}>
                    <li className="px-3">
                      <span>
                        <h6 className="mb-3">
                          <b>Schedule at</b>
                        </h6>
                      </span>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label class="form-check-label" for="flexRadioDefault1">
                          One hour from now
                        </label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label class="form-check-label" for="flexRadioDefault1">
                          Tomorrow Evening 8pm
                        </label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        Date <input type="date" /> &nbsp;&nbsp; Time{" "}
                        <input type="time" />
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-primary">Schedule</button>
                      </div>
                    </li>
                  </ul>
                </div>
                <button className="btn btn-primary">
                  Send <IoMdSend />
                </button>
              </span>
            </div>
            {selectedFiles.length > 0 && (
              <p className="mt-2" style={{ marginBottom: "0px" }}>
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </Offcanvas.Body>
        </Offcanvas> */}
      </section>
    </div>
  );
}

export default LeadsShow;
