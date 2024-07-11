import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

const appoinmentRescheduleTemplete = async (data, id, companyId) => {
  const fetchCompanyData = async (api) => {
    try {
      const response = await axios.get(api);
      return response.data;
    } catch (error) {
      console.error("Error fetching company data: ", error);
      return [];
    }
  };

  const companyData = await fetchCompanyData(
    `${API_URL}getAllCompanyRegisterById/${companyId}`
  ); // Adjust the endpoint as needed

  const zoomLink = data.link
    ? `
          <h3 style="margin-bottom: 0;">you can join:</h3>
          <h4 style="margin:0 ;">${data.link}</h4>      
          <p style="margin: 1.5rem 0px 2rem 0px;">You Can Still <span><a href="https://crmlah.com/reschedule/index.html?id=${id}&name=${data.name}&email=${data.email}&link=${data.link}">Reschedule or Cancel</a> Your Appointment</p>
          `
    : "";

  const currentData = new Date().toISOString().split("T")[0];

  const mailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Invoice</title>
          <style>
            body{
              background-color: #ddd;
            }
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
            .invoice{
                padding: 1rem;
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
        <body >
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img
                          src="${companyData.companyLogo || ""}"
                          style="width: 75%; max-width: 180px"
                          alt="Logo"
                        />
                      </td>
                      <td class="third">
                        <b>Date:</b> ${currentData}<br />
                          ${companyData.companyStreet || ""},<br />
                          ${companyData.companyCity || ""},&nbsp;${
    companyData.companyState || ""
  },<br />
                          ${companyData.companyCountry || ""}-${
    companyData.companyZipCode || ""
  }.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
                      <div class="invoice" >
                <h1 style="color: black;">Hi, ${data.appointmentFor}</h1>
                <p style="margin: 2rem 0 0; font-size: 1rem;">We are pleased to inform you that your appointment has been successfully rescheduled. The appointment has been rescheduled for  ${
                  data.appointmentStartDate
                } at ${
    data.appointmentStartTime
  }. We hope this new schedule is convenient for you. <br />
                </p>
                <hr />
                <p style=" margin: 2rem 0 0;">See You Soon,</p>
                 <h4 style="margin: 0;">${
                   companyData.companyOwnerName || ""
                 }</h4>
                 <p style="margin: 0;">${companyData.companyName || ""}</p>
                 <p style="margin: 0;">${companyData.companyEmail || ""}</p>
                 <p style="margin: 0;">${companyData.companyMobile || ""}</p>
                 <p style="margin: 0;"><a>${
                   companyData.companyWebsite || ""
                 }</a></p>
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
      subject: "Your Appointment Has Been Successfully Rescheduled",
      htmlContent: mailContent,
    });
    if (response.status === 200) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export default appoinmentRescheduleTemplete;
