import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

import { Button, Offcanvas } from "react-bootstrap";
import { IoMdSend, IoMdTime } from "react-icons/io";
import user from "../../assets/user.png";
import { API_URL } from "../../Config/URL";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  subject: yup.string().required("*Subject is required"),
});
function SendQuotes({ accountData }) {
  const [show, setShow] = useState(false);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const [subject, setSubject] = useState("");
  const [loadIndicator, setLoadIndicator] = useState(false);
  // const [htmlContent, setHtmlContent] = useState("");
  // const [isSendingEmail, setIsSendingEmail] = useState(false);

  const formik = useFormik({
    initialValues: {
      subject: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoadIndicator(true);
        const response = await axios.post(`${API_URL}sendMail`, {
          toMail: accountData.email,
          fromMail: userEmail,
          subject: values.subject,
          htmlContent: generateInvoice(accountData.quotes),
        });

        if (response.status === 200) {
          toast.success("Mail sent successfully");
          handleHide();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email");
      } finally {
        setLoadIndicator(false); // Set loading indicator back to false after request completes
      }
    },
  });

  const handleShow = () => setShow(true);

  const handleHide = () => {
    setShow(false);
  };

  useEffect(() => {
    if (formik.values.subject && accountData.quotes) {
      const htmlContent = generateInvoice(accountData.quotes);
      formik.setFieldValue("htmlContent", htmlContent);
      formik.setFieldValue("isSendingEmail", true);
    }
  }, [formik.values.subject, accountData.quotes]);

  const generateInvoice = (quotes) => {
    if (!quotes || quotes.length === 0) {
      return "No quotes available";
    }
    const tableRows = quotes.map(
      (row, index) => `
        <div id="LABEL1" id="LABEL2" style="width: 150% !important">
          <br />
          <div style="display: flex">
            <label><b>Quote Name</b></label>
            <span>:&nbsp;&nbsp;${row.dealName || "--"}</span>

            <label><b>Subject</b></label>
            <span>:&nbsp;&nbsp;${row.subject || "--"}</span>
          </div>
        </div>
      
       <div style="max-width: 590px; overflow: auto; justify-content: space-around;">
            <table>
              <tr class="heading">
                <td style="white-space: nowrap;">S No</td>
                <td style="white-space: nowrap;">Product Name</td>
                <td style="white-space: nowrap;">Quantity</td>
                <td style="white-space: nowrap;">List Price</td>
                <td style="white-space: nowrap;">Amount</td>
                <td style="white-space: nowrap;">Discount</td>
                <td style="white-space: nowrap;">Tax</td>
                <td style="white-space: nowrap;">Total</td>
              </tr>
              
              ${
                row.quotesItemList &&
                row.quotesItemList
                  .map(
                    (product, productIndex) => `
                  <tr class="item">
                    <td>${productIndex + 1}</td>
                    <td>${product.productName || "--"}</td>
                    <td>${product.quantity || "--"}</td>
                    <td>${product.listPrice || "--"}</td>
                    <td>${product.amount || "--"}</td>
                    <td>${product.discount || 0}</td>
                    <td>${product.tax || "--"}</td>
                    <td>${product.total || "--"}</td>
                  </tr>
                `
                  )
                  .join("")
              }
            </table>
          </div>


      <div class="totals-div">
        <div class="totals-container">
          <div style="text-align: end">
            <label style="width: 40%; margin-right: 5px">Sub Total(SGT)</label>
            <span style="width: 23%; text-align: start"
              >&nbsp;:&nbsp; ${row.subTotal}</span
            >
          </div>
          <div style="text-align: end">
            <label style="width: 40%; margin-right: 5px">Discount(%)</label>
            <span style="width: 23%; text-align: start"
              >&nbsp;:&nbsp; ${row.txnDiscount}</span
            >
          </div>
          <div style="text-align: end">
            <label style="width: 40%; margin-right: 5px">Tax(%)</label>
            <span style="width: 23%; text-align: start"
              >&nbsp;:&nbsp; ${row.txnTax}</span
            >
          </div>
          <div style="text-align: end">
            <label style="width: 40%; margin-right: 5px">Grand Total(SGT)</label>
            <span style="width: 23%; text-align: start"
              >&nbsp;:&nbsp; ${row.grandTotal}</span
            >
          </div>
        </div>
      </div>
      
    `
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Invoice</title>
          <style>
          .invoice-box {
            font-size: 12px;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            line-height: 24px;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            color: #555;
            min-height: 100vh;
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
          #LABEL1 label {
            display: inline-block;
            width: 15%;
            padding: 5px;
          }
          #LABEL1 span {
            display: inline-block;
            width: 20%;
            padding: 5px;
          }
    
          #LABEL2 label {
            display: inline-block;
            width: 15%;
            padding: 5px;
          }
          #LABEL2 span {
            display: inline-block;
            width: 20%;
            padding: 5px;
          }

          .totals-div{
            text-align: end;
            margin-left: 60%;
            padding: 10px 0px;
           }

          .totals-container {
            max-width: 590px;
            overflow: auto;
            justify-content: end;
          }
      
          .totals-container div {
            display: flex;
            justify-content: end;
            align-items: center;
          }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png"
                          style="width: 75%; max-width: 180px;" alt="Logo">
                      </td>
                      <td class="third">
                        <b>Date:</b> 24-01-2024<br>
                        The Alexcier,
                        237 Alexandra Road,<br>
                        #04-10,
                        Singapore-159929.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
    
            ${tableRows.join("")}
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Button
          className="btn bg-primary bg-gradient mx-2 text-white shadow-none"
          onClick={handleShow}
        >
          Send Quotes
        </Button>

        <Offcanvas
          show={show}
          onHide={handleHide}
          className="emailHeader"
          placement="end"
        >
          <Offcanvas.Header>
            New Message &nbsp;&nbsp;&nbsp;&nbsp;
            <button
              onClick={handleHide}
              className="btn border-dark fw-bold"
              style={{ color: "#fff", fontSize: "20px" }}
            >
              x
            </button>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex align-items-center pb-3">
              <img className="img-fluid" src={user} width={40} alt="user" />
              <p style={{ marginBottom: "0px" }}>
                {userName || "--"}( {userEmail || "--"} )
              </p>
            </div>
            <div className="d-flex align-items-center py-3">
              <p className="m-0">
                <b style={{ color: "#424242" }}>To :</b>
              </p>
              <p className="m-0">{accountData.email || "--"}</p>
            </div>
            <div className="d-flex align-items-center py-3">
              <input
                type="text"
                name="subject"
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                style={{ border: "none" }}
                className={`form-control form-size  ${
                  formik.touched.subject && formik.errors.subject
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("subject")}
              />
            </div>
            <div className="col-6  sm-device">
              {formik.touched.subject && formik.errors.subject && (
                <div className="text-danger">{formik.errors.subject}</div>
              )}
            </div>

            <div className="d-flex align-items-center py-3">
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
                            {/* <tbody>
                          {quote.map((quote, index) => (
                            <tr key={quote.id}>
                              <td>{index + 1}</td>
                              <td>{quote.dealName || "--"}</td>
                              <td>{quote.subject || "--"}</td>
                              <td>{quote.quoteStage || "--"}</td>
                              <td>{quote.quoteOwner || "--"}</td>
                            </tr>
                          ))}
                        </tbody> */}
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
                  <p>No quotes available.</p>
                )}
              </div>
            </div>

            <div className="d-flex align-items-end justify-content-end">
              <span className="d-flex" style={{ gap: "10px" }}>
                <button
                  className="btn btn-primary mt-4"
                  onClick={formik.handleSubmit}
                >
                  {loadIndicator && (
                    <span
                      class="spinner-border spinner-border-sm me-2 "
                      aria-hidden="true"
                    ></span>
                  )}
                  Send
                  <IoMdSend className="ms-2 mb-1" />
                </button>
              </span>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </form>
    </div>
  );
}

export default SendQuotes;
