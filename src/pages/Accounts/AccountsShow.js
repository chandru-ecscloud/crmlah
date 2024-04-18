import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";

import { Modal } from "react-bootstrap";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { IoLink, IoSend } from "react-icons/io5";
import { FaShareAlt, FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
import SendQuotes from "../Email/SendQuotes";
import { Tooltip, Zoom } from "@mui/material";
import Appointment from '../Appointments/AppointmentsCreate'

function AccountsShow() {
  const { id } = useParams();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [total, setTotal] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [accountData, setAccountData] = useState({});
  
  const navigate = useNavigate();
  const scheduleData ={
    model :"Accounts",
    id : id,
    appointmentName: accountData.accountName ,
    email:accountData.email

  }
  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allAccounts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        setAccountData(response.data);
        console.log("Account Show :",response.data);
        setTotal(response.data.quotes ? response.data.quotes.length : 0);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/accounts/edit/${id}`);
  };

  // const openEmailPopup = () => {
  //   setShowModal(true);
  // };

  // const closeEmailPopup = () => {
  //   setShowModal(false);
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  // };

  return (
    <>
      {/* header section */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-3 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <Tooltip TransitionComponent={Zoom} title="Back">
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/accounts")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </Tooltip>
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
          <SendQuotes accountData={accountData} />
          <Appointment name={"schedule"} schedule={scheduleData}/>
          {accountData.email && <SendEmail toEmail={accountData.email} />}

          <button
            className={`btn btn-warning ms-2 ${role === "CMP_USER" && "disabled"}`}
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

      {/* Accounts Information Section */}
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
              <Link className="py-3">
                <span>Quotes </span>
                <span class="badge text-bg-danger">{total}</span>
              </Link>
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

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Account Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.accountOwner || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.email || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;{accountData.countryCode || ""}&nbsp;
                  {accountData.phone || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Mobile</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.mobile || "--"}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Account Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.account_status || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.company || ""}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.billingCountry || ""}
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
              <span className="fs-6 fw-bold"> Account Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Account Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.accountOwner || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Title</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.title || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.phone || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Lead Source</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.lead_source || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Industry</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.industry || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.updatedBy || "--"}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6">
              {/* <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.company || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.accountName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.email || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Fax</label>
                <span className="text-dark">--</span>
              </div>

              <div>
                <label className="text-dark Label">Website</label>
                <span className="text-dark">--</span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Account Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.status || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Annual Revenue</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div>

              <div>
                <label className="text-dark Label">No of Employees</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div> */}

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.createdBy || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Skype Id</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.skype_id || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Twitter</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.twitter || ""}
                </span>
              </div> */}
            </div>

            {/* Address Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
                <button className="btn bg-info col-2 text-white">
                  Locate Map
                </button>
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Shipping Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingStreet || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingState || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingCity || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingCode || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingCountry || ""}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Billing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingStreet || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingState || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingCity || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingCode || ""}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingCountry || ""}
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
                  &nbsp; : &nbsp;{accountData.descriptionInfo || ""}
                </span>
              </div>
            </div>
          </div>

          {/* Quotes Information Table*/}
          <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Notes</span>
              </div>
            </div>

            <div className="container  col-12">
              {accountData.quotes ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Deal Name</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Quote Stage</th>
                        <th scope="col">Quote Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountData.quotes.map((quote, index) => (
                        <tr key={quote.id}>
                          <td>{index + 1}</td>
                          <td>{quote.dealName || "--"}</td>
                          <td>{quote.subject || "--"}</td>
                          <td>{quote.quoteStage || "--"}</td>
                          <td>{quote.quoteOwner || "--"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No quotes available.</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="container-fluid row" id="Details">
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
          </div>
        </div>
      </section>
    </>
  );
}

export default AccountsShow;
