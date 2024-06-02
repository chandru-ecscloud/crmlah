import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
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
                {/*<img
                  className="img-fluid"
                  style={{ width: "5rem" }}
                  src={USER}
                  alt="profile"
                />*/}
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          {contactData.email && (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="button-tooltip-2">Send Email</Tooltip>}
            >
              <span>
                <SendEmail toEmail={contactData.email} />
              </span>
            </OverlayTrigger>
          )}
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
        {/* left Side Content */}
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
            <li className="mt-2">
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

        {/* Right Side Content */}
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
              <div>
                <label className="text-dark Label">Contact Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contactOwner || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.email || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;+{contactData.countryCode || ""}&nbsp;
                  {contactData.phone || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.companyName || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.amount || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Contact Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contactOwner || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contactOwner || ""}
                </span>
              </div> */}

              <div>
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
              <div>
                <label className="text-dark Label">Contact Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contactOwner || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Contact Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {`${contactData.firstName}${contactData.lastName}`}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.phone || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {contactData.createdAt
                    ? contactData.createdAt.split("T")[0]
                    : ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {contactData.updatedAt
                    ? contactData.updatedAt.split("T")[0]
                    : ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Mobile</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.mobile || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Contact Source</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contact_source || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Industry</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.company || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Annual Revenue</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.anual_revenue || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.updatedBy || ""}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6">
              {/* <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.company || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Contact Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contact_name || ""}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.email || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Website</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.website || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Contact Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.contact_status || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">No of Employees</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.employees || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Rating</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.rating || ""}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.createdBy || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Skype Id</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.skypeId || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Twitter</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.twitter || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Secondary Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.secondary_email || ""}
                </span>
              </div> */}
            </div>

            {/* Address Information */}
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
                    &nbsp; : &nbsp;{contactData.mailingStreet || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingState || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingCountry || ""}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingCity || ""}
                  </span>
                </div>

                <div>
                  <label className="text-dark Label">Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{contactData.mailingZip || ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Description Information
                </span>
              </div>

              <div>
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{contactData.descriptionInfo || ""}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {/* <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Notes</span>
              </div>
              <div className="dropdown">
                <Link
                  className="btn border border-dark dropdown-toggle"
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

          {/* Attachments */}
          {/* <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Attachments</span>
              </div>
              <div className="dropdown">
                <Link
                  className="btn border text-primary border-primary dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Attach
                </Link>
                <ul className="dropdown-menu">
                  <li className="mt-2"></li>
                </ul>
              </div>
            </div>
            <hr />

            <div className="container text-center col-12 py-2">
              <span className="fw-bold my-3 Label" style={{ fontSize: "13px" }}>
                {" "}
                No Attachment{" "}
              </span>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
}

export default ContactShow;
