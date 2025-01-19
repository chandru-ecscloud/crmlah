import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
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
  const generatePDF = async () => {
    const mailContent = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *,
        *::before,
        *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            margin: 1.5rem;
            padding: 5rem;
        }
    </style>
</head>

<body >
    <div
        style="max-height: auto; margin: auto;padding: 16px;font-size: 16px;line-height: 24px;font-family: 'Inter', sans-serif;color: #555;">
        <table style="font-size: 16px; line-height: 20px; margin-top: 3rem;">
            <thead>
                <tr>
                    <td style="padding: 0 16px 18px 16px;">
                        <img src=${Companylogo} alt="Company Logo"
                            style="width: 100px; height: auto; margin-bottom: 10px;">
                        <p>info@ecsaio.in</p>
                        <p>+91 9361365818</p>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <table
                            style="padding: 20px 16px; width: 100%; border-radius: 12px;font-size: 16px; table-layout: fixed;margin-top: 3rem;">
                            <tbody>
                                <tr>
                                    <td
                                        style="vertical-align: top; width: 30%; padding-right: 20px;padding-bottom: 35px;">
                                        <p style="font-weight: 700;">To</p>
                                        <p style="color: #5E6470;">Name: ${data?.TransactionData[0]?.additionalInfo?.additional_info1
                                          ?.split(":")[1]
                                          .trim()}</p>
                                        <p style="color: #5E6470;">Mobile No: ${data?.TransactionData[0]?.additionalInfo?.additional_info3
                                          ?.split(":")[1]
                                          .trim()}</p>
                                        <p style="color: #5E6470;">Email: ${data?.TransactionData[0]?.additionalInfo?.additional_info2
                                          ?.split(":")[1]
                                          .trim()}</p>
                                        <p style="color: #5E6470;">City: ${data?.TransactionData[0]?.additionalInfo?.additional_info5
                                          ?.split(":")[1]
                                          .trim()}</p>
                                    </td>
                                    <td
                                        style="vertical-align: top; width: 35%; padding-right: 20px;padding-bottom: 35px;">
                                        <p style="font-weight: 700; color: #1A1C21;"></p>
                                        <p style="color: #5E6470;"></p>
                                    </td>
                                    <td style="vertical-align: top; width: 30%; padding-right: 20px;padding-bottom: 35px;">
                                        <p style="color: #5E6470; text-align: center">Date: ${new Date(
                                          data?.TransactionData[0]?.transactionDate
                                        ).toLocaleDateString()}</p>
                                        <p style="color: #5E6470;text-align: center">Time: ${new Date(
                                          data?.TransactionData[0]?.transactionDate
                                        ).toLocaleTimeString()}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <div style="margin-top: 5rem;">
                                            <div style="display: flex; justify-content: space-between; color: #5E6470;">
                                                <div>Order ID : ${
                                                  data?.TransactionData[0]
                                                    ?.orderId
                                                }</div>
                                                <div>Transaction ID: ${
                                                  data?.TransactionData[0]
                                                    ?.transactionId
                                                }</div>
                                            </div>
                                        </div>
                                        <table style="width: 100%;border-spacing: 0;margin-top: 1rem;">
                                            <thead>
                                                <tr style="text-transform: uppercase;">
                                                    <td style="padding: 8px 0; border-block:1px solid #D7DAE0;">
                                                        Course Detail
                                                    </td>
                                                    <td style="padding: 8px 0; border-block:1px solid #D7DAE0; width: 40px;"></td>
                                                    <td
                                                        style="padding: 8px 0; border-block:1px solid #D7DAE0; text-align: end; width: 100px;">
                                                        GST
                                                    </td>
                                                    <td
                                                        style="padding: 8px 0; border-block:1px solid #D7DAE0; text-align: end; width: 120px;">
                                                        Amount
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style="padding-block: 12px;">
                                                        <p style="color: #1A1C21;">${data?.TransactionData[0]?.additionalInfo?.additional_info4
                                                          ?.split(":")[1]
                                                          .trim()}
                                                        </p>
                                                    </td>
                                                    <td style="padding-block: 12px;"></td>
                                                    <td style="padding-block: 12px; text-align: end;">
                                                        <p style="color: #1A1C21;">${
                                                          data?.TransactionData[0]?.additionalInfo.additional_info7
                                                            ?.split(":")[1]
                                                            .trim() || "--"
                                                        }</p>
                                                    </td>
                                                    <td style="padding-block: 12px; text-align: end;">
                                                        <p style="color: #1A1C21;">${
                                                          data
                                                            ?.TransactionData[0]
                                                            ?.amount
                                                        }</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-block: 12px;"></td>
                                                    <td style="padding-block: 12px;"></td>
                                                    <td style="padding-block: 12px; text-align: end;border-block:1px solid #D7DAE0;">
                                                        <p style="margin-top: 1rem;">Total</p>
                                                    </td>
                                                    <td style="padding-block: 12px; text-align: end;border-block:1px solid #D7DAE0;">
                                                        <p style="margin-top: 1rem;">${
                                                          data
                                                            ?.TransactionData[0]
                                                            ?.amount
                                                        }</p>
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
        <div style="margin-top: 3rem;">
            <div style="color: #5E6470;">
                <div>Transaction Status : ${
                  data?.TransactionData[0]?.transactionErrorDesc
                }</div>
                <div>Transaction Method : ${
                  data?.TransactionData[0]?.paymentMethodType
                }</div>
            </div>
        </div>
        <tr>
            <td colspan="3">
                <p style="font-size: 12px; color: #5E6470; text-align: start;padding-top: 25px;margin-top: 3rem;">
                    <b>Cloud ECS Infotech Pvt Ltd,</b>
                    766, Sakthi Tower Ln, Anna Salai, Thousand Lights, Chennai-02.<br />
                    Any questions, contact customer service at 
                    <a href="mailto:info@ecsaio.in" style="color: #000;">info@ecsaio.in</a>
                </p>
            </td>
        </tr>
    </div>
</body>

</html>
  `;

    try {
      const tempElem = document.createElement("div");
      tempElem.innerHTML = mailContent;

      document.body.appendChild(tempElem);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(tempElem);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data?.orderId}.pdf`);

      document.body.removeChild(tempElem);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
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
              onClick={generatePDF}
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
    </div>
  );
};

export default PaymentSuccess;
