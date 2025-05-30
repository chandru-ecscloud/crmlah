import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaFilePdf } from "react-icons/fa";
import CompanyLogo from "../../assets/CMPLogoNew.png";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import { toast } from "react-toastify";

import jsPDF from "jspdf";
import "jspdf-autotable";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

function InvoiceShow() {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceItemList, setInvoiceItemsList] = useState({});
  // console.log("Invoice Item list", InvoiceItemList);
  const [total, setTotal] = useState(0);
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  console.log("invoiceData", invoiceData);

  const invoiceItems = [
    {
      productName: "Product Name",
      itemDescription: "Item Description",
      quantity: "2",
      price: "1000",
      discount: "5%",
      tax: "5%",
      totalAmount: "850",
    },
  ];

  // const renderInvoiceItems = () => {
  //   return invoiceItems.map((item, index) => (
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
  //         <span>{item.discount || "--"}</span>
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
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allInvoices/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            let value = response.data[key];

            if (key === "invoiceDate" && value) {
              const date = new Date(value);

              value = date.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              value = value.replace(/\d{4}$/, "2024");
            }
            if (key === "dueDate" && value) {
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
        setInvoiceData(transformedData);
        setTotal(
          response.data.productsWithQuote
            ? response.data.productsWithQuote.length
            : 0
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/invoices/edit/${id}`);
  };

  //  PDF Generate
  const generatePDF = (action = "download") => {
    const doc = new jsPDF();
    doc.addImage(CompanyLogo, "Logo", 13, 15, 52, 10); // x, y, width, height

    doc.setFont("helvetica", "normal");
    doc.setFontSize(28);
    doc.text("INVOICE", 155, 22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("ECS Cloud Infotech Pte Ltd", 13, 30);

    doc.setFont("helvetica", "small");
    doc.setFontSize(10);
    doc.text("The Alexcier", 13, 35);
    doc.text("237 Alexandra Road #04-10", 13, 40);
    doc.text("Singapore 159929", 13, 45);
    doc.text("Singapore", 13, 50);

    // Add the table
    const tableData =
      invoiceData.invoiceItemList &&
      invoiceData.invoiceItemList.map((invoiceItem, index) => [
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
      startY: 65,
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
          `: ${invoiceData.subTotal || "0"}`,
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
          `: ${invoiceData.txnDiscount || "0"}`,
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
          `: ${invoiceData.txnTax || "0"}`,
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
          `: ${invoiceData.grandTotal || "0"}`,
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
       doc.text("Customer Notes", 13, finalY);
   
       doc.setFontSize(10);
       doc.setFont("helvetica", "normal");
       const notesText = doc.splitTextToSize(`${invoiceData.description}`, 180); // 180 is the width
       doc.text(notesText, 13, finalY + 6);
   
       const nextY = finalY + 6 + notesText.length * 10; // Adjust next Y position
   
       // Wrap the Terms & Conditions text
       doc.setFontSize(12);
       doc.setFont("helvetica", "normal");
       doc.text("Terms & Conditions", 13, nextY);
   
       doc.setFontSize(10);
       doc.setFont("helvetica", "normal");
       const termsText = doc.splitTextToSize(`${invoiceData.termsAndConditions}`,180); // 180 is the width
       doc.text(termsText, 13, nextY + 6);

    // Save the PDF
    if (action === "download") {
      // doc.sav4e("invoice.pdf");
      doc.save(`Invoice ECSCLOUD.pdf`);
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
                    onClick={() => navigate("/invoices")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          {/* <SendInvoice invoiceData={invoiceData} id={id} generatePDF={() => generatePDF("download")} /> */}
          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER"}
            onClick={handelEdit}
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

      {/* Invoice Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        
        {/* center Content */}
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
              <div className="address-item">
                <label className="text-dark Label">Invoice Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceOwner || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Invoice Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceDate || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Due Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.dueDate || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Grand Total</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.grandTotal || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Hide Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Invoice Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Invoice Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceOwner || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Subject</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.subject || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Sales Commission</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.salesCommission || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Sales Order</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.salesOrder || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Purchase Order</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.purchaseOrder || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.status || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.createdBy || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {invoiceData.createdAt
                    ? invoiceData.createdAt.split("T")[0]
                    : "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {invoiceData.updatedAt
                    ? invoiceData.updatedAt.split("T")[0]
                    : "--"}
                </span>
              </div>
            </div>

            {/* Address Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Shipping Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingStreet || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingState || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingCity || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingCode || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Shipping Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingCountry || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Billing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingStreet || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingState || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingCity || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingCode || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Billing Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingCountry || "--"}
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
                    <span className="my-3 fs-6 fw-bold my-3">Products</span>
                  </div>
                </div>

                <div className="container  col-12">
                  {invoiceData?.invoiceItemList?.length > 0 ? (
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
                          {invoiceData?.invoiceItemList.map(
                            (product, index) => {
                              console.log("object", product);
                              return (
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
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No Product available.</p>
                  )}
                </div>
              </div>

              {/*Invoice Items List */}
              <div className="container-fluid">
                <div className="container-fluid row mt-5 mx-2">
                  <div className="container-fluid p-3 col-md-8"></div>
                  <div className="container-fluid p-3 col-md-4 col-12 border rounded">
                    <div className="container-fluid d-flex justify-content-between py-2">
                      <label className="text-dark ">Sub Total(SGT)</label>
                      <span>: {invoiceData.subTotal}</span>
                    </div>
                    <div className="container-fluid d-flex justify-content-between py-2">
                      <label className="text-dark ">Discount(%)</label>
                      <span>: {invoiceData.txnDiscount}</span>
                    </div>
                    <div className="container-fluid d-flex justify-content-between py-2">
                      <label className="text-dark ">Tax(%)</label>
                      <span>: {invoiceData.txnTax}</span>
                    </div>
                    <div className="container-fluid d-flex justify-content-between py-2">
                      <label className="text-dark ">Grand Total(SGT)</label>
                      <span>: {invoiceData.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Customer Notes
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.description || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes -- */}
        </div>
      </section>
    </>
  );
}

export default InvoiceShow;
