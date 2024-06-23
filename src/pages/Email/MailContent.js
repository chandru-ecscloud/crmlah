import axios from "axios";
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

const mailContent = async (data, generateLink, mailBody) => {
  const companyId = sessionStorage.getItem("companyId");
  console.log("companyId", generateLink);

  console.log("Selected Mail Body ", mailBody);

  const companyData = await fetchCompanyData(
    `${API_URL}getAllCompanyRegisterById/${companyId}`
  );

  if (!companyData) {
    toast.error("Failed to fetch company data.");
    return "";
  }
  console.log("companyData", companyData);

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
        <div class="invoice">
            <h1 style="color: black;margin: 0px;">Dear ${data},</h1>
            <div id="email-content" class="preserve-whitespace" style="margin: 1rem 0 0; font-size: 0.9rem;">
${mailBody}
            </div>
            ${Link}
            <hr />
            <p style="margin: 2rem 0 0;">Best regards,</p>
            <h4 style="margin: 0;">${companyData.companyOwnerName || ""}</h4>
            <p style="margin: 0;">${companyData.companyName || ""}</p>
            <p style="margin: 0;">${companyData.companyEmail || ""}</p>
            <p style="margin: 0;">+${companyData.countryCode || ""} ${
    companyData.companyMobile || ""
  }</p>
            <p style="margin: 0 0 2rem 0;"><a>${
              companyData.companyWebsite || ""
            }</a></p>
            <hr />
        </div>
    </div>
</body>
</html>`;

  return mailContent;
};

export default mailContent;
