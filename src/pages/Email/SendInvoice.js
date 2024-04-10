import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

import { Button, Offcanvas } from "react-bootstrap";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend, IoMdTime } from "react-icons/io";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import user from "../../assets/user.png";
import { API_URL } from "../../Config/URL";

function SendInvoice({ invoiceData }) {
  console.log(invoiceData);
  const [htmlContent, setHtmlContent] = useState("");
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const [subject, setSubject] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  console.log("SubTotal", subtotal);
  console.log("Tax", taxTotal);
  console.log("GrandTotal", grandTotal);

  useEffect(() => {
    calculateTotals();
  }, [invoiceData]);

  // const calculateTotals = () => {
  //   if (invoiceData && invoiceData.productsWithInvoice) {
  //     const totalUnitPrice = invoiceData.productsWithInvoice.reduce(
  //       (total, product) => total + (product.unitPrice || 0),
  //       0
  //     );

  //     const totalTax = invoiceData.productsWithInvoice.reduce(
  //       (total, product) => total + (product.tax || 0),
  //       0
  //     );

  //     setSubtotal(totalUnitPrice);
  //     setTaxTotal(totalTax);
  //     setGrandTotal(totalUnitPrice + totalTax);
  //   } else {
  //     setSubtotal(0);
  //     setTaxTotal(0);
  //     setGrandTotal(0);
  //   }
  // };

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

  const handleShow = () => setShow(true);
  const handleHide = () => {
    setSelectedFiles([]);
    setShow(false);
  };

  useEffect(() => {
    generateInvoice(invoiceData);
  }, []);

  const generateInvoice = (data) => {
    if (data && data.productsWithInvoice && data.dealsWithInvoice) {
      const tableRows = data.productsWithInvoice.map(
        (row, index) => `
          <tr class="item">
            <td>${index + 1}</td>
            <td>${row.productName || "--"}</td>
            <td>${row.unitPrice || "--"}</td>
            <td>${row.quantityInStock || "--"}</td>
            <td>${row.tax || "--"}</td>
          </tr>
        `
      );

      const addressRows = data.dealsWithInvoice.map(
        (row) => `
      <div  id="LABEL1" id="LABEL2" style="width: 150% !important;">
        <strong>Billing Information:</strong>
        <br />
        <div style="display: flex;">
          <label>Billing Street</label>
          <span>:&nbsp;&nbsp;${row.billingStreet || "--"}</span>

          <label>Billing City</label>
          <span>:&nbsp;&nbsp;${row.billingCity || "--"}</span>
        </div>

        <div style="display: flex">
          <label>Billing State</label>
          <span>:&nbsp;&nbsp;${row.billingState || "--"}</span>

          <label>Billing Code</label>
          <span>:&nbsp;&nbsp;${row.billingCode || "--"}</span>
        </div>
        
        <div style="display: flex">
          <label style="width: 24%;">Billing Country</label>
          <span>:&nbsp;&nbsp;${row.billingCountry || "--"}</span>
        </div>
      </div>
      <br/>
      <div  id="LABEL2" style="width: 150% !important;">
        <strong>Shipping Information:</strong>
        <br />
          <div style="display: flex;">
          <label>Shipping Street</label>
          <span>:&nbsp;&nbsp;${row.shippingStreet || "--"}</span>

          <label>Shipping City</label>
          <span>:&nbsp;&nbsp;${row.shippingCity || "--"}</span>
          </div>

          <div style="display: flex">
            <label>Shipping State</label>
            <span>:&nbsp;&nbsp;${row.shippingState || "--"}</span>

            <label>Shipping Code</label>
            <span>:&nbsp;&nbsp;${row.shippingCode || "--"}</span>
          </div>
            
          <div style="display: flex">
            <label style="width: 27%;">Shipping Country</label>
            <span>:&nbsp;&nbsp;${row.shippingCountry || "--"}</span>
          </div>
        </div>
        `
      );

      // New One
      const invoiceHTML = `
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
              width: 53%;
              padding: 5px;
            }
            #LABEL1 span {
              display: inline-block;
              width: 50%;
              padding: 5px;
            }
      
            #LABEL2 label {
              display: inline-block;
              width: 68%;
              padding: 5px;
            }
            #LABEL2 span {
              display: inline-block;
              width: 50%;
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

            <div style="width: 60%; text-align: start">
              ${addressRows.join("")}
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
                ${tableRows.join("")}
              </table>
            </div>

            <table style="margin-top: 20px; border: 1px solid #eee">
              <tr>
                <td style="width: 75%">
                  <b>Sub Total</b>
                </td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
            </table>

            <table style="margin-top: 20px; border: 1px solid #eee">
              <tr>
                <td style="width: 75%">
                  <b>Tax Total</b>
                </td>
                <td>${taxTotal.toFixed(2)}</td>
              </tr>
            </table>

            <table style="margin-top: 20px; border: 1px solid #eee">
              <tr>
                <td style="width: 75%">
                  <b>Grand Total</b>
                </td>
                <td>${grandTotal.toFixed(2)}</td>
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

      // OLD One
      //   const invoiceHTML = `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //     <head>
      //       <meta charset="UTF-8">
      //       <title>Invoice</title>
      //       <style>
      //         .invoice-box {
      //           font-size: 12px;
      //           max-width: 600px;
      //           margin: auto;
      //           padding: 30px;
      //           border: 1px solid #eee;
      //           line-height: 24px;
      //           font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      //           color: #555;
      //         }

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
      //       </style>
      //     </head>
      //     <body>
      //       <div class="invoice-box">
      //         <table>
      //           <tr class="top">
      //             <td colspan="2">
      //               <table>
      //                 <tr>
      //                   <td class="title">
      //                     <img src="https://ecscloudinfotech.com/ecs/static/media/logo1.9c3a01a2a3d275bf1c44.png"
      //                       style="width: 75%; max-width: 180px;" alt="Logo">
      //                   </td>
      //                   <td class="third">
      //                     <b>Date:</b> 24-01-2024<br>
      //                     The Alexcier,
      //                     237 Alexandra Road,<br>
      //                     #04-10,
      //                     Singapore-159929.
      //                   </td>
      //                 </tr>
      //               </table>
      //             </td>
      //           </tr>
      //         </table>

      //         <div style="max-width: 590px; overflow: auto;">
      //           <table>
      //             <tr class="heading">
      //               <td style="white-space: nowrap;">S No</td>
      //               <td style="white-space: nowrap;">Product Name</td>
      //               <td style="white-space: nowrap;">Subject</td>
      //               <td style="white-space: nowrap;">Quotes Stage</td>
      //               <td style="white-space: nowrap;">Quotes Owner</td>
      //             </tr>
      //             ${tableRows.join("")}
      //           </table>
      //         </div>
      //         <div class="totals">
      //         <div>
      //           <p>Sub Total:</p>
      //           <p>${subtotal.toFixed(2)}</p>
      //         </div>
      //         <div>
      //           <p>Tax Total:</p>
      //           <p>${taxTotal.toFixed(2)}</p>
      //         </div>
      //         <div>
      //           <p>Grand Total:</p>
      //           <p>${grandTotal.toFixed(2)}</p>
      //         </div>
      //       </div>
      //       </div>
      //     </body>
      //   </html>
      // `;

      setHtmlContent(invoiceHTML);
    } else {
      setHtmlContent("");
    }
  };

  const sendInvoice = async (data) => {
    // console.log("from is", userEmail);
    // console.log("to address is", invoiceData.dealsWithInvoice.email);
    // console.log("quotes is", htmlContent);
    // console.log("subject is", subject);

    try {
      const response = await axios.post(
        `${API_URL}sendMail`,
        {
          toMail: invoiceData.dealsWithInvoice.email,
          fromMail: userEmail,
          subject: subject,
          htmlContent: htmlContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        toast.success("Mail Send Successfully");
        handleHide();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}

      <Button
        className="btn bg-primary bg-gradient mx-2 text-white shadow-none"
        onClick={handleShow}
      >
        Send Invoice
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
            <p className="m-0">{invoiceData.email || "--"}</p>
          </div>
          <div className="d-flex align-items-center py-3">
            <input
              type="text"
              className="form-control"
              name="subject"
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              style={{ border: "none" }}
            />
          </div>
          <p className="my-2 fs-5 fw-bold" style={{ color: "#424242" }}>
            Address
          </p>
          <div className="row container-fluid m-auto">
            <div className="col-md-6 col-12 d-flex align-items-center justify-content-end ">
              {invoiceData.dealsWithInvoice &&
                invoiceData.dealsWithInvoice.map((address) => (
                  <div key={address.id} className="row d-flex">
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Shipping Street </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6">
                      {" "}
                      {address.shippingStreet || "--"}
                    </div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Shipping State </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6">
                      {" "}
                      {address.shippingState || "--"}
                    </div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Shipping City </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6"> {address.shippingCity || "--"}</div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Shipping Code </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6"> {address.shippingCode || "--"}</div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Shipping Country </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6">
                      {" "}
                      {address.shippingCountry || "--"}
                    </div>
                    <p className="mb-2"></p>
                  </div>
                ))}
            </div>

            <div className="col-md-6 col-12 d-flex align-items-center justify-content-end ">
              {invoiceData.dealsWithInvoice &&
                invoiceData.dealsWithInvoice.map((address) => (
                  <div key={address.id} className="row d-flex">
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Billing Street </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6">
                      {" "}
                      {address.billingStreet || "--"}
                    </div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Billing State </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6"> {address.billingState || "--"}</div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Billing City </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6"> {address.billingCity || "--"}</div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Billing Code </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6"> {address.billingCode || "--"}</div>
                    <p className="mb-1"></p>
                    <div className="col-6 d-flex justify-content-between">
                      <p className="m-0">Billing Country </p>
                      <p className="m-0">:</p>
                    </div>
                    <div className="col-6">
                      {" "}
                      {address.billingCountry || "--"}
                    </div>
                    <p className="mb-2"></p>
                  </div>
                ))}
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
                      {invoiceData.productsWithInvoice.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>{product.productName || "--"}</td>
                          <td>{product.unitPrice || "--"}</td>
                          <td>{product.quantityInStock || "--"}</td>
                          <td>{product.tax || "--"}</td>
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
              <button className="btn btn-primary mt-4" onClick={sendInvoice}>
                Send
                <IoMdSend className="ms-2 mb-1" />
              </button>
            </span>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendInvoice;
