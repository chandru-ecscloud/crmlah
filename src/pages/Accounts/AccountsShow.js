import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { IoLink, IoSend } from "react-icons/io5";
import { FaShareAlt, FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
import SendQuotes from "../Email/SendQuotes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Appointment from "../Appointments/AppointmentsCreate";
import Activity from "./Activity";


function AccountsShow() {
  const { id } = useParams();

  const role = sessionStorage.getItem("role");
  const [total, setTotal] = useState(0);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [accountData, setAccountData] = useState({});
  console.log(accountData);

  const navigate = useNavigate();

  const scheduleData = {
    model: "Accounts",
    id: id,
    appointmentName: accountData.accountName,
    email: accountData.email,
  };
  const userData = async () => {
    try {
      const response = await axios(`${API_URL}allAccounts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setAccountData(response.data);
      console.log(accountData.quotes);
      // console.log("Account Show :",response.data.quotes.productsWithQuote      );
      setTotal(response.data.quotes ? response.data.quotes.length : 0);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/accounts/edit/${id}`);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                    onClick={() => navigate("/accounts")}
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
          <Activity />
          <SendQuotes accountData={accountData} />
          <Appointment
            name={"schedule"}
            schedule={scheduleData}
            getData={userData}
          />
          {accountData.email && (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="button-tooltip-2">Send Email</Tooltip>}
            >
              <span>
                <SendEmail toEmail={accountData.email} />
              </span>
            </OverlayTrigger>
          )}
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

      {/* Accounts Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
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
                  &nbsp; : &nbsp;&nbsp;+{accountData.countryCode || ""}&nbsp;
                  {accountData.phone || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.companyName || ""}
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
              <div>
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;
                  {accountData.createdAt
                    ? accountData.createdAt.split("T")[0]
                    : ""}
                  &nbsp;
                </span>
              </div>
              <div>
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;
                  {accountData.updatedAt
                    ? accountData.updatedAt.split("T")[0]
                    : ""}
                  &nbsp;
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Title</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.title || "--"}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.phone || "--"}
                </span>
              </div> */}

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
              <div>
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.amount || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.firstName || "--"}
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
                {/* <button className="btn bg-info col-2 text-white">
                  Locate Map
                </button> */}
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
                <span className="my-3 fs-6 fw-bold my-3">Quotes</span>
              </div>
            </div>

            <div className="container  col-12">
              {accountData.quotes ? (
                <div>
                  {accountData.quotes.map((quote) => (
                    <div key={quote.id} className="row mt-4">
                      <div className="col-md-6 col-12">
                        <label className="text-dark">
                          <b>Quote Name</b>
                        </label>
                        <span className="text-dark">
                          &nbsp; : &nbsp;{quote.dealName || "--"}
                        </span>
                      </div>
                      <div className="col-md-6 col-12">
                        <label className="text-dark Label">
                          <b>Subject</b>
                        </label>
                        <span className="text-dark">
                          &nbsp; : &nbsp;{quote.subject || "--"}
                        </span>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-secondary">
                            <tr>
                              <th scope="col">S.No</th>
                              <th scope="col">Product Name</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">List Price</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Discount</th>
                              <th scope="col">Tax</th>
                              <th scope="col">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quote.quotesItemList &&
                              quote.quotesItemList.map((item, index) => (
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.productName || "--"}</td>
                                  <td>{item.quantity || "--"}</td>
                                  <td>{item.listPrice || "--"}</td>
                                  <td>{item.amount || "--"}</td>
                                  <td>{item.discount || 0}</td>
                                  <td>{item.tax || "--"}</td>
                                  <td>{item.total || "--"}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="container-fluid p-3">
                        <div className="row">
                          <div className="col-md-7 col-12"></div>
                          <div className="col-md-5 col-12 border rounded">
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-8 col-12">
                                  {" "}
                                  <label className="text-dark ">
                                    Sub Total(SGT)
                                  </label>
                                </div>
                                <div className="col-md-4 col-12">
                                  {" "}
                                  <span>: {quote.subTotal || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-8 col-12">
                                  {" "}
                                  <label className="text-dark ">
                                    Discount(%)
                                  </label>
                                </div>
                                <div className="col-md-4 col-12">
                                  {" "}
                                  <span>: {quote.txnDiscount || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-8 col-12">
                                  {" "}
                                  <label className="text-dark ">Tax(%)</label>
                                </div>
                                <div className="col-md-4 col-12">
                                  {" "}
                                  <span>: {quote.txnTax || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-8 col-12">
                                  <label className="text-dark ">
                                    Grand Total(SGT)
                                  </label>
                                </div>
                                <div className="col-md-4 col-12">
                                  <span>: {quote.grandTotal || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // <div></div>
                <p>No quotes available.</p>
              )}
            </div>
          </div>

          {/* Notes -- */}
        </div>
      </section>
    </>
  );
}

export default AccountsShow;
