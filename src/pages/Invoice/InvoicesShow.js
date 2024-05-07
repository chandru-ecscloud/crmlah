import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaFilePdf } from "react-icons/fa";
import CompanyLogo from "../../assets/Logo.png";
import { IoArrowBack } from "react-icons/io5";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";
import SendInvoice from "../Email/SendInvoice";
import SendEmail from "../Email/SendEmail";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function InvoiceShow() {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceItemList, setInvoiceItemsList] = useState({});
  // console.log("Invoice Item list", InvoiceItemList);
  const [total, setTotal] = useState(0);
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();


  const invoiceItems= [
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

  const renderInvoiceItems = () => {
    return invoiceItems.map((item, index) => (
      <tr key={index} style={{ borderTop: "1px solid #9494947c" }}>
        <td className="px-5 py-2">
          <span>{index + 1}</span>
        </td>
        <td className="px-5 py-2">
          <span className="text-primary">
            {item.productName || "--"} <br />
          </span>
        </td>
        <td className="px-5 py-2">
          <span>{item.quantity || "--"}</span>
        </td>
        <td className="px-5 py-2">
          <span>{item.price || "--"}</span>
        </td>
        <td className="px-5 py-2">
          <span>{item.discount || "--"}</span>
        </td>
        <td className="px-5 py-2">
          <span>{item.tax || "--"}</span>
        </td>
        <td className="px-5 py-2">
          <span>{item.totalAmount || "--"}</span>
        </td>
      </tr>
    ));
  };
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
    // console.log("CompanyLogo:", CompanyLogo);
  //  PDF Generate
  const generatePDF = (action = "open") => {
    const docDefinition = {
     
      header: {
        canvas: [
          {
            image: CompanyLogo,
           
          },
          {
            type: "rect",
            x: 0,
            y: 0,
            w: 850, // landscape
            h: 120,
          },
        ],
      },

      content: [
      
        {
          text: "TAX INVOICE",
          fontSize: 25,
          alignment: "center",
          color: "#000000",
          bold: true,
          margin: [0, 0, 0, 20],
        },

        {
          columns: [
            [
              {
                text: `ECS Cloud Infotech pte ltd
                 The Alexcier,
                 237 Alexandra Road, 
                 #04-10, Singapore-159929.`,
              },
            ],
            [
              {
                text: `Date: ${new Date().toLocaleDateString()}`,
                alignment: "right",
              },
              // {
              //   text: `Time: ${new Date().toLocaleTimeString([], {
              //     hour: "2-digit",
              //     minute: "2-digit",
              //   })}`,
              //   alignment: "right",
              // },
            ],
          ],
        },


        // 1, Invoice Information
        {
          text: "Invoice Information",
          style: "sectionHeader",
        },
        {
          columns: [
            [
              { text: `Invoice Owner ` },
              { text: `Subject ` },
              { text: `Invoice Date ` },
              { text: `Due Date ` },
              { text: `Sales Commission ` },
              { text: `Sales Order ` },
              { text: `Purchase Order ` },
              { text: `Status ` },
              { text: `Account Name ` },
              { text: `Deal Name ` },
              { text: `Contact Name ` },
            ],

            [
              { text: `: ${invoiceData.invoiceOwner || "--"}`, bold: true },
              { text: `: ${invoiceData.subject || "--"}` },
              { text: `: ${invoiceData.invoiceDate || "--"}` },
              { text: `: ${invoiceData.dueDate || "--"}` },
              { text: `: ${invoiceData.salesCommission || "--"}` },
              { text: `: ${invoiceData.salesOrder || "--"}` },
              { text: `: ${invoiceData.purchaseOrder || "--"}` },
              { text: `: ${invoiceData.status || "--"}` },
              { text: `: ${invoiceData.accountName || "--"}` },
              { text: `: ${invoiceData.dealName || "--"}` },
              { text: `: ${invoiceData.contactName || "--"}` },
            ],
          ],
        },

        // 2, Address Information
        {
          text: "Address Information",
          style: "sectionHeader",
        },

        {
          text: "Billing Details",
          bold: true,
          style: "sectionHeader",
        },

        {
          columns: [
            [
              { text: `Billing Street ` },
              { text: `Billing City ` },
              { text: `Billing State ` },
              { text: `Billing Code ` },
              { text: `Billing Country ` },
            ],

            [
              { text: `: ${invoiceData.billingStreet || "--"}` },
              { text: `: ${invoiceData.billingCity || "--"}` },
              { text: `: ${invoiceData.billingState || "--"}` },
              { text: `: ${invoiceData.billingCode || "--"}` },
              { text: `: ${invoiceData.billingCountry || "--"}` },
            ],
          ],
        },

        {
          text: "Shipping Details",
          bold: true,
          style: "sectionHeader",
        },

        {
          columns: [
            [
              { text: `Shipping Street ` },
              { text: `Shipping City ` },
              { text: `Shipping State ` },
              { text: `Shipping Code  ` },
              { text: `Shipping Country ` },
            ],

            [
              { text: `: ${invoiceData.shippingStreet || "--"}` },
              { text: `: ${invoiceData.shippingCity || "--"}` },
              { text: `: ${invoiceData.shippingState || "--"}` },
              { text: `: ${invoiceData.shippingCode || "--"}` },
              { text: `: ${invoiceData.shippingCountry || "--"}` },
            ],
          ],
        },

        // 3, Invoiced Items Table
        {
          text: "Invoiced Items",
          style: "sectionHeader",
        },

        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "Product Name", bold: true, fillColor: "#dedede" },
                { text: "Price", bold: true, fillColor: "#dedede" },
                { text: "Quantity", bold: true, fillColor: "#dedede" },
                { text: "Amount", bold: true, fillColor: "#dedede" },
                { text: "Discount", bold: true, fillColor: "#dedede" },
                { text: "Tax", bold: true, fillColor: "#dedede" },
                { text: "Total Amount", bold: true, fillColor: "#dedede" },
              ],
              ...(invoiceData.invoiceItemList || []).map((item)=> [
                item.productName || "--",
                item.listPrice,
                item.quantity ,
                item.productName,
                item.amount,
                item.quantity,
                item.total,
                `${item.discount} %`,
                `${item.tax} %`,
              ]),
            ],
          },
        },
        {
          columns: [
            [
              { text: `Sub Total(Rs.) `, style: ["column"] },
              { text: `Discount(Rs.) `, style: ["column"] },
              { text: `Tax(Rs.) `, style: ["column"] },
              { text: `Adjustment(Rs.) `, style: ["column"] },
              { text: `Grand Total(Rs.) `, style: ["column"] },
            ],
            [
              {
                text: `: ${invoiceData.subTotal || "--"}`,
                style: ["column"],
              },
              {
                text: `: ${invoiceData.txnDiscount || "--"} `,
                style: ["column"],
              },
              {
                text: `: ${invoiceData.txnTax || "--"} `,
                style: ["column"],
              },
              {
                text: `: ${invoiceData.adjustment || "--"}`,
                style: ["column"],
              },
              {
                text: `: ${invoiceData.grandTotal || "--"}`,
                style: ["column"],
              },
              // { text: `: ${quoteData.subTotal || "--"}` style: ['column'] } },
              // { text: `: ${quoteData.discount || "--"}` },
              // { text: `: ${quoteData.tax || "--"}` },
              // { text: `: ${quoteData.adjustment || "--"}` },
              // { text: `: ${quoteData.grandTotal || "--"}` },
            ],
          ],
        },


        // 4 ,Terms and Conditions
        {
          text: "Terms and Conditions",
          style: "sectionHeader",
        },
        {
          // text: this.itemDescription,
          text: `Invoice Amount transfer to the below details, Bank : Axis Bank Branch : xxx Branch, Chennai-600 002. A/c No : 9...............67 . IFSC : AXIS0004.
            Just for Demo Purpose`,
          margin: [0, 10, 0, 15],
        },

        // 5 ,Description Information
        {
          text: "Description Information",
          style: "sectionHeader",
        },
        {
          text: "",
          margin: [0, 0, 0, 15],
        },

        {
          columns: [
            [{ qr: `${invoiceData.invoiceOwner}`, fit: "100" }],
            [
              {
                text: "Authorized Signature",
                alignment: "right",
                italics: true,
              },
            ],
          ],
        },
      ],

      styles: {
        sectionHeader: {
          bold: true,
          decoration: "underline",
          fontSize: 14,
          margin: [0, 25, 0, 15],
        },
        column: {
          margin: [0, 10, 0, 0], // Margin top is set to 10
          border: "1px solid black", // Border style
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    if (action === "download") {
      pdfDocGenerator.download("invoice.pdf");
    } else if (action === "print") {
      pdfDocGenerator.print();
    } else {
      pdfDocGenerator.open();
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
          <SendInvoice invoiceData={invoiceData} id={id} />

          {/* <SendEmail /> */}

          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
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
              <li className="dropdown-item" onClick={() => generatePDF()}>
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
                <span class="badge text-bg-danger">{productTotal}</span>
              </Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">
                <span>Deals </span>
                <span class="badge text-bg-danger">{dealTotal}</span>
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
                <label className="text-dark Label">Invoice Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceOwner || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.email || "--"}
                </span>
              </div> */}

              {/* <div>
                <label className="text-dark Label">Invoice Number</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceNumber || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Invoice Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceDate || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Due Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.dueDate || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Grand Total</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.grandTotal || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Lead Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.leadName || "--"}
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
              <span className="fs-6 fw-bold"> Invoice Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Invoice Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceOwner || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Subject</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.subject || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Sales Commission</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.salesCommission || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.accountName || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Contact Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.contactName || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Deal Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.dealName || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              {/* <div>
                <label className="text-dark Label">Invoice Number</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.invoiceNumber || "--"}
                </span>
              </div> */}

              <div>
                <label className="text-dark Label">Sales Order</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.salesOrder || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Purchase Order</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.purchaseOrder || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.status || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.createdBy || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.modifiedBy || "--"}
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
                    &nbsp; : &nbsp;{invoiceData.shippingStreet || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingState || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingCity || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingCode || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Shipping Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.shippingCountry || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Billing Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingStreet || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingState || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingCity || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Billing Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{invoiceData.billingCode || "--"}
                  </span>
                </div>
                <div>
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
                          {invoiceData?.invoiceItemList.map((product, index) => (
                            <tr key={product.id}>
                              <td>{index + 1}</td>
                              <td>{product.productName || "--"}</td>
                              <td>{product.quantity || "--"}</td>
                              <td>{product.listPrice || "--"}</td>
                              <td>{product.amount || "--"}</td>
                              <td>{product.discount || "--"}</td>
                              <td>{product.tax || "--"}</td>
                              <td>{product.total || "--"}</td>
                            </tr>
                          ))}
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
                        <label className="text-dark ">
                        Sub Total(Rs.)
                        </label>
                        <span>: {invoiceData.subTotal}</span>
                      </div>
                      <div className="container-fluid d-flex justify-content-between py-2">
                        <label className="text-dark ">
                          Discount(Rs.)
                        </label>
                        <span>: {invoiceData.txnDiscount}</span>
                      </div>
                      <div className="container-fluid d-flex justify-content-between py-2">
                        <label className="text-dark ">
                          Tax(Rs.) 
                        </label>
                        <span>: {invoiceData.txnTax}</span>
                      </div>
                      <div className="container-fluid d-flex justify-content-between py-2">
                        <label className="text-dark ">
                          Adjustment(Rs.) 
                        </label>
                        <span>: {invoiceData.adjustment || "0" }.00</span>
                      </div>
                      <div className="container-fluid d-flex justify-content-between py-2">
                        <label className="text-dark ">
                          Grand Total(Rs.) 
                        </label>
                        <span>: {invoiceData.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/* Quotes Information Table*/}
              <div className="container-fluid row" id="Details">
                <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="my-3 fs-6 fw-bold my-3">Deal</span>
                  </div>
                </div>

                <div className="container  col-12">
                  {invoiceData.dealsWithInvoice ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Deal Name</th>
                            <th scope="col">Account Name</th>
                            <th scope="col">Contact Name</th>
                            <th scope="col">Stage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceData.dealsWithInvoice.map((deal, index) => (
                            <tr key={deal.id}>
                              <td>{index + 1}</td>
                              <td>{deal.dealName || "--"}</td>
                              <td>{deal.accountName || "--"}</td>
                              <td>{deal.contactName || "--"}</td>
                              <td>{deal.stage || "--"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No Invoice available.</p>
                  )}
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
                  <span>00.00</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Discount(Rs.)</label>
                  <span>00.00</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Tax(Rs.)</label>
                  <span>00.00</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">Adjustment(Rs.)</label>
                  <span>00.00</span>
                </div>
                <div className="border-bottom mt-3 p-1">
                  <label className="text-dark">GrandTotal(Rs.)</label>
                  <span>00.00</span>
                </div>
              </div> */}
            </div>

            {/* Description Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Description Information
                </span>
              </div>

              <div>
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{invoiceData.description || "--"}
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

export default InvoiceShow;
