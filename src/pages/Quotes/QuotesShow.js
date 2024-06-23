import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaFilePdf } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import CompanyLogo from "../../assets/CMPLogoNew.png";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

function QuotesShow() {
  const { id } = useParams();
  const [quoteData, setQuoteData] = useState({});
  // const [quotesItemList, setQuotesItemsList] = useState({});
  console.log("Quote Item list", quoteData);
  const [total, setTotal] = useState(0);
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  // const quotedItems = [
  //   {
  //     productName: "Product Name",
  //     itemDescription: "Item Description",
  //     quantity: "2",
  //     price: "1000",
  //     discount: "5%",
  //     tax: "5%",
  //     totalAmount: "850",
  //   },
  // ];

  // const renderQuotedItems = () => {
  //   return quotedItems.map((item, index) => (
  //     <tr key={index} style={{ borderTop: "1px solid #9494947c" }}>
  //       <td className="px-5 py-2">
  //         <span>{index + 1}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span className="text-primary">
  //           {item.productName || "--"} <br />
  //         </span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.quantity || "--"}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.price || "--"}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.discount || "0"}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.tax || "--"}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.totalAmount || "--"}</span>
  //       </td>
  //     </tr>
  //   ));
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}allQuotes/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });

        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            let value = response.data[key];

            if (key === "validUntil" && value) {
              const date = new Date(value);

              value = date.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              value = value.replace(/\d{4}$/, "2024");
            }

            acc[key] = value;
            return acc;
          },
          {}
        );

        setQuoteData(transformedData);
        setTotal(
          response.data.productsWithQuote
            ? response.data.productsWithQuote.length
            : 0
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/quotes/edit/${id}`);
  };

  const generatePDF = (action = "download") => {
    const doc = new jsPDF();
    doc.addImage(CompanyLogo, "Logo", 13, 15, 52, 10); // x, y, width, height

    doc.setFont("helvetica", "normal");
    doc.setFontSize(28);
    doc.text("ESTIMATE", 155, 22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("ECS Cloud Infotech Pte Ltd", 13, 30);

    doc.setFont("helvetica", "small");
    doc.setFontSize(10);
    doc.text("The Alexcier", 13, 35);
    doc.text("237 Alexandra Road #04-10", 13, 40);
    doc.text("Singapore 159929", 13, 45);
    doc.text("Singapore", 13, 50);

    doc.text("Subject :", 13, 65);
    doc.text(`${quoteData.subject}`, 13, 70);

    // Add the table
    const tableData =
      quoteData.quotesItemList &&
      quoteData.quotesItemList.map((invoiceItem, index) => [
        index + 1,
        invoiceItem.productName,
        invoiceItem.quantity,
        invoiceItem.listPrice,
        invoiceItem.amount,
        invoiceItem.discount,
        invoiceItem.tax,
        invoiceItem.total,
      ]);
    doc.autoTable({
      startY: 85,
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontStyle: "normal",
      },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      head: [
        [
          "S.No",
          "Product Name",
          "Quantity",
          "Price",
          "Amount",
          "Discount",
          "Tax",
          "Total",
        ],
      ],
      body: tableData,
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "normal",
      },
      // eslint-disable-next-line no-dupe-keys
      body: tableData,
      foot: [
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "Sub Total(SGT)",
          `: ${quoteData.subTotal || "0"}`,
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "Discount(%)",
          `: ${quoteData.txnDiscount || "0"}`,
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "Tax(%)",
          `: ${quoteData.txnTax || "0"}`,
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "Grand Total(SGT)",
          `: ${quoteData.grandTotal || "0"}`,
          "",
          "",
          "",
          "",
        ],
      ],
    });

    // Add Company Footer Information
    const finalY = doc.lastAutoTable.finalY + 10;

    // Wrap the Notes text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Notes", 13, finalY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const notesText = doc.splitTextToSize(`${quoteData.description}`, 180); // 180 is the width
    doc.text(notesText, 13, finalY + 6);

    const nextY = finalY + 6 + notesText.length * 10; // Adjust next Y position

    // Wrap the Terms & Conditions text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Terms & Conditions", 13, nextY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const termsText = doc.splitTextToSize(`${quoteData.termsAndConditions}`,180); // 180 is the width
    doc.text(termsText, 13, nextY + 6);

    // Save the PDF
    if (action === "download") {
      doc.save("quotes.pdf");
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    } else if (action === "open") {
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  return (
    <>
      {/* header section */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-3 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="button-tooltip-2">Back</Tooltip>}
                >
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/quotes")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
                {/* <img
                  className="img-fluid"
                  style={{ width: "5rem" }}
                  src={USER}
                  alt="profile"
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          {/* <SendEmail /> */}

          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER"}
            onClick={handleEdit}
          >
            Edit
          </button>

          <div className="dropdown mx-1" style={{ cursor: "pointer" }}>
            <button
              className="btn shadow-none dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ background: "radial-gradient(#ff6060, #f34c4cf2)" }}
            >
              <FaFilePdf className="mx-1 text-white fs-5" />
            </button>
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onClick={() => generatePDF("download")}
              >
                Download PDF
              </li>
              <li className="dropdown-item" onClick={() => generatePDF("open")}>
                Open PDF
              </li>
              <li
                className="dropdown-item"
                onClick={() => generatePDF("print")}
              >
                Print PDF
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quotes Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* left Side Content */}
        {/* <div className="container-fluid col-md-2 m-0" id="ulList-container">
          <h3 className="text-start ms-4 mt-3 fw-bold fw-bold">Related List</h3>
          <ul className="m-0 py-1">
            <li className="mt-2">
              <Link className="py-3">Notes</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">
                <span>Products </span>
                <span class="badge text-bg-danger">{total}</span>
              </Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Attachments</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Open Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Closed Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Invited Meeting</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Emails</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Campaigns</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Social</Link>
            </li>

            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">
                Add Related List
              </Link>
            </li>
          </ul>
          <h3 className="text-start ms-4 mt-4 fw-bold">Links</h3>
          <ul className="m-0 py-1">
            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">Add Links</Link>
            </li>
          </ul>
        </div> */}

        {/* Right Side Content */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Quote Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.quoteOwner || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Quote Number</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.quoteNumber || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Quote Stage</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.quoteStage || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Valid Until</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.validUntil || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Team</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.team || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Carrier</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.carrier || "--"}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Hide Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Quotes Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Quotes Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.quoteOwner || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Subject</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.subject || ""}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Quotes Stage</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.quoteStage || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Carrier</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.carrier || "--"}
                </span>
              </div> */}
              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.createdBy || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {quoteData.createdAt ? quoteData.createdAt.split("T")[0] : ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {quoteData.updatedAt ? quoteData.updatedAt.split("T")[0] : ""}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              {/* <div>
                <label className="text-dark Label">Deal Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.dealName || ""}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Valied Until</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.validUntil || ""}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Lead Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.leadName || "--"}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.accountName || ""}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.updatedBy || "--"}
                </span>
              </div> */}
            </div>

            {/* Address Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
                {/* <button className="btn bg-info col-2 text-white">
                  Locate Map
                </button> */}
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Shipping Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.shippingStreet || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.shippingState || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.shippingCity || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.shippingCode || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.shippingCountry || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Billing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.billingStreet || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.billingState || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.billingCity || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.billingCode || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{quoteData.billingCountry || "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quotes Items */}
            <div className="container-fluid row my-3" id="quoted-item">
              {/* Quotes Information Table*/}
              <div className="container-fluid row" id="Details">
                <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="my-3 fs-6 fw-bold my-3">Notes</span>
                  </div>
                </div>

                <div className="container  col-12">
                  {quoteData?.quotesItemList?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        {/* Table header */}
                        <thead>
                          <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Tax</th>
                            <th scope="col">Total</th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody>
                          {quoteData?.quotesItemList.map((product, index) => (
                            <tr key={product.id}>
                              <td>{index + 1}</td>
                              <td>{product.productName || "--"}</td>
                              <td>{product.quantity || "0"}</td>
                              <td>{product.listPrice || "0"}</td>
                              <td>{product.amount || "0"}</td>
                              <td>{product.discount || "0"}</td>
                              <td>{product.tax || "0"}</td>
                              <td>{product.total || "0"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No Product available.</p>
                  )}
                </div>
                {/* Quotes Items List */}
                <div className="container-fluid">
                  <div className="container-fluid row mt-5 mx-2">
                    <div className="container-fluid p-3 col-md-7"></div>
                    <div className="container-fluid p-3 col-md-5 col-12 border rounded">
                      <div className="container-fluid py-2">
                        <div className="row">
                          <div className="col-md-7 col-12">
                            {" "}
                            <label className="text-dark ">Sub Total(SGT)</label>
                          </div>
                          <div className="col-md-1 col-12">
                            {" "}
                            <span>:</span>
                          </div>
                          <div className="col-md-4 col-12">
                            {" "}
                            <span>{quoteData.subTotal || "0"}.00</span>
                          </div>
                        </div>
                      </div>
                      <div className="container-fluid py-2">
                        <div className="row">
                          <div className="col-md-8 col-12">
                            {" "}
                            <label className="text-dark ">Discount(%)</label>
                          </div>
                          <div className="col-md-4 col-12">
                            {" "}
                            <span>: {quoteData.txnDiscount || "0"}.00</span>
                          </div>
                        </div>
                      </div>
                      <div className="container-fluid py-2">
                        <div className="row">
                          <div className="col-md-8 col-12">
                            {" "}
                            <label className="text-dark ">Tax(%)</label>
                          </div>
                          <div className="col-md-4 col-12">
                            {" "}
                            <span>: {quoteData.txnTax || "0"}.00</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="container-fluid py-2">
                        <div className="row">
                          <div className="col-md-8 col-12">
                            
                            <label className="text-dark ">
                              Adjustment(Rs.)
                            </label>
                          </div>
                          <div className="col-md-4 col-12">
                            
                            <span>: {quoteData.adjustment || "0"}.00</span>
                          </div>
                        </div>
                      </div> */}
                      <div className="container-fluid py-2">
                        <div className="row">
                          <div className="col-md-8 col-12">
                            <label className="text-dark ">
                              Grand Total(SGT)
                            </label>
                          </div>
                          <div className="col-md-4 col-12">
                            <span>: {quoteData.grandTotal || "0"}.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div
                className="container-fluid col-12"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "flex-end",
                }}
              >
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Sub Total(Rs.)</label>
                  <span>{quoteData.totalAmount || "--"}</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Discount(Rs.)</label>
                  <span>{quoteData.discount || "--"}</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Tax(Rs.)</label>
                  <span>{quoteData.tax || "--"}</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Adjustment(Rs.)</label>
                  <span>{quoteData.adjustment || "--"}</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">GrandTotal(Rs.)</label>
                  <span>{quoteData.grandTotal || "--"}</span>
                </div>
              </div> */}
            </div>

            {/* Customer Notes */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                Customer Notes
                </span>
              </div>

              <div>
                <label className="text-dark Label">Customer Notes</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.description || " "}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {/* <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Notes</span>
              </div>
              <div className="dropdown">
                <Link
                  className="btn border border-primary text-primary dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Recent Last
                </Link>
                <ul className="dropdown-menu">
                  <li className="mt-2"></li>
                </ul>
              </div>
            </div>
            <hr />
            <div className="container  col-12">
              <textarea
                className="form-control py-2 m-3 textarea"
                placeholder="'Add note...'"
              ></textarea>
            </div>
          </div> */}

          {/* Sales Order */}
          {/* <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-left align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Sales Order</span>
              </div>
            </div>
            <hr />
            <div className="container col-12 p-2 d-flex justify-content-left align-items-center">
              <p className="mx-1 my-0">No records Found</p>
              <button className="btn border-primary text-primary p-1 mx-1">
                Assing
              </button>
              <button className="btn border-primary text-primary p-1 mx-1">
                New
              </button>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
}

export default QuotesShow;
