import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
// import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaFilePdf } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import CompanyLogo from "../../assets/Logo.png";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import SendEmail from "../Email/SendEmail";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function QuotesShow() {
  const { id } = useParams();
  const [quoteData, setQuoteData] = useState({});
  const [quotesItemList, setQuotesItemsList] = useState({});
  console.log("Quote Item list", quoteData);
  const [total, setTotal] = useState(0);
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const quotedItems = [
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

  const renderQuotedItems = () => {
    return quotedItems.map((item, index) => (
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
          <span>{item.discount || "0"}</span>
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

  // const [clientData, setClientData] = useState({});
  // const navigate = useNavigate();

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
 
  // console.log("CompanyLogo:", CompanyLogo);
  const generatePDF = (action = "open", CompanyLogo) => {
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
              {
                text: `Time: ${new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`,
                alignment: "right",
              },
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
              { text: `Quotes Owner ` },
              { text: `Subject ` },
              { text: `Valid Until ` },
              { text: `Quotes Stage ` },
              { text: `Deal Name ` },
              { text: `Account Name ` },
              { text: `Status ` },
            ],

            [
              { text: `: ${quoteData.quoteOwner || "--"}`, bold: true },
              { text: `: ${quoteData.subject || "--"}` },
              { text: `: ${quoteData.validUntil || "--"}` },
              { text: `: ${quoteData.quoteStage || "--"}` },
              { text: `: ${quoteData.dealName || "--"}` },
              { text: `: ${quoteData.accountName || "--"}` },
              { text: `: ${quoteData.status || "--"}` },
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
              { text: `: ${quoteData.billingStreet || "--"}` },
              { text: `: ${quoteData.billingCity || "--"}` },
              { text: `: ${quoteData.billingState || "--"}` },
              { text: `: ${quoteData.billingCode || "--"}` },
              { text: `: ${quoteData.billingCountry || "--"}` },
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
              { text: `: ${quoteData.shippingStreet || "--"}` },
              { text: `: ${quoteData.shippingCity || "--"}` },
              { text: `: ${quoteData.shippingState || "--"}` },
              { text: `: ${quoteData.shippingCode || "--"}` },
              { text: `: ${quoteData.shippingCountry || "--"}` },
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
              ...(quoteData.quotesItemList || []).map((item) => [
                item.productName || "--",
                item.listPrice,
                item.quantity,
                item.amount,
                `${item.discount} %`,
                `${item.tax} %`,
                item.total,
              ]),
            ],
          },
        },
        {
          columns: [
            [
              { text: `Sub Total(SGT) `, style: ["column"] },
              { text: `Discount(%) `, style: ["column"] },
              { text: `Tax(%) `, style: ["column"] },
              // { text: `Adjustment(Rs.) `, style: ["column"] },
              { text: `Grand Total(SGT) `, style: ["column"] },

              //  { text: `Sub Total(Rs.) ` },
              // { text: `Discount(Rs.) ` },
              // { text: `Tax(Rs.) ` },
              // { text: `Adjustment(Rs.)  ` },
              // { text: `Grand Total(Rs.) ` },
            ],

            [
              {
                text: `: ${quoteData.subTotal || "--"}`,
                style: ["column"],
              },
              {
                text: `: ${quoteData.txnDiscount || "--"} `,
                style: ["column"],
              },
              {
                text: `: ${quoteData.txnTax || "--"} `,
                style: ["column"],
              },
              // {
              //   text: `: ${quoteData.adjustment || "--"}`,
              //   style: ["column"],
              // },
              {
                text: `: ${quoteData.grandTotal || "--"}`,
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
            [{ qr: `${quoteData.invoiceOwner}`, fit: "100" }],
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
      pdfDocGenerator.download("quote.pdf");
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
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
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
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Deal Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.dealName || ""}
                </span>
              </div>

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

              <div>
                <label className="text-dark Label">Account Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{quoteData.accountName || ""}
                </span>
              </div>

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
                  <label className="text-dark Label">Shipping Code</label>
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
                  <label className="text-dark Label">Billing Code</label>
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
                          {quoteData?.quotesItemList.map((product, index) =>(
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
                {/* Quotes Items List */}
                <div className="container-fluid">
                  <div className="container-fluid row mt-5 mx-2">
                    <div className="container-fluid p-3 col-md-7"></div>
                    <div className="container-fluid p-3 col-md-5 col-12 border rounded">
                      <div className="container-fluid py-2">
                        <div className="row">
                          <div className="col-md-8 col-12">
                            {" "}
                            <label className="text-dark ">Sub Total(SGT)</label>
                          </div>
                          <div className="col-md-4 col-12">
                            {" "}
                            <span>: {quoteData.subTotal || "0"}.00</span>
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
