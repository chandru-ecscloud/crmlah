import { useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Success from "../../assets/success.png";
import html2canvas from "html2canvas";
import Companylogo from "../../assets/ECS_logo.png";
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
    <div className="container py-2">
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
              You’ll receive an email with the transaction details.
              <br />
              Please do not refresh or close this page.
            </p>
          </div>
        </div>
      </div>
      <div
        ref={contentRef}
        style={{
          padding: "60px 50px",
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
      >
        <div
          className="container"
          style={{
            maxHeight: "auto",
            margin: "auto",
            padding: "16px",
            fontSize: "16px",
            lineHeight: "24px",
            fontFamily: "'Inter', sans-serif",
            color: "#555",
          }}
        >
          <table
            style={{ fontSize: "16px", lineHeight: "20px", marginTop: "3rem" }}
          >
            <thead>
              <tr>
                <td style={{ padding: "0 16px 18px 16px" }}>
                  <img
                    src={Companylogo}
                    alt="Company Logo"
                    style={{
                      width: "100px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                  <p>info@ecsaio.in</p>
                  <p>+91 9361365818</p>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <table
                    style={{
                      padding: "20px 16px",
                      width: "100%",
                      borderRadius: "12px",
                      fontSize: "16px",
                      tableLayout: "fixed",
                      marginTop: "3rem",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "40%",
                            paddingRight: "20px",
                            paddingBottom: "35px",
                          }}
                        >
                          <p style={{ fontWeight: 700 }}>To</p>
                          <div className="row" style={{ color: "#5E6470" }}>
                            <div className="col-3">
                              <p className="">Name</p>
                            </div>
                            <div className="col-auto">
                              <p className="">
                                : &nbsp;
                                {data?.TransactionData[0]?.additionalInfo?.additional_info1
                                  ?.split(":")[1]
                                  .trim()}
                              </p>
                            </div>
                          </div>
                          <div className="row" style={{ color: "#5E6470" }}>
                            <div className="col-3">
                              <p className=""> Mobile No</p>
                            </div>
                            <div className="col-auto">
                              <p className="">
                                : &nbsp;
                                {data?.TransactionData[0]?.additionalInfo?.additional_info3
                                  ?.split(":")[1]
                                  .trim()}
                              </p>
                            </div>
                          </div>
                          <div className="row" style={{ color: "#5E6470" }}>
                            <div className="col-3">
                              <p className="">Email</p>
                            </div>
                            <div className="col-auto">
                              <p className="">
                                : &nbsp;
                                {data?.TransactionData[0]?.additionalInfo?.additional_info2
                                  ?.split(":")[1]
                                  .trim()}
                              </p>
                            </div>
                          </div>
                          <div className="row" style={{ color: "#5E6470" }}>
                            <div className="col-3">
                              <p className="">City</p>
                            </div>
                            <div className="col-auto">
                              <p className="">
                                : &nbsp;
                                {data?.TransactionData[0]?.additionalInfo?.additional_info5
                                  ?.split(":")[1]
                                  .trim()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "25%",
                            paddingRight: "20px",
                            paddingBottom: "35px",
                          }}
                        >
                          <p style={{ fontWeight: 700, color: "#1A1C21" }}></p>
                          <p style={{ color: "#5E6470" }}></p>
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "30%",
                            paddingRight: "20px",
                            paddingBottom: "35px",
                          }}
                        >
                          <div
                            className="row justify-content-end"
                            style={{ color: "#5E6470" }}
                          >
                            <div className="col-auto">
                              <p className="">Date</p>
                            </div>
                            <div className="col-4">
                              <p className="">
                                :&nbsp;
                                {new Date(
                                  data?.TransactionData[0]?.transactionDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div
                            className="row justify-content-end"
                            style={{ color: "#5E6470" }}
                          >
                            <div className="col-auto">
                              <p className="">Time</p>
                            </div>
                            <div className="col-4">
                              <p className="">
                                :&nbsp;
                                {new Date(
                                  data?.TransactionData[0]?.transactionDate
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <div
                            className="mb-4 px-1"
                            style={{ marginTop: "5rem" }}
                          >
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
                                  className="py-4 ps-2"
                                  style={{
                                    borderBlock: "1px solid #D7DAE0",
                                  }}
                                >
                                  Course Detail
                                </td>
                                <td
                                  style={{
                                    padding: "8px 0",
                                    borderBlock: "1px solid #D7DAE0",
                                    width: "300px",
                                    textAlign: "center",
                                  }}
                                >
                                  Course Fee
                                </td>
                                <td
                                  style={{
                                    padding: "8px 0",
                                    borderBlock: "1px solid #D7DAE0",
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
                                    borderBlock: "1px solid #D7DAE0",
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
                                  style={{ paddingBlock: "25px" }}
                                >
                                  <p style={{ color: "#1A1C21" }}>
                                    {data?.TransactionData[0]?.additionalInfo?.additional_info4
                                      ?.split(":")[1]
                                      .trim()}
                                  </p>
                                </td>
                                <td
                                  style={{
                                    paddingBlock: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <p style={{ color: "#1A1C21" }}>
                                    {data?.TransactionData[0]?.additionalInfo?.additional_info6
                                      ?.split(":")[1]
                                      .trim() || "--"}
                                  </p>
                                </td>
                                <td
                                  style={{
                                    paddingBlock: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <p style={{ color: "#1A1C21" }}>
                                    {data?.TransactionData[0]?.additionalInfo?.additional_info7
                                      ?.split(":")[1]
                                      .trim() || "--"}
                                  </p>
                                </td>
                                <td
                                  className="pe-2"
                                  style={{
                                    paddingBlock: "12px",
                                    textAlign: "end",
                                  }}
                                >
                                  <p style={{ color: "#1A1C21" }}>
                                    {data?.TransactionData[0]?.amount}
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingBlock: "12px" }}></td>
                                <td style={{ paddingBlock: "12px" }}></td>
                                <td
                                  style={{
                                    textAlign: "end",
                                    borderBlock: "1px solid #D7DAE0",
                                  }}
                                >
                                  <p
                                    style={{ marginTop: "1rem" }}
                                    className="fw-semibold"
                                  >
                                    Total
                                  </p>
                                </td>
                                <td
                                  className="pe-2"
                                  style={{
                                    textAlign: "end",
                                    borderBlock: "1px solid #D7DAE0",
                                  }}
                                >
                                  <p
                                    style={{ marginTop: "1rem" }}
                                    className="fw-semibold text-dark"
                                  >
                                    {data?.TransactionData[0]?.amount}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: "3rem" }}>
            <div className="row" style={{ color: "#5E6470" }}>
              <div className="col-6">
                <div className="row mb-2" style={{ color: "#5E6470" }}>
                  <div className="col-4">
                    <p className="">Transaction Status</p>
                  </div>
                  <div className="col-6">
                    <p className="">
                      : &nbsp;{data?.TransactionData[0]?.transactionErrorDesc}
                    </p>
                  </div>
                </div>
                <div className="row" style={{ color: "#5E6470" }}>
                  <div className="col-4">
                    <p className="">Transaction Method</p>
                  </div>
                  <div className="col-6">
                    <p className="">
                      : &nbsp;{data?.TransactionData[0]?.paymentMethodType?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "3rem" }}>
            <p
              style={{
                fontSize: "12px",
                color: "#5E6470",
                textAlign: "start",
                paddingTop: "25px",
                marginTop: "3rem",
              }}
            >
              <b>Cloud ECS Infotech Pvt Ltd,</b> 766, Sakthi Tower Ln, Anna
              Salai, Thousand Lights, Chennai-02.
              <br />
              Any questions, contact customer service at{" "}
              <a href="mailto:info@ecsaio.in" style={{ color: "#000" }}>
                info@ecsaio.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
