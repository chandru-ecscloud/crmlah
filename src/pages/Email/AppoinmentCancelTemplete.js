import axios from 'axios';
import React from 'react'
import { toast } from 'react-toastify';
import { API_URL } from '../../Config/URL';

const appoinmentCancelTemplete = async(data) => {
  const currentData = new Date().toISOString().split("T")[0];
     const mailContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Invoice</title>
            <style>
              body { background-color: #ddd; }
              .invoice-box {
                font-size: 12px;
                max-width: 600px;
                background-color: #fff;
                margin: auto;
                padding: 30px;
                border-bottom: 3px solid #0059ff;
                line-height: 24px;
                font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                color: #555;
                min-height: 85vh;
              }
              .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
              .invoice-box table td { padding: 5px; vertical-align: top; }
              .invoice-box table td.third { text-align: right; }
              .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
              .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
              .invoice-box table tr.item.last td { border-bottom: none; }
              .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
              .invoice { padding: 1rem; }
              #scan { float: right; }
              #scan img { max-width: 100%; height: auto; }
              @media print { .invoice-box { border: 0; } }
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
                            style="width: 75%; max-width: 180px" alt="Logo" />
                        </td>
                        <td class="third">
                          <b>Date:</b> ${currentData}<br />
                          The Alexcier, 237 Alexandra Road,<br />
                          #04-10, Singapore-159929.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div class="invoice">
                <h1 style="color: black;">Hi, ${data.appointmentFor}</h1>
                <p style="margin: 2rem 0 0; font-size: 1rem;">
                  We regret to inform you that your scheduled appointment has been cancelled at your request. If you have any questions or need further assistance, please do not hesitate to contact us.<br />
                </p>
                <hr />
                <p style=" margin: 2rem 0 0;">See You Soon,</p>
                <h4 style=" margin: 0; ">${data.appointmentOwner}</h4>
                <p style=" margin: 0 ; ">ECS Cloud</p>
                <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
                <hr />
              </div>
            </div>
          </body>
          </html>`;

        try {
         const response = await axios.post(`${API_URL}sendMail`, {
            toMail: data.email,
            fromMail: data.email,
            subject: "Your Appointment Has Been Cancelled",
            htmlContent: mailContent,
          });

          if (response.status === 200) {
            // toast.success("Mail sent successfully.");
          } else {
            toast.error("Error sending mail: " + response.data.message);
          } 
        } catch (error) {
          toast.error("Failed to send email: " + error.message);
        }
}

export default appoinmentCancelTemplete
