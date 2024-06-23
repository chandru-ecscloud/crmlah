import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";

const companyId = sessionStorage.getItem("companyId");
const fetchCompanyData = async (api) => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching company data: ", error);
    return [];
  }
};

const appoinmentCreateTemplete = async (data, appointmentId, linkResponse) => {
  const companyData = await fetchCompanyData(
    `${API_URL}getAllCompanyRegisterById/${companyId}`
  ); 

  const currentDate = new Date().toISOString().split("T")[0];

  const mailType =
    data.appointmentMode === "ONLINE"
      ? `<h3 style="margin-bottom: 0;">You can join:</h3>
       <h4 style="margin:0 ;">${linkResponse.data.message}</h4>`
      : `<h3 style="margin-bottom: 0;">Location details:</h3>
       <h4 style="margin:0 ;">${companyData.companyState || ""}</h4>`;

  const mailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Appointment Confirmation</title>
      <style>
        body {
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
          font-family: "Helvetica Neue", "Helvetica", Arial, sans-serif;
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
        .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
        }
        .invoice {
          padding: 1rem;
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
                    <img
                      src="${companyData.companyLogo || ""}"
                      style="width: 75%; max-width: 180px"
                      alt="Logo"
                    />
                  </td>
                  <td>
                    <b>Date:</b> ${currentDate || ""}<br />
                    ${companyData.companyStreet || ""},<br />
                    ${companyData.companyCity || ""},&nbsp;${companyData.companyState || ""},<br />
                    ${companyData.companyCountry || ""}-${companyData.companyZipCode || ""}.         
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div class="invoice">
          <h1 style="color: black;">Hi, ${data.appointmentFor || ""}</h1>
          <p style="margin: 2rem 0 0;">You've scheduled an appointment with ${companyData.companyOwnerName || ""} for ${data.appointmentName || ""} on 
            ${data.appointmentStartDate || ""} at ${data.appointmentStartTime || ""} (Asia/Singapore).
          </p>
          ${mailType}
          <p style="margin: 1.5rem 0px 2rem 0px;">
            You can still <a href="https://crmlah.com/reschedule/index.html?id=${appointmentId}&name=${data.appointmentFor || ""}&email=${data.email || ""}&link=${linkResponse.data.message || ""}">reschedule or cancel</a> your appointment.
          </p>
          <hr />
          <p style="margin: 2rem 0 0;">See you soon,</p>
          <h4 style="margin: 0;">${companyData.companyOwnerName || ""}</h4>
          <p style="margin: 0;">${companyData.companyName || ""}</p>
          <p style="margin: 0;">${companyData.companyEmail || ""}</p>
          <p style="margin: 0;">${companyData.companyMobile || ""}</p>
          <p style="margin: 0;"><a>${companyData.companyWebsite || ""}</a></p>
          <p style="margin: 0 0 2rem 0;">Powered by ECS</p>
          <hr />
        </div>
      </div>
    </body>
    </html>`;

  try {
    const response = await axios.post(`${API_URL}sendMail`, {
      toMail: data.email,
      fromMail: "noreply@example.com", // Use a valid sender email
      subject: `Appointment Confirmation: ${data.appointmentName}`,
      htmlContent: mailContent,
    });

    if (response.status === 200) {
      toast.success(response.data.message);
      toast.success("Mail sent successfully");
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error("Mail not sent");
  }
};

export default appoinmentCreateTemplete;
