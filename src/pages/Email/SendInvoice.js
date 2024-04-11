import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";
import user from "../../assets/user.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";

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

  const handleShow = () => setShow(true);

  const handleHide = () => {
    setShow(false);
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

  const generateHtmlContent = () => {
    let html = `<h1>Invoice Details</h1>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Tax: ${taxTotal.toFixed(2)}</p>
              <p>Total: ${grandTotal.toFixed(2)}</p>`;

    // Add address details
    if (
      invoiceData.dealsWithInvoice &&
      invoiceData.dealsWithInvoice.length > 0
    ) {
      const addressHtml = `
      <p><b>Shipping Address:</b></p>
      <p>Street: ${invoiceData.dealsWithInvoice[0].shippingStreet || "--"}</p>
      <p>State: ${invoiceData.dealsWithInvoice[0].shippingState || "--"}</p>
      <p>City: ${invoiceData.dealsWithInvoice[0].shippingCity || "--"}</p>
      <p>Code: ${invoiceData.dealsWithInvoice[0].shippingCode || "--"}</p>
      <p>Country: ${invoiceData.dealsWithInvoice[0].shippingCountry || "--"}</p>
      <br />
      <p><b>Billing Address:</b></p>
      <p>Street: ${invoiceData.dealsWithInvoice[0].billingStreet || "--"}</p>
      <p>State: ${invoiceData.dealsWithInvoice[0].billingState || "--"}</p>
      <p>City: ${invoiceData.dealsWithInvoice[0].billingCity || "--"}</p>
      <p>Code: ${invoiceData.dealsWithInvoice[0].billingCode || "--"}</p>
      <p>Country: ${invoiceData.dealsWithInvoice[0].billingCountry || "--"}</p>
      <br />
    `;
      html += addressHtml;
    }

    // Add product details
    if (
      invoiceData.productsWithInvoice &&
      invoiceData.productsWithInvoice.length > 0
    ) {
      const productsHtml = `
      <p><b>Products:</b></p>
      <table border="1">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Unit Price</th>
            <th>Quantity In Stock</th>
            <th>Tax</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.productsWithInvoice
            .map(
              (product) => `
            <tr>
              <td>${product.productName || "--"}</td>
              <td>${product.unitPrice || "--"}</td>
              <td>${product.quantityInStock || "--"}</td>
              <td>${product.tax || "--"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <br />
    `;
      html += productsHtml;
    }

    setHtmlContent(html);
    setIsSendingEmail(true);
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post(`${API_URL}sendMail`, {
        toMail: invoiceData?.dealsWithInvoice[0]?.email || "",
        fromMail: userEmail,
        subject: subject,
        htmlContent: htmlContent,
      });
      console.log(response.data);
      setIsSendingEmail(false);
    } catch (error) {
      console.error("Failed to send email:", error);
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
                invoiceData.dealsWithInvoice[0].email) ||
                "--"}
            </p>
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
                      {invoiceData.dealsWithInvoice[0].shippingCountry || "--"}
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
              <button
                className="btn btn-primary mt-4"
                onClick={generateHtmlContent}
              >
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
