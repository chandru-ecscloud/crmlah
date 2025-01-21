import { useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Success from "../../assets/success.png";
import html2canvas from "html2canvas";
import Companylogo from "../../assets/ECS_logo.png";
import rightCircle from "../../assets/pdf_circle.png";
// import rightCircle from "../../assets/pdf_circle.png";
import bottomCircle from "../../assets/bottom_pdf_circle_.png";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const OrderId = queryParams.get("OrderId");
  const orderDataString = queryParams.get("info");
  if (!OrderId) {
    navigate("/");
  }
  const data = orderDataString
    ? JSON.parse(decodeURIComponent(orderDataString))
    : null;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  console.log("datas", data);

  const contentRef = useRef();

  const downloadAsPdf = () => {
    const content = contentRef.current;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions for the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`${data?.orderId}.pdf`);
    });
  };
  return (
    <div className="container py-2 position-relative">
      <div
        className="row justify-content-center"
        style={{ marginTop: "4.5rem" }}
      >
        <div className="col-12">
          <div className="p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src={Success}
                className="img-fluid img-responsive success-img"
                alt="Success"
                style={{ maxHeight: "6em" }}
              />
            </div>
            <span
              className="badge rounded-pill mt-3"
              style={{
                backgroundColor: "#d4edda",
                color: "#28A745",
                fontWeight: "lighter",
              }}
            >
              Payment Successful
            </span>
            <p className="mt-3 h5 fw-semibold" style={{ marginBottom: "6rem" }}>
              Your payment has been successfully
              <br /> processed!
            </p>
            <span
              className="mt-3 mb-0"
              style={{ fontWeight: "500", cursor: "pointer", color: "#28A745" }}
              onClick={downloadAsPdf}
            >
              Download Invoice
            </span>
            <p className="mt-3 mb-0 fw-bold">Note:</p>
            <p className="success-note">
              Please do not refresh or close this page.
            </p>
            <a href="https://ecsaio.in/internship" className="text-muted">
              Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* pdf */}
      <div
        className="container"
        ref={contentRef}
        style={{
          backgroundColor: "#ffffff",
          padding: "22px",
          width: "794px",
          height:"auto",
          position: "absolute",
          top: "-9999px",       
          left: "-9999px",
        }}
      >
        <div
          className=""
          style={{
            maxHeight: "auto",
            backgroundColor: "#ffffff",
            backgroundImage: `url(${rightCircle}),url(${bottomCircle})`,
            backgroundSize: "311px 203px, 401px 213px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right top ,left bottom",
            border: "1px solid #afd0fe",
            position: "relative",
            margin: "auto",
            padding: "32px",
            fontSize: "16px",
            lineHeight: "24px",
            fontFamily: "'Inter', sans-serif",
            color: "#555",
          }}
        >
          <div className="row mt-2">
            <div className="col-6 d-flex justify-content-start align-items-center">
              <h1 className="fw-bold text-dark">INVOICE</h1>
            </div>
            <div className="col-6 d-flex justify-content-end align-items-center">
              <div className="text-end">
                <img
                  src={Companylogo}
                  alt="Company Logo"
                  className="img-fluid w-50"
                  style={{
                    marginBottom: "10px",
                  }}
                />
                <p className="text-dark" style={{ fontSize: "14px" }}>
                  766,Sakthi Tower Ln, Anna Salai,
                  <br /> Thousand Lights, Chennai - 02
                </p>
              </div>
            </div>
          </div>
          <div className="row " style={{margin:"5rem 0 0 0"}}>
            <div className="col-7" style={{ borderLeft: "3px solid #3284fd" }}>
              <div className="row" style={{ color: "#5E6470" }}>
                <div className="col-3">
                  <p className="mb-2 text-dark fw-semibold">Client</p>
                </div>
                <div className="col-auto">
                  <p className="mb-2  text-dark fw-semibold">
                    : &nbsp;
                    {data?.TransactionData[0]?.additionalInfo?.additional_info1
                      ?.split(":")[1]
                      .trim()}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p className="mb-2">Address</p>
                </div>
                <div className="col-auto">
                  <p className="mb-2">
                    : &nbsp;
                    {data?.TransactionData[0]?.additionalInfo?.additional_info5
                      ?.split(":")[1]
                      .trim()}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p className="mb-2">Contact</p>
                </div>
                <div className="col-auto">
                  <p className="mb-2">
                    : &nbsp;
                    {data?.TransactionData[0]?.additionalInfo?.additional_info3
                      ?.split(":")[1]
                      .trim()}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p className="mb-0">Email</p>
                </div>
                <div className="col-auto">
                  <p className="mb-0">
                    : &nbsp;
                    {data?.TransactionData[0]?.additionalInfo?.additional_info2
                      ?.split(":")[1]
                      .trim()}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-5">
              {/* <div
                className="row"
                style={{ color: "#5E6470", borderLeft: "3px solid #3284fd" }}
              >
                <div className="col-4">
                  <p className="mb-2 text-dark fw-semibold">Invoice No</p>
                </div>
                <div className="col-auto">
                  <p className="mb-2  text-dark fw-semibold">
                    :&nbsp;0709/123
                    // {data?.TransactionData[0]?.additionalInfo?.additional_info1
                    //   ?.split(":")[1]
                    //   .trim()} 
                  </p>
                </div>
              </div> */}
              <div className="row" style={{ borderLeft: "3px solid #3284fd" }}>
                <div className="col-4">
                  <p className="mb-2">Date</p>
                </div>
                <div className="col-auto">
                  <p className="mb-2">
                    :&nbsp;
                    {new Date(
                      data?.TransactionData[0]?.transactionDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="row" style={{ borderLeft: "3px solid #3284fd" }}>
                <div className="col-4">
                  <p className="mb-0">Time</p>
                </div>
                <div className="col-auto">
                  <p className="mb-0">
                    :&nbsp;
                    {new Date(
                      data?.TransactionData[0]?.transactionDate
                    ).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <table
            style={{
              padding: "20px 16px",
              width: "100%",
              borderRadius: "12px",
              fontSize: "16px",
              tableLayout: "fixed",
              marginTop: "2rem",
            }}
          >
            <tbody>
              <tr>
                <td colSpan="3">
                  <div className="mb-4 px-1" style={{ marginTop: "4rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#5E6470",
                      }}
                    >
                      <div>
                        Order ID &nbsp;: {data?.TransactionData[0]?.orderId}
                      </div>
                      <div>
                        Transaction ID &nbsp;:{" "}
                        {data?.TransactionData[0]?.transactionId}
                      </div>
                    </div>
                  </div>
                  <table
                    style={{
                      width: "100%",
                      borderSpacing: 0,
                    }}
                  >
                    <thead>
                      <tr
                        style={{ textTransform: "uppercase" }}
                        className="my-2"
                      >
                        <td
                          className="py-3 ps-2"
                          style={{
                            borderTop: "2px solid #D7DAE0",
                          }}
                        >
                          Course Detail
                        </td>
                        <td
                          style={{
                            padding: "8px 0",
                            borderTop: "2px solid #D7DAE0",
                            width: "180px",
                            textAlign: "center",
                          }}
                        >
                          Course Fee
                        </td>
                        <td
                          style={{
                            padding: "8px 0",
                            borderTop: "2px solid #D7DAE0",
                            textAlign: "center",
                            width: "100px",
                          }}
                        >
                          GST
                        </td>
                        <td
                          className="pe-2"
                          style={{
                            padding: "8px 0",
                            borderTop: "2px solid #D7DAE0",
                            textAlign: "end",
                            width: "120px",
                          }}
                        >
                          Amount
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="ps-2"
                          style={{
                            paddingBlock: "20px",
                            borderBlock: "2px solid #D7DAE0",
                          }}
                        >
                          <p
                            style={{ color: "#1A1C21" }}
                            className="mb-0 text-dark"
                          >
                            {data?.TransactionData[0]?.additionalInfo?.additional_info4
                              ?.split(":")[1]
                              .trim()}
                          </p>
                        </td>
                        <td
                          style={{
                            paddingBlock: "12px",
                            textAlign: "center",
                            borderBlock: "2px solid #D7DAE0",
                          }}
                        >
                          <p style={{ color: "#1A1C21" }} className="mb-0">
                            {/* {data?.TransactionData[0]?.additionalInfo
                                      ?.additional_info6
                                      ? new Intl.NumberFormat("en-IN", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(
                                          Number(
                                            data?.TransactionData[0]?.additionalInfo?.additional_info6
                                              ?.split(":")[1]
                                              ?.trim()
                                          ) || 0
                                        )
                                      : "0.00"} */}

                            {new Intl.NumberFormat("en-IN").format(
                              Number(
                                data?.TransactionData[0]?.additionalInfo?.additional_info6
                                  ?.split(":")[1]
                                  ?.trim()
                              ) || 0
                            )}
                          </p>
                        </td>
                        <td
                          style={{
                            paddingBlock: "12px",
                            textAlign: "center",
                            borderBlock: "2px solid #D7DAE0",
                          }}
                        >
                          <p style={{ color: "#1A1C21" }} className="mb-0">
                            {new Intl.NumberFormat("en-IN").format(
                              Number(
                                data?.TransactionData[0]?.additionalInfo?.additional_info7
                                  ?.split(":")[1]
                                  ?.trim()
                              ) || 0
                            )}
                          </p>
                        </td>
                        <td
                          className="pe-2"
                          style={{
                            paddingBlock: "12px",
                            textAlign: "end",
                            borderBlock: "2px solid #D7DAE0",
                          }}
                        >
                          <p style={{ color: "#1A1C21" }} className="mb-0">
                            {/* {new Intl.NumberFormat("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(
                                      data?.TransactionData[0]?.amount || 0
                                    )} */}
                            {new Intl.NumberFormat("en-IN").format(
                              data?.TransactionData[0]?.amount
                            )}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBlock: "12px" }}></td>
                        <td style={{ paddingBlock: "12px" }}></td>
                        <td
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{ marginTop: "1rem" }}
                            className="fw-semibold text-primary"
                          >
                            Total
                          </p>
                        </td>
                        <td
                          className="pe-2"
                          style={{
                            textAlign: "end",
                          }}
                        >
                          <p
                            style={{ marginTop: "1rem" }}
                            className="fw-semibold text-dark"
                          >
                            {new Intl.NumberFormat("en-IN").format(
                              data?.TransactionData[0]?.amount
                            )}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: "3rem" }}>
            <div className="row m-0" style={{ color: "#5E6470" }}>
              <div
                className="col-12"
                style={{ borderLeft: "3px solid #3284fd" }}
              >
                <div className="row mb-2" style={{ color: "#5E6470" }}>
                  <div className="col-4">
                    <p className="mb-1 text-dark fw-semibold">
                      Transaction Status
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="mb-1 text-dark fw-semibold">
                      : &nbsp;{data?.TransactionData[0]?.transactionErrorDesc}
                    </p>
                  </div>
                </div>
                <div className="row" style={{ color: "#5E6470" }}>
                  <div className="col-4">
                    <p className="mb-0">Transaction Method</p>
                  </div>
                  <div className="col-auto">
                    <p className="mb-0">
                      : &nbsp;
                      {data?.TransactionData[0]?.paymentMethodType?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "5rem" }}>
            <div className="row m-0" style={{ color: "#5E6470" }}>
              <div className="col-9">
                <p className="mb-0"
                  style={{
                    fontSize: "14px",
                    color: "#5E6470",
                    textAlign: "start",
                    paddingTop: "25px",
                    marginTop: "3rem",
                  }}
                >
                  <p>Thank you for choosing us.</p>
                  <b>Cloud ECS Infotech Pvt Ltd.,</b>
                  <br />
                  <span>
                    Contact :&nbsp;
                    <a href="tel:9361365818" style={{ color: "#5E6470",textDecoration:"none" }}>
                      +91 9361365818
                    </a>
                  </span>
                  <span className="ms-2">
                    {" "}
                    Email :&nbsp;
                    <a 
                      href="mailto:info@ecsaio.in"
                      style={{ color: "#5E6470",textDecoration:"none" }}
                    >
                      info@ecsaio.in
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
