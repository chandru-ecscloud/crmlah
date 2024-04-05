import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

const Invoice = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const fromMail = "chandru08112000@gmail.com";
  const toMail = "chandruecs2022@gmail.com";
  const subject = "For Testing Purpose";
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const generateInvoice = (data) => {
    const tableRows = data.map((row, index) => `
      <tr class="item">
        <td>${index + 1}</td>
        <td>${row.dealName}</td>
        <td>${row.subject}</td>
        <td>${row.quotesStage}</td>
        <td>${row.quotesOwner}</td>
      </tr>
    `);

    const invoiceHTML = `
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
              font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              color: #555;
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
                        <img src="https://ecscloudinfotech.com/ecs/static/media/logo1.9c3a01a2a3d275bf1c44.png"
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
    
            <div style="max-width: 590px; overflow: auto;">
              <table>
                <tr class="heading">
                  <td style="white-space: nowrap;">S No</td>
                  <td style="white-space: nowrap;">Deal Name</td>
                  <td style="white-space: nowrap;">Subject</td>
                  <td style="white-space: nowrap;">Quotes Stage</td>
                  <td style="white-space: nowrap;">Quotes Owner</td>
                </tr>
                ${tableRows.join('')}
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

    setHtmlContent(invoiceHTML);
  };

  const sendInvoice = async () => {
    try {
      const response = await axios.post(
        `${API_URL}sendMail`,
        {
          toMail: toMail,
          fromMail: fromMail,
          subject: subject,
          htmlContent: htmlContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        onClick={() =>
          generateInvoice([
            {
              dealName: "Ragul",
              subject: "To Enquiry about Laptops",
              quotesStage: "Completed",
              quotesOwner: "Vignesh",
            },
            {
              dealName: "Vignesh",
              subject: "To Enquiry about Mobile",
              quotesStage: "Processed",
              quotesOwner: "Suriya",
            },
            {
              dealName: "Suriya",
              subject: "To Enquiry about HardWare",
              quotesStage: "Canceled",
              quotesOwner: "Chandru",
            },
          ])
        }
        className="btn btn-success"
      >
        Generate Invoice
      </button>

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      <button onClick={sendInvoice} className="btn btn-warning">
        Send Invoice
      </button>
    </div>
  );
};

export default Invoice;
