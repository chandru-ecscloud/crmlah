import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";
import user from "../../assets/user.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  subject: yup.string().required("*Subject is required"),
});

function SendInvoice({ invoiceData }) {
  const [show, setShow] = useState(false);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const formik = useFormik({
    initialValues: {
      subject: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      const generateHtmlContent = () => {
        let html = "";
        {
          const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
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
                            <img
                              src="https://ecscloudinfotech.com/ecs/static/media/logo1.9c3a01a2a3d275bf1c44.png"
                              style="width: 75%; max-width: 180px"
                              alt="Logo"
                            />
                          </td>
                          <td class="third">
                            <b>Date:</b> 24-01-2024<br />
                            The Alexcier, 237 Alexandra Road,<br />
                            #04-10, Singapore-159929.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
    
                <div  id="LABEL1" id="LABEL2" style="width: 150% !important;">
                <strong>Address :</strong>
                <br />
                <div style="display: flex;">
                  <label>Billing Street</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].billingStreet || "--"
                  }</span>
          
                  <label>Billing City</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].billingCity || "--"
                  }</span>
                </div>
          
                <div style="display: flex">
                  <label>Billing State</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].billingState || "--"
                  }</span>
          
                  <label>Billing Code</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].billingCode || "--"
                  }</span>
                </div>
                
                <div style="display: flex">
                  <label>Billing Country</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].billingCountry || "--"
                  }</span>
                </div>
              </div>
              <br/>
              <div  id="LABEL2" style="width: 150% !important;">
               
                  <div style="display: flex;">
                  <label>Shipping Street</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].shippingStreet || "--"
                  }</span>
          
                  <label>Shipping City</label>
                  <span>:&nbsp;&nbsp;${
                    invoiceData.dealsWithInvoice[0].shippingCity || "--"
                  }</span>
                  </div>
          
                  <div style="display: flex">
                    <label>Shipping State</label>
                    <span>:&nbsp;&nbsp;${
                      invoiceData.dealsWithInvoice[0].shippingState || "--"
                    }</span>
          
                    <label>Shipping Code</label>
                    <span>:&nbsp;&nbsp;${
                      invoiceData.dealsWithInvoice[0].shippingCode || "--"
                    }</span>
                  </div>
                    
                  <div style="display: flex">
                    <label>Shipping Country</label>
                    <span>:&nbsp;&nbsp;${
                      invoiceData.dealsWithInvoice[0].shippingCountry || "--"
                    }</span>
                  </div>
                </div>
              
                <br />
    
                <div style="max-width: 590px; overflow: auto">
                  <table>
                    <tr class="heading">
                      <td style="white-space: nowrap">S No</td>
                      <td style="white-space: nowrap">Product Name</td>
                      <td style="white-space: nowrap">Price</td>
                      <td style="white-space: nowrap">Quantity</td>
                      <td style="white-space: nowrap">Tax</td>
                    </tr>
                    ${invoiceData.productsWithInvoice
                      .map(
                        (product, index) => `
                            <tr>
                            <td>${index + 1 || "--"}</td>
                            <td>${product.productName || "--"}</td>
                            <td>${product.unitPrice || "--"}</td>
                            <td>${product.quantityInStock || "--"}</td>
                            <td>${product.tax || "--"}</td>
                            </tr>
                            `
                      )
                      .join("")}
                  </table>
                </div>
    
                <table style="margin-top: 20px; border: 1px solid #eee">
                  <tr>
                    <td style="width: 75%">
                      <b>Sub Total</b>
                    </td>
                    <td>${subtotal || "--"}
                    </td>
                  </tr>
                </table>
    
                <table style="margin-top: 20px; border: 1px solid #eee">
                  <tr>
                    <td style="width: 75%">
                      <b>Tax Total</b>
                    </td>
                    <td>${taxTotal|| "--"}</td>
                  </tr>
                </table>
    
                <table style="margin-top: 20px; border: 1px solid #eee">
                  <tr>
                    <td style="width: 75%">
                      <b>Grand Total</b>
                    </td>
                    <td>${grandTotal || "--"}</td>
                  </tr>
                </table>
    
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 20px;
                  "
                >
                  <div style="width: 50%"></div>
                  <div style="width: 50%; text-align: end">
                  <div><strong style="margin-right: 34px;margin-bottom: 10px;">ECSCloud CRM</strong><br/></div>
                  
                    <div>
                      <img
                        src="https://www.sgitjobs.com/HomeInsteadFinalUI/public/assets/images/QR.png"
                        alt="Advantage"
                        class="img-fluid"
                        width="50%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>
    
        `;
          html += htmlContent;
        }
        setHtmlContent(html);
        setIsSendingEmail(true);
      };
      generateHtmlContent();
    },
  });

  const handleShow = () => setShow(true);

  const handleHide = () => {
    setShow(false)
    setSubject("")
  };

  useEffect(() => {
    // This calculates totals whenever invoiceData changes.
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData]);

  useEffect(() => {
    // This effect triggers the email sending process when HTML content is set and we're ready to send.
    if (htmlContent && isSendingEmail) {
      sendEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlContent, isSendingEmail]);

  const calculateTotals = () => {
    if (invoiceData && invoiceData.productsWithInvoice) {
      const totalUnitPrice = invoiceData.productsWithInvoice.reduce(
        (total, product) => total + (product.unitPrice || 0),
        0
      );

      const totalTax = invoiceData.productsWithInvoice.reduce(
        (total, product) =>
          total + ((product.unitPrice || 0) * (product.tax || 0)) / 100,
        0
      );

      setSubtotal(totalUnitPrice);
      setTaxTotal(totalTax);
      setGrandTotal(totalUnitPrice + totalTax);
    } else {
      setSubtotal(0);
      setTaxTotal(0);
      setGrandTotal(0);
    }
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post(`${API_URL}sendMail`, {
        toMail: invoiceData?.dealsWithInvoice[0]?.email || "",
        fromMail: userEmail,
        subject: formik.values.subject,
        htmlContent: htmlContent,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        toast.success("Mail Send Successfully");
        handleHide();
      } else {
        toast.error(response.data.message);
      }
      setIsSendingEmail(false);
    } catch (error) {
      toast.error("Mail Not Send");
      // console.error("Failed to send email:", error);
      setIsSendingEmail(false); // Reset on error
    }
  };

  return (
    <div>
      <Button
        className="btn bg-primary bg-gradient mx-2 text-white shadow-none"
        onClick={handleShow}
      >
        Send Invoice
      </Button>

      <Offcanvas
        show={show}
        // onHide={handleHide}
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
          <form onSubmit={formik.handleSubmit}>
            <div className="d-flex align-items-center pb-3">
              <img className="img-fluid" src={user} width={40} alt="user" />
              &nbsp;
              <p style={{ marginBottom: "0px" }}>
                {userName || "--"}( {userEmail || "--"} )
              </p>
            </div>
            <div className="d-flex align-items-center py-3">
              <p className="m-0">
                <b style={{ color: "#424242" }}>To :</b>
              </p>
              <p className="m-0">
                {(invoiceData.dealsWithInvoice &&
                  invoiceData.dealsWithInvoice.length > 0 &&
                  invoiceData.dealsWithInvoice[0].email) ||
                  "--"}
              </p>
            </div>
            <div className="d-flex align-items-center py-3">
              <input
                type="text"
                name="subject"
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                style={{ border: "none" }}
                className={`form-control  ${
                  formik.touched.subject && formik.errors.subject
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("subject")}
              />
            </div>
            <div>
                {formik.touched.subject && formik.errors.subject && (
                    <p className="text-danger">{formik.errors.subject}</p>
                  )}
              </div>
            <p className="my-2 fs-5 fw-bold" style={{ color: "#424242" }}>
              Address
            </p>
            <div className="row container-fluid m-auto">
              <div className="col-md-6 col-12 d-flex align-items-center justify-content-end ">
                {invoiceData.dealsWithInvoice &&
                  invoiceData.dealsWithInvoice.length > 0 && (
                    <div className="row d-flex">
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Shipping Street </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].shippingStreet || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Shipping State </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].shippingState || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Shipping City </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].shippingCity || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Shipping Code </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].shippingCode || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Shipping Country </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].shippingCountry ||
                          "--"}
                      </div>
                      <p className="mb-2"></p>
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 d-flex align-items-center justify-content-end ">
                {invoiceData.dealsWithInvoice &&
                  invoiceData.dealsWithInvoice.length > 0 && (
                    <div className="row d-flex">
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Billing Street </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].billingStreet || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Billing State </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].billingState || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Billing City </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].billingCity || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Billing Code </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].billingCode || "--"}
                      </div>
                      <p className="mb-1"></p>
                      <div className="col-6 d-flex justify-content-between">
                        <p className="m-0">Billing Country </p>
                        <p className="m-0">:</p>
                      </div>
                      <div className="col-6">
                        {" "}
                        {invoiceData.dealsWithInvoice[0].billingCountry || "--"}
                      </div>
                      <p className="mb-2"></p>
                    </div>
                  )}
              </div>
            </div>

            <div className="d-flex align-items-center py-3">
              <div className="container col-12">
                {invoiceData && invoiceData.productsWithInvoice ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="text-center bg-secondary text-white">
                        <tr>
                          <th scope="col" className="bg-secondary text-white">
                            S.No
                          </th>
                          <th scope="col" className="bg-secondary text-white">
                            Product Name
                          </th>
                          <th scope="col" className="bg-secondary text-white">
                            Unit Price
                          </th>
                          <th scope="col" className="bg-secondary text-white">
                            Quantity In Stock
                          </th>
                          <th scope="col" className="bg-secondary text-white">
                            Tax
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {invoiceData.productsWithInvoice.map(
                          (product, index) => (
                            <tr key={product.id}>
                              <td>{index + 1}</td>
                              <td>{product.productName || "--"}</td>
                              <td>{product.unitPrice || "--"}</td>
                              <td>{product.quantityInStock || "--"}</td>
                              <td>{product.tax || "--"}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No quotes available.</p>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12"></div>
              <div className="col-md-6 col-12">
                <div
                  style={{ border: "1px solid #c4c4c4", borderRadius: "4px" }}
                  className="p-2 mb-2"
                >
                  <div className="row">
                    <div className="col-6 d-flex justify-content-between">
                      <p style={{ marginBottom: "0px" }}>Sub Total </p>
                      <p style={{ marginBottom: "0px" }}>:</p>
                    </div>
                    <div className="col-6"> {subtotal}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12"></div>
              <div className="col-md-6 col-12">
                <div
                  style={{ border: "1px solid #c4c4c4", borderRadius: "4px" }}
                  className="p-2 mb-2"
                >
                  <div className="row">
                    <div className="col-6 d-flex justify-content-between">
                      <p style={{ marginBottom: "0px" }}>Tax Total </p>
                      <p style={{ marginBottom: "0px" }}>:</p>
                    </div>
                    <div className="col-6"> {taxTotal}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12"></div>
              <div className="col-md-6 col-12">
                <div
                  style={{ border: "1px solid #c4c4c4", borderRadius: "4px" }}
                  className="p-2 mb-2"
                >
                  <div className="row">
                    <div className="col-6 d-flex justify-content-between">
                      <p style={{ marginBottom: "0px" }}>Grand Total </p>
                      <p style={{ marginBottom: "0px" }}>:</p>
                    </div>
                    <div className="col-6"> {grandTotal}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-end justify-content-end">
              <span className="d-flex" style={{ gap: "10px" }}>
                <button type="submit" className="btn btn-primary mt-4">
                  Send
                  <IoMdSend className="ms-2 mb-1" />
                </button>
              </span>
            </div>
            </form>
          </Offcanvas.Body>
      
      </Offcanvas>

    </div>
  );
}

export default SendInvoice;
