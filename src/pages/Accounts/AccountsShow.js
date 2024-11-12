import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import SendQuotes from "../Email/SendQuotes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Appointment from "../Appointments/AppointmentsCreate";
import Activity from "./Activity";
import Delete from "../../components/common/DeleteModel";
import QuotesModel from "./QuotesModel";
import AppointmentsEdit from "../Appointments/AppointmentsEdit";

function AccountsShow() {
  const { id } = useParams();

  const role = sessionStorage.getItem("role");
  const [total, setTotal] = useState(0);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [accountData, setAccountData] = useState({});
  const [appointments, setAppointments] = useState([]);
  console.log(accountData);

  const navigate = useNavigate();

  const scheduleData = {
    model: "Accounts",
    id: id,
    appointmentName: `${accountData.firstName} ${accountData.lastName}`,
    email: accountData.email,
    phone: accountData.phone,
    city: accountData.shippingCity,
    state: accountData.shippingState,
    street: accountData.shippingStreet,
    zipCode: accountData.shippingCode,
    country: accountData.shippingCountry,
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
      setAppointments(response.data.appointmentModels);
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

  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

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
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1 gap-1" id="buttons-container">
          <button className="btn btn-primary">
            <QuotesModel
              userData={userData}
              path={`associateQuotesWithAccount/${id}`}
            />
          </button>
          <Activity id={id} />
          <SendQuotes accountData={accountData} />
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
        </div>
      </section>

      {/* Accounts Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* center Content */}
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
                <label className="text-dark Label">Account Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.accountOwner || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.email || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;+{accountData.countryCode || ""}&nbsp;
                  {accountData.phone || ""}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.companyName || ""}
                </span>
              </div>

              <div className="address-item">
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
              <div className="address-item">
                <label className="text-dark Label">Account Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.accountOwner || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;
                  {accountData.createdAt
                    ? accountData.createdAt.split("T")[0]
                    : ""}
                  &nbsp;
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;
                  {accountData.updatedAt
                    ? accountData.updatedAt.split("T")[0]
                    : ""}
                  &nbsp;
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.amount || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.firstName || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.email || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{accountData.createdBy || ""}
                </span>
              </div>
            </div>

            {/* Address Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Shipping Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingStreet || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingState || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingCity || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingCode || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.shippingCountry || ""}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Billing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingStreet || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingState || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingCity || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingCode || ""}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{accountData.billingCountry || ""}
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
                    {accountData.appointmentModels?.length > 0 ? (
                      accountData.appointmentModels.map((appointment, index) => (
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
                      <div className="col-12 d-flex justify-content-end">
                        <Delete
                          onSuccess={userData}
                          path={`unassignQuoteFromAccount/${id}?quotesId=${quote.id}`}
                        />
                      </div>
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
                                <div className="col-md-7 col-12">
                                  {" "}
                                  <label className="text-dark ">
                                    Sub Total(SGT)
                                  </label>
                                </div>
                                <div className="col-md-5 col-12">
                                  {" "}
                                  <span>: {quote.subTotal || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-7 col-12">
                                  {" "}
                                  <label className="text-dark ">
                                    Discount(%)
                                  </label>
                                </div>
                                <div className="col-md-5 col-12">
                                  {" "}
                                  <span>: {quote.txnDiscount || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-7 col-12">
                                  {" "}
                                  <label className="text-dark ">Tax(%)</label>
                                </div>
                                <div className="col-md-5 col-12">
                                  {" "}
                                  <span>: {quote.txnTax || "0"}.00</span>
                                </div>
                              </div>
                            </div>
                            <div className="container-fluid py-2">
                              <div className="row">
                                <div className="col-md-7 col-12">
                                  <label className="text-dark ">
                                    Grand Total(SGT)
                                  </label>
                                </div>
                                <div className="col-md-5 col-12">
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
