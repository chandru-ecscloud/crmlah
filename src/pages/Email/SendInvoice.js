import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";
import user from "../../assets/user.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaDownload } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import CompanyLogo from "../../assets/CMPLogoNew.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

const validationSchema = yup.object().shape({
  subject: yup.string().required("*Subject is required"),
  // files: yup.array().min(1, "Attacment is Must").required("Attacment is Must"),
});

function SendInvoice({ invoiceData, id }) {
  const [show, setShow] = useState(false);

  console.log("Invoice Data Mail:", invoiceData);
  console.log("Invoice Data Mail ID:", id);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  const [subject, setSubject] = useState("");
  // const [htmlContent, setHtmlContent] = useState("");
  // const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const formik = useFormik({
    initialValues: {
      subject: "",
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("to", invoiceData.email);
        formData.append("from", userEmail);
        formData.append("subject", values.subject);
        formData.append("htmlContent", generateInvoice(invoiceData.invoice));
        values.files.forEach((file) => {
          formData.append("files", file);
        });
        setLoadIndicator(true);
        const response = await axios.post(
          `${API_URL}sendMailWithHtmlContentAndAttachment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Mail sent successfully");
          handleHide();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const handleShow = () => setShow(true);

  const handleHide = () => {
    setShow(false);
    setSubject("");
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("files", [...formik.values.files, ...files]);
  };

  useEffect(() => {
    if (formik.values.subject && invoiceData.invoice) {
      const htmlContent = generateInvoice(invoiceData.invoice);
      formik.setFieldValue("htmlContent", htmlContent);
      formik.setFieldValue("isSendingEmail", true);
    }
  }, [formik.values.subject, invoiceData.invoice]);

  const generateInvoice = (invoice) => {
    if (!invoice || invoice.length === 0) {
      return "No invoice available";
    }
    const tableRows = invoice.map(
      (row, index) => `
        <div id="LABEL1" id="LABEL2" style="width: 150% !important">
          <br />
          <div style="display: flex">
            <label><b>Quote Name</b></label>
            <span>:&nbsp;&nbsp;${row.invoiceOwner || "--"}</span>

            <label><b>Subject</b></label>
            <span>:&nbsp;&nbsp;${row.subject || "--"}</span>
          </div>
        </div>
        <br />
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
                row.invoiceItemList &&
                row.invoiceItemList
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

       <div id="LABEL1" id="LABEL2" style="width: 150% !important">
          <br />
          <div>
            <label><b>Customer Note :</b></label>
            <div>&nbsp;&nbsp;${row.description || "--"}</div>
          </div>
          <br />
          <div>
            <label><b>Terms And Conditions :</b></label>
            <div>&nbsp;&nbsp;${row.termsAndConditions || "--"}</div>
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
            <div  id="LABEL1" id="LABEL2" style="width: 150% !important;">
            <strong>Address :</strong>
            <br />
            <div style="display: flex;">
              <label>Billing Street</label>
              <span>:&nbsp;&nbsp;${invoiceData.billingStreet || "--"}</span>
       
              <label>Billing City</label>
              <span>:&nbsp;&nbsp;${invoiceData.billingCity || "--"}</span>
            </div>
       
            <div style="display: flex">
              <label>Billing State</label>
              <span>:&nbsp;&nbsp;${invoiceData.billingState || "--"}</span>
       
              <label>Billing Code</label>
              <span>:&nbsp;&nbsp;${invoiceData.billingCode || "--"}</span>
            </div>
             
            <div style="display: flex">
              <label>Billing Country</label>
              <span>:&nbsp;&nbsp;${invoiceData.billingCountry || "--"}</span>
            </div>
          </div>
          <br/>
          <div  id="LABEL2" style="width: 150% !important;">
            
              <div style="display: flex;">
              <label>Shipping Street</label>
              <span>:&nbsp;&nbsp;${invoiceData.shippingStreet || "--"}</span>
       
              <label>Shipping City</label>
              <span>:&nbsp;&nbsp;${invoiceData.shippingCity || "--"}</span>
              </div>
       
              <div style="display: flex">
                <label>Shipping State</label>
                <span>:&nbsp;&nbsp;${invoiceData.shippingState || "--"}</span>
       
                <label>Shipping Code</label>
                <span>:&nbsp;&nbsp;${invoiceData.shippingCode || "--"}</span>
              </div>
                 
              <div style="display: flex">
                <label>Shipping Country</label>
                <span>:&nbsp;&nbsp;${invoiceData.shippingCountry || "--"}</span>
              </div>
            </div>
           
            <br />
            ${tableRows.join("")}
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = (action = "download") => {
    const dealData = invoiceData?.invoice;
    console.log("quotesData -> Quotes List:", dealData);

    if (!dealData || dealData.length === 0) {
      return "No Invoice available";
    }

    const doc = new jsPDF();
    doc.addImage(CompanyLogo, "Logo", 13, 15, 52, 10); // x, y, width, height

    doc.setFont("helvetica", "normal");
    doc.setFontSize(28);
    doc.text("INVOICE", 155, 22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("ECS Cloud Infotech Pte Ltd", 13, 30);

    doc.setFont("helvetica", "small");
    doc.setFontSize(10);
    doc.text("The Alexcier", 13, 35);
    doc.text("237 Alexandra Road #04-10", 13, 40);
    doc.text("Singapore 159929", 13, 45);
    doc.text("Singapore", 13, 50);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 13, 65);
    doc.setFontSize(10);
    doc.setFont("helvetica", "small");
    doc.text(`${invoiceData.billingStreet}`, 13, 70);
    doc.text(`${invoiceData.billingCity}`, 13, 75);
    doc.text(`${invoiceData.billingCode}`, 13, 80);
    doc.text(`${invoiceData.billingCountry}`, 13, 85);

    let startY = 95; // Starting Y position for the quotes tables

    dealData.forEach((invoice, index) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Invoice ${index + 1}`, 13, startY);
      doc.setFontSize(10);
      doc.setFont("helvetica", "small");
      doc.text(`Subject: ${invoice.subject}`, 13, startY + 5);
      doc.text(`Deal Name: ${invoice.dealName}`, 13, startY + 10);

      // Add the table
      const tableData = invoice.invoiceItemList?.map((row, rowIndex) => [
        rowIndex + 1,
        row.productName,
        row.quantity,
        row.listPrice,
        row.amount,
        row.discount,
        row.tax,
        row.total,
      ]);

      doc.autoTable({
        startY: startY + 20,
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
          fontStyle: "normal",
        },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        head: [
          [
            "S.No",
            "Product Name",
            "Quantity",
            "Price",
            "Amount",
            "Discount",
            "Tax",
            "Total",
          ],
        ],
        body: tableData,
        footStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "normal",
        },
        foot: [
          [
            "",
            "",
            "",
            "",
            "",
            "",
            "Sub Total(SGT)",
            `: ${invoice.subTotal || "0"}`,
          ],
          [
            "",
            "",
            "",
            "",
            "",
            "",
            "Discount(%)",
            `: ${invoice.txnDiscount || "0"}`,
          ],
          ["", "", "", "", "", "", "Tax(%)", `: ${invoice.txnTax || "0"}`],
          [
            "",
            "",
            "",
            "",
            "",
            "",
            "Grand Total(SGT)",
            `: ${invoice.grandTotal || "0"}`,
          ],
        ],
      });

      const finalY = doc.lastAutoTable.finalY + 10;

      // Wrap the Notes text
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Customer Notes", 13, finalY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const notesText = doc.splitTextToSize(`${invoice.description}`, 180); // 180 is the width
      doc.text(notesText, 13, finalY + 6);

      const nextY = finalY + 6 + notesText.length * 10; // Adjust next Y position

      // Wrap the Terms & Conditions text
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Terms & Conditions", 13, nextY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const termsText = doc.splitTextToSize(
        `${invoice.termsAndConditions}`,
        180
      ); // 180 is the width
      doc.text(termsText, 13, nextY + 6);

      startY = nextY + 6 + termsText.length * 10; // Update the Y position for the next invoice
    });

    // Save the PDF
    // doc.save("Invoice.pdf");
    if (action === "download") {
      doc.save("Invoice.pdf");
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    } else if (action === "open") {
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  return (
    <div>
      <Button
        className="btn bg-primary bg-gradient mx-2 text-white shadow-none"
        onClick={handleShow}
        disabled={role === "CMP_USER"}
      >
        Send Invoice
      </Button>

      <Offcanvas
        show={show}
        //  onHide={handleHide}
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
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center pb-3">
                <img className="img-fluid" src={user} width={40} alt="user" />
                &nbsp;
                <p style={{ marginBottom: "0px" }}>
                  {userName || "--"}( {userEmail || "--"} )
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <div
                  style={{ minHeight: "80px", gap: "10px" }}
                  className="d-flex align-items-center"
                >
                  <span>
                    {formik.values.files.length > 0 ? (
                      <span>&nbsp;{formik.values.files.length} files</span>
                    ) : (
                      <span className="text-danger">
                        &nbsp;
                        {/* <MdErrorOutline className="text-danger" /> */}
                        &nbsp;{formik.errors.files}
                      </span>
                    )}{" "}
                    &nbsp;
                    <label
                      htmlFor="file-input"
                      className="btn btn-outline-primary"
                    >
                      <GrAttachment />
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      name="files"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      multiple
                      accept=".jpg, .jpeg, .png, .gif, .pdf, .txt"
                    />
                  </span>
                </div>
                <div className="mx-2">
                  <div className="mx-2">
                    <div
                      className="dropdown btn-outline-danger mx-1"
                      style={{ cursor: "pointer" }}
                    >
                      <button
                        className="btn btn-outline-danger bg-white shadow-none dropdown-toggle pdfdowenload"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FaDownload className="mx-1 text-danger fs-5 pdf" />
                      </button>
                      <ul className="dropdown-menu">
                        <li
                          className="dropdown-item"
                          onClick={() => generatePDF("download")}
                        >
                          Download PDF
                        </li>
                        <li
                          className="dropdown-item"
                          onClick={() => generatePDF("open")}
                        >
                          Open PDF
                        </li>
                        <li
                          className="dropdown-item"
                          onClick={() => generatePDF("print")}
                        >
                          Print PDF
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <span className="d-flex" style={{ gap: "10px" }}>
                  <button
                    type="submit"
                    className="btn btn-primary "
                    onClick={formik.handleSubmit}
                  >
                    {loadIndicator && (
                      <span
                        class="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      ></span>
                    )}
                    Send
                    <IoMdSend className="ms-2 mb-1" />
                  </button>
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center py-3">
              <p className="m-0">
                <b style={{ color: "#424242" }}>To : &nbsp;</b>
              </p>
              <p className="m-0">{invoiceData.email || "--"}</p>
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
            <div className="row container-fluid m-auto mb-3">
              <div className="col-md-6 col-12 d-flex align-items-center justify-content-end ">
                <div className="row d-flex">
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Shipping Street </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.shippingStreet || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Shipping State </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.shippingState || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Shipping City </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.shippingCity || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Shipping Code </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.shippingCode || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Shipping Country </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.shippingCountry || "--"}
                  </div>
                  <p className="mb-2"></p>
                </div>
              </div>

              <div className="col-md-6 col-12 d-flex align-items-center justify-content-end ">
                <div className="row d-flex">
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Billing Street </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.billingStreet || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Billing State </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.billingState || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Billing City </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.billingCity || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Billing Code </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.billingCode || "--"}
                  </div>
                  <p className="mb-1"></p>
                  <div className="col-6 d-flex justify-content-between">
                    <p className="m-0">Billing Country </p>
                    <p className="m-0">:</p>
                  </div>
                  <div className="col-6">
                    {" "}
                    {invoiceData.billingCountry || "--"}
                  </div>
                  <p className="mb-2"></p>
                </div>
              </div>
            </div>

            {/* Invoice Information Table*/}
            <p className="my-2 fs-5 fw-bold" style={{ color: "#424242" }}>
              Invoice
            </p>
            <div className="container-fluid row" id="Details">
              <div className="container  col-12">
                {invoiceData.invoice ? (
                  <div>
                    {invoiceData.invoice.map((invoice) => (
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
                                    <span>
                                      : {invoice.txnDiscount || "0"}.00
                                    </span>
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
                  <p>No quotes available.</p>
                )}
              </div>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendInvoice;
