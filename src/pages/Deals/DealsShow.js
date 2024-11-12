import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Appointment from "../Appointments/AppointmentsCreate";
import SendInvoice from "../Email/SendInvoice";
import Delete from "../../components/common/DeleteModel";
import InvoiceModel from "./InvoiceModel";
import AppointmentsEdit from "../Appointments/AppointmentsEdit";

function DealsShow() {
  const { id } = useParams();
  const [dealData, setdealData] = useState({});

  const [invoiceData, setInvoiceData] = useState({});
  const [appointments, setAppointments] = useState([]);
  console.log("Deal Data:", dealData);
  // const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  const scheduleData = {
    model: "Deals",
    id: id,
    appointmentName: dealData.dealName,
    email: dealData.email,
    phone: dealData.phone,
    city: dealData.shippingCity,
    state: dealData.shippingState,
    street: dealData.shippingStreet,
    zipCode: dealData.shippingCode,
    country: dealData.shippingCountry,
  };

  const userData = async () => {
    try {
      const response = await axios(`${API_URL}allDeals/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const transformedData = Object.keys(response.data).reduce((acc, key) => {
        let value = response.data[key];

        if (key === "closingDate" && value) {
          const date = new Date(value);

          value = date.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          value = value.replace(/\d{4}$/, "2024");
        }

        acc[key] = value;
        return acc;
      }, {});
      setdealData(transformedData);
      setInvoiceData(response.data);
      setAppointments(response.data.appointmentModels);
      console.log("Account Show :", dealData);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/deals/edit/${id}`);
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
                    onClick={() => navigate("/deals")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          <button className="btn btn-primary">
            <InvoiceModel
              getData={userData}
              path={`associateInvoiceWithDeals/${id}`}
            />
          </button>
          {dealData.email && (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="button-tooltip-2" className="mailtip">
                  Send Email
                </Tooltip>
              }
            >
              <span>
                <SendInvoice invoiceData={invoiceData} id={id} />
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
            disabled={role === "CMP_USER"}
            onClick={handelEdit}
          >
            Edit
          </button>
        </div>
      </section>

      {/* Deals Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* center Content */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* Details */}
          {/* <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-12">
              <div className="address-item">
                <label className="text-dark Label">Deals Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.dealOwner || ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.email || ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.companyName || ""}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.amount || ""}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div> */}

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Details</span>
            </div>
            <div className="py-3">
              <span className="fs-6 fw-bold"> Deal Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Deals Owner
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.dealOwner || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Campaign Source
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.campaignSource || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Phone</label>
                <span className="col-6">
                  &nbsp; : &nbsp; + {dealData.countryCode || ""}&nbsp;
                  {dealData.phone || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Created At
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{" "}
                  {dealData.createdAt ? dealData.createdAt.split("T")[0] : ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Updated At
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;
                  {dealData.updatedAt ? dealData.updatedAt.split("T")[0] : ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Closing Date
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;
                  {dealData.closingDate || ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Probability
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.probability || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Deal Name</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.dealName || ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Phone Number
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;+{dealData.countryCode || ""}{" "}
                  {dealData.phone || ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Email</label>
                <span className="col-6 text-break">
                  &nbsp; : &nbsp;{dealData.email || ""}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Amount</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.amount || ""}
                </span>
              </div>

              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Stage</label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.stage || "--"}
                </span>
              </div>

              <div className="row mb-3">
                <label className="text-dark col-6 text-center">
                  Created By
                </label>
                <span className="col-6">
                  &nbsp; : &nbsp;{dealData.createdBy || "--"}
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

              <div className="container-fluid col-md-6">
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Shipping Street
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.shippingStreet || ""}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Shipping State
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;+{dealData.shippingState || ""}{" "}
                    {dealData.phone || ""}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Shipping City
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.shippingCity || ""}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Shipping Code
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.shippingCode || ""}
                  </span>
                </div>

                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Shipping Country
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.shippingCountry || "--"}
                  </span>
                </div>
              </div>

              <div className="container-fluid col-md-6">
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Billing Street
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.billingStreet || ""}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Billing State
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;+{dealData.billingState || ""}{" "}
                    {dealData.phone || ""}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Billing City
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.billingCity || ""}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Billing Code
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.billingCode || ""}
                  </span>
                </div>

                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">
                    Billing Country
                  </label>
                  <span className="col-6">
                    &nbsp; : &nbsp;{dealData.billingCountry || "--"}
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
                    {dealData.appointmentModels?.length > 0 ? (
                      dealData.appointmentModels.map((appointment, index) => (
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

            {/* Invoice Information Table*/}
            <div className="container-fluid row" id="Details">
              <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
                <div>
                  <span className="my-3 fs-6 fw-bold my-3">Invoice</span>
                </div>
              </div>

              <div className="container  col-12">
                {dealData.invoice ? (
                  <div>
                    {dealData.invoice &&
                      dealData.invoice.map((invoice) => (
                        <div key={invoice.id} className="row mt-4">
                          <div className="col-12 d-flex justify-content-end">
                            <Delete
                              onSuccess={userData}
                              path={`unassignInvoiceFromDeal/${id}?invoiceId=${invoice.id}`}
                            />
                          </div>
                          <div className="col-md-6 col-12">
                            <label className="text-dark">
                              <b>Invoice Owner</b>
                            </label>
                            <span className="text-dark">
                              &nbsp; : &nbsp;{invoice.invoiceOwner || "--"}
                            </span>
                          </div>
                          <div className="col-md-6 col-12">
                            <label className="text-dark Label">
                              <b>Subject</b>
                            </label>
                            <span className="text-dark">
                              &nbsp; : &nbsp;{invoice.subject || "--"}
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
                                {invoice.invoiceItemList &&
                                  invoice.invoiceItemList.map((item, index) => (
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
                                      <span>
                                        : {invoice.subTotal || "0"}.00
                                      </span>
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
                                      <span>
                                        : {invoice.txnDiscount || "0"}.00
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="container-fluid py-2">
                                  <div className="row">
                                    <div className="col-md-7 col-12">
                                      {" "}
                                      <label className="text-dark ">
                                        Tax(%)
                                      </label>
                                    </div>
                                    <div className="col-md-5 col-12">
                                      {" "}
                                      <span>: {invoice.txnTax || "0"}.00</span>
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
                                      <span>
                                        : {invoice.grandTotal || "0"}.00
                                      </span>
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
                  <p>No Invoice available.</p>
                )}
              </div>
            </div>

            {/* Description Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Description Information
                </span>
              </div>
              <div className="container-fluid col-md-12">
                <div className="row mb-3">
                  <label className="text-dark col-3 text-center">
                    Description
                  </label>
                  <span className="col-9">
                    &nbsp; : &nbsp;{dealData.descriptionInfo || "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes --*/}
        </div>
      </section>
    </>
  );
}

export default DealsShow;
