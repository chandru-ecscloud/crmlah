import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";

const fetchCompanyData = async (api) => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching company data: ", error);
    toast.error("An error occurred while fetching company data.");
    return null;
  }
};

const mailContent = async (data, generateLink) => {
  const companyId = sessionStorage.getItem("companyId");
  console.log("companyId", companyId);

  const companyData = await fetchCompanyData(
    `${API_URL}getAllCompanyRegisterById/${companyId}`
  );

  if (!companyData) {
    toast.error("Failed to fetch company data.");
    return "";
  }
  console.log("companyData", companyData);
  const currentDate = new Date().toISOString().split("T")[0];

  let Link = generateLink
    ? `<h3 style="margin-bottom: 0;">You can join:</h3>
       <h4 style="margin:0 ;">${generateLink}</h4>`
    : "";

  let mailContent = `<!DOCTYPE html>
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
        .preserve-whitespace { white-space: pre-wrap; }
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
                                <img src="${
                                  companyData.companyLogo || ""
                                }" style="width: 75%; max-width: 180px" alt="Logo" />
                            </td>
                            <td class="third">
                                <b>Date:</b> ${currentDate}<br />
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
        <div class="invoice">
            <h1 style="color: black;">Dear ${data},</h1>
            <div id="email-content" class="preserve-whitespace" style="margin: 2rem 0 0; font-size: 0.9rem;">
 My name is ${
              companyData.companyOwnerName || ""
            }, and I am the Developer at ${companyData.companyName || ""}.
I am writing to introduce our company and propose a potential collaboration that I believe could be mutually beneficial for both our organizations.

At ${
    companyData.companyName || ""
  }, we specialize in [briefly describe your company's services/products]. We have been following your impressive work in the industry and are particularly interested in exploring ways in which we could combine our expertise to achieve greater success together.

I would love to schedule a meeting at your earliest convenience to discuss this proposal in more detail and explore how our collaboration can help achieve our respective goals. Please let me know your availability, and I will be happy to coordinate accordingly.

Thank you for considering this opportunity. I look forward to the possibility of working together.</div>
            ${Link}
            <hr />
            <p style="margin: 2rem 0 0;">Best regards,</p>
            <h4 style="margin: 0;">${companyData.companyOwnerName || ""}</h4>
            <p style="margin: 0;">${companyData.companyName || ""}</p>
            <p style="margin: 0;">${companyData.companyEmail || ""}</p>
            <p style="margin: 0;">${companyData.companyMobile || ""}</p>
            <p style="margin: 0 0 2rem 0;"><a>${
              companyData.companyWebsite || ""
            }</a></p>
            <hr />
        </div>
    </div>
    <script>
        const emailContent = \`My name is ${
          companyData.companyOwnerName || ""
        }, and I am the Developer at ${companyData.companyName || ""}.
I am writing to introduce our company and propose a potential collaboration that I believe could be mutually beneficial for both our organizations.

At ${
    companyData.companyName || ""
  }, we specialize in [briefly describe your company's services/products]. We have been following your impressive work in the industry and are particularly interested in exploring ways in which we could combine our expertise to achieve greater success together.

I would love to schedule a meeting at your earliest convenience to discuss this proposal in more detail and explore how our collaboration can help achieve our respective goals. Please let me know your availability, and I will be happy to coordinate accordingly.

Thank you for considering this opportunity. I look forward to the possibility of working together.\`;

        document.getElementById('email-content').textContent = emailContent;
    </script>
</body>
</html>`;

  return mailContent;
};

export default mailContent;
