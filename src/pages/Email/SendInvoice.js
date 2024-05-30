import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";
import user from "../../assets/user.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { MdErrorOutline } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";

const validationSchema = yup.object().shape({
  subject: yup.string().required("*Subject is required"),
});

function SendInvoice({ invoiceData, id }) {
  const [show, setShow] = useState(false);

  console.log("Invoice Data Mail:", invoiceData.email);
  console.log("Invoice Data Mail ID:", id);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const formik = useFormik({
    initialValues: {
      subject: "",
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // try {
      //   const generateHtmlContent = () => {
      //     setLoadIndicator(true);
      //     let html = "";
      //     {
      //       const htmlContent = `
      //     <!DOCTYPE html>
      //     <html lang="en">
      //       <head>
      //         <meta charset="UTF-8" />
      //         <title>Invoice</title>
      //         <style>
      //           .invoice-box {
      //             font-size: 12px;
      //             max-width: 600px;
      //             margin: auto;
      //             padding: 30px;
      //             border: 1px solid #eee;
      //             line-height: 24px;
      //             font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
      //             color: #555;
      //             min-height: 100vh;
      //           }
    
      //         .invoice-box table {
      //           width: 100%;
      //           line-height: inherit;
      //           text-align: left;
      //         }
    
      //         .invoice-box table td {
      //           padding: 5px;
      //           vertical-align: top;
      //         }
    
      //         .invoice-box table td.third {
      //           text-align: right;
      //         }
    
      //         .invoice-box table tr.heading td {
      //           background: #eee;
      //           border-bottom: 1px solid #ddd;
      //           font-weight: bold;
      //         }
    
      //         .invoice-box table tr.item td {
      //           border-bottom: 1px solid #eee;
      //         }
    
      //         .invoice-box table tr.item.last td {
      //           border-bottom: none;
      //         }
    
      //         .invoice-box table tr.total td:nth-child(2) {
      //           border-top: 2px solid #eee;
      //           font-weight: bold;
      //         }
    
      //         #scan {
      //           float: right;
      //         }
    
      //         #scan img {
      //           max-width: 100%;
      //           height: auto;
      //         }
    
      //         @media print {
      //           .invoice-box {
      //             border: 0;
      //           }
      //         }
      //         #LABEL1 label {
      //           display: inline-block;
      //           width: 15%;
      //           padding: 5px;
      //         }
      //         #LABEL1 span {
      //           display: inline-block;
      //           width: 20%;
      //           padding: 5px;
      //         }
    
      //         #LABEL2 label {
      //           display: inline-block;
      //           width: 15%;
      //           padding: 5px;
      //         }
      //         #LABEL2 span {
      //           display: inline-block;
      //           width: 20%;
      //           padding: 5px;
      //         }
      //       </style>
      //       </head>
      //       <body>
      //         <div class="invoice-box">
      //           <table>
      //             <tr class="top">
      //               <td colspan="2">
      //                 <table>
      //                   <tr>
      //                   <td class="title">
      //                   <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png"
      //                     style="width: 75%; max-width: 180px;" alt="Logo">
      //                 </td>
      //                     <td class="third">
      //                       <b>Date:</b> 24-01-2024<br />
      //                       The Alexcier, 237 Alexandra Road,<br />
      //                       #04-10, Singapore-159929.
      //                     </td>
      //                   </tr>
      //                 </table>
      //               </td>
      //             </tr>
      //           </table>
    
      //           <div  id="LABEL1" id="LABEL2" style="width: 150% !important;">
      //           <strong>Address :</strong>
      //           <br />
      //           <div style="display: flex;">
      //             <label>Billing Street</label>
      //             <span>:&nbsp;&nbsp;${invoiceData.billingStreet || "--"}</span>
          
      //             <label>Billing City</label>
      //             <span>:&nbsp;&nbsp;${invoiceData.billingCity || "--"}</span>
      //           </div>
          
      //           <div style="display: flex">
      //             <label>Billing State</label>
      //             <span>:&nbsp;&nbsp;${invoiceData.billingState || "--"}</span>
          
      //             <label>Billing Code</label>
      //             <span>:&nbsp;&nbsp;${invoiceData.billingCode || "--"}</span>
      //           </div>
                
      //           <div style="display: flex">
      //             <label>Billing Country</label>
      //             <span>:&nbsp;&nbsp;${
      //               invoiceData.billingCountry || "--"
      //             }</span>
      //           </div>
      //         </div>
      //         <br/>
      //         <div  id="LABEL2" style="width: 150% !important;">
               
      //             <div style="display: flex;">
      //             <label>Shipping Street</label>
      //             <span>:&nbsp;&nbsp;${
      //               invoiceData.shippingStreet || "--"
      //             }</span>
          
      //             <label>Shipping City</label>
      //             <span>:&nbsp;&nbsp;${invoiceData.shippingCity || "--"}</span>
      //             </div>
          
      //             <div style="display: flex">
      //               <label>Shipping State</label>
      //               <span>:&nbsp;&nbsp;${
      //                 invoiceData.shippingState || "--"
      //               }</span>
          
      //               <label>Shipping Code</label>
      //               <span>:&nbsp;&nbsp;${
      //                 invoiceData.shippingCode || "--"
      //               }</span>
      //             </div>
                    
      //             <div style="display: flex">
      //               <label>Shipping Country</label>
      //               <span>:&nbsp;&nbsp;${
      //                 invoiceData.shippingCountry || "--"
      //               }</span>
      //             </div>
      //           </div>
              
      //           <br />
    
      //           <div style="max-width: 590px; overflow: auto">
      //             <table>
      //               <tr class="heading">
      //                 <td style="white-space: nowrap">S No</td>
      //                 <td style="white-space: nowrap">Product Name</td>
      //                 <td style="white-space: nowrap">Quantity</td>
      //                 <td style="white-space: nowrap">Price</td>
      //                 <td style="white-space: nowrap">Amount</td>
      //                 <td style="white-space: nowrap">Discount</td>
      //                 <td style="white-space: nowrap">Tax</td>
      //                 <td style="white-space: nowrap">Total Amount</td>
      //               </tr>
      //               ${invoiceData.invoiceItemList
      //                 .map(
      //                   (product, index) => `
      //                       <tr>
      //                       <td>${index + 1}</td>
      //                       <td>${product.productName || "--"}</td>
      //                       <td>${product.quantity || "--"}</td>
      //                       <td>${product.listPrice || "--"}</td>
      //                       <td>${product.amount || "--"}</td>
      //                       <td>${product.discount || "--"}</td>
      //                       <td>${product.tax || "--"}</td>
      //                       <td>${product.total || "--"}</td>
      //                       </tr>
      //                       `
      //                 )
      //                 .join("")}
      //             </table>
      //           </div>
    
      //           <table style="margin-top: 20px; border: 1px solid #eee">
      //             <tr>
      //               <td style="width: 75%">
      //                 <b>Sub Total</b>
      //               </td>
      //               <td>${invoiceData.subTotal || "--"}
      //               </td>
      //             </tr>
      //           </table>
    
      //           <table style="margin-top: 20px; border: 1px solid #eee">
      //             <tr>
      //               <td style="width: 75%">
      //                 <b>Tax Total</b>
      //               </td>
      //               <td> ${invoiceData.txnTax || "--"}</td>
      //             </tr>
      //           </table>
    
      //           <table style="margin-top: 20px; border: 1px solid #eee">
      //             <tr>
      //               <td style="width: 75%">
      //                 <b>Grand Total</b>
      //               </td>
      //               <td>${invoiceData.grandTotal || "--"}</td>
      //             </tr>
      //           </table>
    
      //           <div
      //             style="
      //               display: flex;
      //               align-items: center;
      //               justify-content: center;
      //               margin-top: 20px;
      //             "
      //           >
      //             <div style="width: 50%"></div>
      //             <div style="width: 50%; text-align: end">
      //             <div><strong style="margin-right: 34px;margin-bottom: 10px;">ECSCloud CRM</strong><br/></div>
                  
      //               <div>
      //                 <img
      //                   src="https://www.sgitjobs.com/HomeInsteadFinalUI/public/assets/images/QR.png"
      //                   alt="Advantage"
      //                   class="img-fluid"
      //                   width="50%"
      //                 />
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </body>
      //     </html>
    
      //   `;
      //       html += htmlContent;
      //     }
      //     setHtmlContent(html);
      //     setIsSendingEmail(true);
      //   };
      //   generateHtmlContent();
      //   const response = await axios.post(`${API_URL}sendMail`, {
      //     toMail: invoiceData.email || "",
      //     fromMail: userEmail,
      //     subject: values.subject,
      //     htmlContent: htmlContent,
      //   });

      //   if (response.status === 200) {
      //     toast.success(response.data.message);
      //     handleHide();
      //   } else {
      //     toast.error(response.data.message);
      //   }
      //   setIsSendingEmail(false);
      //   setSubmitting(false);
      //   setLoadIndicator(false);
      // } catch (error) {
      //   toast.error("Mail Not Send");
      //   console.error("Failed to send email:", error);
      //   setIsSendingEmail(false); // Reset on error
      //   setSubmitting(false);
      //   setLoadIndicator(false);
      // }

      try {
        setLoadIndicator(true);
        const response = await axios.post(`${API_URL}sendMail`, {
          toMail: invoiceData.email,
          fromMail: userEmail,
          subject: values.subject,
          htmlContent: generateInvoice(invoiceData.transactionInvoiceModels),
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
        setLoadIndicator(false);
      }
    },
  });

  const handleShow = () => setShow(true);

  const handleHide = () => {
    setShow(false);
    setSubject("");
  };

  // const handleFileChange = (event) => {
  //   const files = Array.from(event.target.files);
  //   formik.setFieldValue("files", [...formik.values.files, ...files]);
  // };

  // useEffect(() => {
  //   // This effect triggers the email sending process when HTML content is set and we're ready to send.
  //   if (htmlContent && isSendingEmail) {
  //     sendEmail();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [htmlContent, isSendingEmail]);

  // const sendEmail = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}sendMail`, {
  //       toMail: invoiceData.email || "",
  //       fromMail: userEmail,
  //       subject: formik.values.subject,
  //       htmlContent: htmlContent,
  //     });

  //     if (response.status === 200) {
  //       toast.success(response.data.message);
  //       toast.success("Mail Send Successfully");
  //       handleHide();
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //     setIsSendingEmail(false);
  //   } catch (error) {
  //     toast.error("Mail Not Send");
  //     // console.error("Failed to send email:", error);
  //     setIsSendingEmail(false); // Reset on error
  //   }
  // };


  useEffect(() => {
    if (formik.values.subject && invoiceData.transactionInvoiceModels) {
      const htmlContent = generateInvoice(invoiceData.transactionInvoiceModels);
      formik.setFieldValue("htmlContent", htmlContent);
      formik.setFieldValue("isSendingEmail", true);
    }
  }, [formik.values.subject, invoiceData.transactionInvoiceModels]);


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
              <span>:&nbsp;&nbsp;${
                invoiceData.billingCountry || "--"
              }</span>
            </div>
          </div>
          <br/>
          <div  id="LABEL2" style="width: 150% !important;">
            
              <div style="display: flex;">
              <label>Shipping Street</label>
              <span>:&nbsp;&nbsp;${
                invoiceData.shippingStreet || "--"
              }</span>
       
              <label>Shipping City</label>
              <span>:&nbsp;&nbsp;${invoiceData.shippingCity || "--"}</span>
              </div>
       
              <div style="display: flex">
                <label>Shipping State</label>
                <span>:&nbsp;&nbsp;${
                  invoiceData.shippingState || "--"
                }</span>
       
                <label>Shipping Code</label>
                <span>:&nbsp;&nbsp;${
                  invoiceData.shippingCode || "--"
                }</span>
              </div>
                 
              <div style="display: flex">
                <label>Shipping Country</label>
                <span>:&nbsp;&nbsp;${
                  invoiceData.shippingCountry || "--"
                }</span>
              </div>
            </div>
           
            <br />
            ${tableRows.join("")}
          </div>
        </body>
      </html>
    `;
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
            <div className="d-flex align-items-center pb-3">
              <img className="img-fluid" src={user} width={40} alt="user" />
              &nbsp;
              <p style={{ marginBottom: "0px" }}>
                {userName || "--"}( {userEmail || "--"} )
              </p>
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

            <div className="d-flex align-items-end justify-content-between">
              <div
                style={{ minHeight: "80px", gap: "10px" }}
                className="d-flex align-items-end"
              >
                {/* <span>
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
                  {formik.values.files.length > 0 ? (
                    <span>
                      &nbsp;{formik.values.files.length} files selected
                    </span>
                  ) : (
                    <span className="text-danger">
                      &nbsp;
                      <MdErrorOutline className="text-danger" />
                      &nbsp;{formik.errors.files}
                    </span>
                  )}
                </span> */}
              </div>
              <span className="d-flex" style={{ gap: "10px" }}>
                <button type="submit" className="btn btn-primary mt-4">
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
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendInvoice;
