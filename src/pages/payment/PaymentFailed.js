import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../Config/URL";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Failed from "../../assets/failed.png";

const PaymentFailed = () => {
   const [mailSent, setMailSent] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderDataString = queryParams.get("info");
  const OrderId = queryParams.get("OrderId");
  if (!OrderId) {
    navigate("/");
  }
  const orderData = orderDataString
    ? JSON.parse(decodeURIComponent(orderDataString))
    : null;
  console.log("orderData", orderData);
  const sendMailWithAttachment = async () => {
    const payload = new FormData();
    payload.append("from", "info@ecsaio.com");
    payload.append(
      "to",
      orderData.TransactionData[0]?.additionalInfo?.additional_info2?.split(" : ")[1]
    );
    payload.append("subject", `Sorry, payment did not succeed!`);
    payload.append("orderId", `${orderData?.orderId}`);
    payload.append("htmlContent", `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Request - Course Registration</title>
    <style>
      body {
        background-color: #f7f9fc;
        font-family: "Arial", sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 650px;
        background-color: #ffffff;
        margin: 40px auto;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border-top: 5px solid #0076f7;
        border-bottom: 3px solid #888888;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
      }

      .header img {
        width: 120px;
      }

      .headerText a {
        font-size: 12px;
        text-decoration: none;
        color: #000;
      }

      .message {
        padding: 10px 25px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
      }

      .message a {
        color: #0076f7;
      }

      .content {
        padding: 0px 25px;
        line-height: 1.6;
      }

      .content h4 {
        color: #0076f7;
        font-size: 28px;
        margin-top: 15px;
        margin-bottom: 15px;
      }

      .content p {
        font-size: 15px;
        margin-bottom: 20px;
      }

      .vendor-details {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
      }

      .vendor-details h2 {
        color: #333;
        font-size: 20px;
        margin-bottom: 10px;
        margin-top: 0px;
      }

      .vendor-details .col-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }

      .vendor-details p {
        margin: 0px;
      }

      .vendor-details .sub-heading span {
        color: #6b7b93;
      }

      .cta-button {
        text-align: center;
        margin: 40px 0;
      }

      .cta-button a {
        background-color: #0076f7;
        color: #fff;
        padding: 14px 28px;
        font-size: 16px;
        text-decoration: none;
        border-radius: 6px;
        box-shadow: 0 4px 10px rgba(255, 153, 0, 0.2);
        transition: background-color 0.3s;
      }

      .cta-button a:hover {
        background-color: #cc3b3b;
      }
      .user-details {
        padding: 15px 25px;
      }
      .course-details {
        padding: 15px 25px;
      }

      .align_button {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .align_button input {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;
        background-color: #0076f7;
        color: #fff;
        border: 1px solid #0076f7;
        border-radius: 6px;
      }
      .align_button input:hover {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;
        background-color: #fff;
        color: #0076f7;
        border: 1px solid #0076f7;
        border-radius: 6px;
      }
      .fee_details {
        display: flex;
        justify-content: space-between !important;
        align-items: center;
        padding: 15px 0;
      }

      .footer img {
        width: 120px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div
        class="header"
        style="padding: 25px; border-bottom: 1px solid #ddd; text-align: center"
      >
        <table
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="border-collapse: collapse"
        >
          <tr>
            <td align="left" style="vertical-align: middle">
              <img
                src="https://sgitjobs.com/logo/Cloud_ECS_Infotech.png"
                alt="Cloud ECS Infotech"
                style="max-width: 150px; height: auto"
              />
            </td>
            <td align="right" style="vertical-align: middle">
              <div class="headerText" style="font-size: 14px; color: #333">
                <a
                  href="https://info@ecsaio.in/"
                  target="_blank"
                  style="text-decoration: none; color: #333"
                >
                  Your <span style="color: #005aea">info@ecsaio.in</span>
                </a>
                |
                <a
                  href="tel:919150150687"
                  target="_blank"
                  style="text-decoration: none; color: #333"
                >
                  +91 9150150687
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="message">
        <p style="margin-top: 3rem"><strong> Hello ${orderData.TransactionData[0]?.additionalInfo?.additional_info1?.split(" : ")[1]}!</strong></p>

        <p style="margin-top: 2rem">
          Thank you for your interest in our internship program. We really
          appreciate your attempt to register and pay for the same. Due to ${orderData.TransactionData[0].transactionErrorDesc || "Bank Servers did not respond"} payment did not succeed. Please try again or contact us at
        </p>

        <p style="margin-top: 2rem">
          If you have any doubts, please feel free to contact
        </p>
        <p style="margin-top: 2rem; margin-bottom: 10px">For Help :</p>
        <p style="margin: 5px 0">Name : Yalini</p>
        <p style="margin: 5px 0">Contact Number : 8438670535</p>
        <p style="margin: 5px 0">Email : yalini@ecscloudinfotech.com</p>
        <p style="margin: 1rem 0 5px 0">Name : Manoj</p>
        <p style="margin: 5px 0">Contact Number : 9361365818</p>
        <p style="margin: 5px 0 1rem 0">Email : manoj@ecscloudinfotech.com</p>
      </div>
      <div class="footer" style="padding: 15px 25px; text-align: center">
        <table
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="border-collapse: collapse"
        >
          <tr>
            <td align="left" style="vertical-align: middle">
              <img
                src="https://sgitjobs.com/logo/Cloud_ECS_Infotech.png"
                alt="Cloud ECS infotech"
                style="max-width: 150px; height: auto; margin-bottom: 10px"
              />
            </td>
            <td align="right" style="vertical-align: middle">
              <p style="font-size: 12px; color: #333; margin: 0">
                Connect with
                <a
                  href="https://ecsaio.in/"
                  target="_blank"
                  style="color: #005aea; text-decoration: none"
                  >Cloud ECS Infotech</a
                >
                India
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>
`);

    try {
      const response = await axios.post(
        `${API_URL}sendPaymentInvoice`,
        payload
      );
      if (response.status === 201) {
        console.log("Success Data;", response.data);
      }
    } catch (error) {
      console.error(error);
    }finally {
      setMailSent(false)
    }
  };

  useEffect(() => {
    if (mailSent) {
      sendMailWithAttachment();
    }
  }, []);
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
                src={Failed}
                className="img-fluid img-responsive success-img"
                alt="Success"
                style={{ maxHeight: "6em" }}
              />
            </div>
            <span
              className="badge rounded-pill mt-3"
              style={{
                backgroundColor: "#ffd4d5",
                color: "#FF2B2E",
                fontWeight: "lighter",
              }}
            >
              Payment Failed
            </span>
            <p className="mt-3 h5 fw-semibold" style={{ marginBottom: "6rem" }}>
            The payment process did not succeed for some reason.
            </p>
            <p className="mt-3 mb-0 success-note">Error:</p>
            <p className="">
              {orderData.TransactionData[0].transactionErrorDesc || "Bank Servers did not respond"}. Please Try Again.<br />
              Reach out to our support team at <br/> info@ecsaio.com or 
            +91 9361365818 for help.
            </p>
            <a
              href="https://ecsaio.in/students_internship/contact"
              className="text-muted"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
