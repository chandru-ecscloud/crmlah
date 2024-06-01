import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Appointment from "../Appointments/AppointmentsCreate";
import SendInvoice from "../Email/SendInvoice";
function DealsShow() {
  const { id } = useParams();
  const [dealData, setdealData] = useState({});
  
  const [invoiceData, setInvoiceData] = useState({});
  console.log("Invoice Data:",invoiceData.transactionInvoiceModels);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  const scheduleData = {
    model: "Deals",
    id: id,
    appointmentName: dealData.dealName,
    email: dealData.email,
  };

  const userData = async () => {
    try {
      const response = await axios(`${API_URL}allDeals/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
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
      console.log("Account Show :", dealData);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    userData();
  }, [id]);

  // useEffect(() => {
  //   if (invoiceData.transactionInvoiceModels && invoiceData.transactionInvoiceModels.invoiceItemList) {
  //     console.log("Invoice Data:", invoiceData.transactionInvoiceModels.invoiceItemList[0]);
  //   } else {
  //     console.log("Invoice Data is not yet available");
  //   }
  // }, [invoiceData]);

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
          {dealData.email && (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="button-tooltip-2" className="mailtip">Send Email</Tooltip>}
            >
              <span>
                {/* <SendEmail toEmail={dealData.email} /> */}
                <SendInvoice invoiceData={invoiceData} id={id} />
              </span>
            </OverlayTrigger>
          )}
          <Appointment
            name={"schedule"}
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

      {/* Deals Information Section */}
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
                <label className="text-dark Label">Deals Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.dealOwner || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.email || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.companyName || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.amount || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.phone || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Mobile</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.mobile || "--"}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Deal Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.dealStatus || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.company || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.country || ""}
                </span>
              </div>*/}
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Hide Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Deal Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Deals Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.dealOwner || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Title</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.title || "--"}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.phone || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Lead Source</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.leadSource || ""}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Campaign Source</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.campaignSource || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {dealData.createdAt ? dealData.createdAt.split("T")[0] : ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {dealData.updatedAt ? dealData.updatedAt.split("T")[0] : ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Industry</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.industry || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Closing Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.closingDate || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.updatedBy || "--"}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6">
              {/*  <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.company || ""}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Deal Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.dealName || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Phone Number</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.countryCode || ""} {dealData.phone || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.email || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Website</label>
                <span className="text-dark">--</span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Contact Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.contactName || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.accountName || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Fax</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.fax || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Amount</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.amount || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Stage</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.stage || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Annual Revenue</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div> */}

              <div>
                <label className="text-dark Label">Probability</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.probability || ""}
                </span>
              </div>

              {/* <div>
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
                  &nbsp; : &nbsp;{dealData.createdBy || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Skype Id</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.skypeId || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Twitter</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{dealData.twitter || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Secondary Email</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
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
                    &nbsp; : &nbsp;{dealData.shippingStreet || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.shippingState || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.shippingCity || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.shippingCode || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.shippingCountry || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Billing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.billingStreet || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.billingState || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.billingCity || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.billingCode || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{dealData.billingCountry || "--"}
                  </span>
                </div>
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
              {invoiceData.transactionInvoiceModels ? (
                <div>
                  {invoiceData.transactionInvoiceModels.map((invoice) => (
                    <div key={invoice.id} className="row mt-4">
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
                                <div className="col-md-8 col-12">
                                  {" "}
                                  <label className="text-dark ">
                                    Sub Total(SGT)
                                  </label>
                                </div>
                                <div className="col-md-4 col-12">
                                  {" "}
                                  <span>: {invoice.subTotal || "0"}.00</span>
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
                                  <span>: {invoice.txnDiscount || "0"}.00</span>
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
                                  <span>: {invoice.txnTax || "0"}.00</span>
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
                                  <span>: {invoice.grandTotal || "0"}.00</span>
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
                  &nbsp; : &nbsp;{dealData.descriptionInfo || "--"}
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
      </section>
    </>
  );
}

export default DealsShow;
