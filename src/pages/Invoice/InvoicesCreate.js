import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { FaTrash } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";

const validationSchema = yup.object({
  invoiceOwner: yup.string().required("*Select The Invoice Owner"),
  // salesOrder: yup.string().required("*Enter The Sales Order"),
  subject: yup.string().required("*Enter The Subject"),
  // purchaseOrder: yup.string().required("*Enter The Purchase Order"),
  invoiceDate: yup.string().required("*Enter The Invoice Date"),
  status: yup.string().required("*Enter The Status"),
  dueDate: yup.string().required("*Enter The Due Date"),
  // salesCommission: yup.string().required("*Enter The Sales Commission"),
  salesCommission: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .required("*Enter The Sales Commission"),
  // dealName: yup.string().required("*Select The Deal Name "),
  // accountName: yup.string().required("*Select The Account Name "),
  // contactName: yup.string().required("*Select The Contact Name "),
  shippingStreet: yup.string().required("*Enter The Shipping Street "),
  billingStreet: yup.string().required("*Enter The Billing Street "),
  shippingCity: yup.string().required("*Enter The Shipping City "),
  billingCity: yup.string().required("*Enter The Billing City "),
  shippingState: yup.string().required("*Enter The Shipping State "),
  billingState: yup.string().required("*Enter The Billing State "),
  shippingCode: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .required("*Enter The Shipping Code "),
  billingCode: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .required("*Enter The Billing Code "),
  shippingCountry: yup.string().required("*Enter The Shipping Country "),
  billingCountry: yup.string().required("*Enter The Billing Country "),
  termsAndConditions: yup.string().required("*Enter The termsAndConditions "),
  // description: yup.string().required("*Enter The Description "),
});
function InvoicesCreate() {
  const [rows, setRows] = useState([{}]);
  console.log("rows", rows);
  const [adjustment, setAdjustment] = React.useState(0);
  const [grandTotal, setGrandTotal] = React.useState(0);
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [productOptions, setProductOptions] = useState([]);
  // console.log("productOptions:", productOptions);
  const [accountOption, setAccountOption] = useState([]);
  // console.log(accountOption);
  const [dealOption, setDealOption] = useState([]);
  // console.log(dealOption);/
  const [contactOption, setContactOption] = useState([]);
  // console.log(contactOption);
  const [userImage, setUserImage] = useState(User);
  const navigate = useNavigate();

  const addRow = () => {
    const updatedRows = [...rows, {}];
    setRows(updatedRows);

    const updatedInvoiceItemList = [
      ...formik.values.invoiceItemList,
      {
        productId: "",
        productName: "",
        quantity: "",
        listPrice: "",
        amount: "",
        discount: "",
        tax: "",
        total: "",
      },
    ];

    formik.setFieldValue("invoiceItemList", updatedInvoiceItemList);
    console.log(formik.values.invoiceItemList);
  };

  const deleteRow = () => {
    if (rows.length === 1) {
      // Prevent deleting the last row
      return;
    }

    const updatedRows = rows.slice(0, -1);
    setRows(updatedRows);

    const updatedInvoiceItemList = formik.values.invoiceItemList.slice(0, -1);
    formik.setFieldValue("invoiceItemList", updatedInvoiceItemList);
  };

  const formik = useFormik({
    initialValues: {
      invoiceOwner: owner,
      companyId: companyId,
      salesOrder: "",
      subject: "",
      purchaseOrder: "",
      invoiceDate: "",
      status: "",
      dueDate: "",
      salesCommission: "",
      dealName: "",
      accountName: "",
      contactName: "",
      shippingStreet: "",
      billingStreet: "",
      shippingCity: "",
      billingCity: "",
      shippingState: "",
      billingState: "",
      shippingCode: "",
      billingCode: "",
      shippingCountry: "",
      billingCountry: "",
      termsAndConditions: "",
      description: "",
      adjustment: "",
      subTotal: "",
      grandTotal: "",
      txnDiscount: "",
      txnTax: "",
      invoiceItemList: [
        {
          productName: "",
          quantity: "",
          listPrice: "",
          amount: "",
          discount: "",
          tax: "",
          total: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Invoice Create:", values);
      try {
        const payload = {
          transactionInvoice: {
            companyId: companyId,
            invoiceOwner: values.invoiceOwner,
            salesOrder: values.salesOrder,
            subject: values.subject,
            purchaseOrder: values.purchaseOrder,
            description: values.description,
            termsAndConditions: values.termsAndConditions,
            invoiceDate: values.invoiceDate,
            status: values.status,
            dueDate: values.dueDate,
            salesCommission: values.salesCommission,
            dealName: values.dealName,
            accountName: values.accountName,
            contactName: values.contactName,
            billingStreet: values.billingStreet,
            billingCity: values.billingCity,
            billingState: values.billingState,
            billingCode: values.billingCode,
            billingCountry: values.billingCountry,
            shippingStreet: values.shippingStreet,
            shippingCity: values.shippingCity,
            shippingState: values.shippingState,
            shippingCode: values.shippingCode,
            shippingCountry: values.shippingCountry,
            adjustment: values.adjustment,
            subTotal: values.subTotal,
            grandTotal: values.grandTotal,
            txnDiscount: values.txnDiscount,
            txnTax: values.txnTax,
          },
          invoiceItemList: rows.map((item) => ({
            productId: item.selectedOption,
            productName: item.productName,
            quantity: item.quantity,
            listPrice: item.listPrice,
            amount: item.amount,
            discount: parseInt(item.discount),
            tax: parseInt(item.tax),
            total: parseInt(item.total),
          })),
        };
        console.log("Payload:", payload);
        const response = await axios.post(
          `${API_URL}createTransactionInvoiceAndInvoiceItems`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/invoices");
          console.log("Create Invoice Data:", response.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const AccountList = async () => {
    try {
      const response = await axios(`${API_URL}accountNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setAccountOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DealList = async () => {
    try {
      const response = await axios(`${API_URL}dealNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setDealOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ContactList = async () => {
    try {
      const response = await axios(`${API_URL}contactNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setContactOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ProductList = async () => {
    try {
      const response = await axios(
        `${API_URL}allProductsByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectChange = async (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = value;
    try {
      const response = await axios.get(`${API_URL}allProducts/${value}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      const productName = response.data.productName;
      const listPrice = response.data.unitPrice;
      const tax = response.data.tax;
      updatedRows[index].productName = productName;
      updatedRows[index].listPrice = listPrice;
      updatedRows[index].quantity = 1;
      updatedRows[index].amount = listPrice; // Update amount based on list price
      updatedRows[index].tax = tax;
      updatedRows[index].discount = 0;
      updatedRows[index].total = listPrice; // Update total based on list price
      setRows(updatedRows);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = value === "" ? 0 : parseInt(value, 10); // Parse value to integer

    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;

    updatedRows[index].amount = listPrice * quantity;

    // Calculate the total based on listPrice, quantity, discount, and tax
    updatedRows[index].total =
      (updatedRows[index].amount *
        (100 - updatedRows[index].discount) *
        (100 + updatedRows[index].tax)) /
      10000;

    setRows(updatedRows);
  };

  const handleDiscountChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].discount = value;

    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;
    const discount = value || 0;
    const tax = updatedRows[index].tax || 0;

    updatedRows[index].amount = listPrice * quantity;

    // Calculate the total amount considering the discount and tax
    const totalAmountBeforeTax =
      updatedRows[index].amount * (1 - discount / 100);
    const totalAmount = totalAmountBeforeTax * (1 + tax / 100);

    updatedRows[index].total = totalAmount;

    setRows(updatedRows);
    calculateTotals();
  };

  const handleTaxChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].tax = value;

    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;
    const discount = updatedRows[index].discount || 0;
    const taxPercentage = value || 0;

    let taxAmount = 0;
    if (taxPercentage < 18) {
      // For tax below 18%, calculate tax amount
      taxAmount = (listPrice * quantity * taxPercentage) / 100;
    } else {
      // For tax 18% or above, calculate tax amount including cess
      const taxAmountBeforeCess = (listPrice * quantity * taxPercentage) / 100;
      taxAmount = taxAmountBeforeCess + (taxAmountBeforeCess * 1) / 100;
    }

    updatedRows[index].amount = listPrice * quantity;
    updatedRows[index].total =
      (updatedRows[index].amount * (100 - discount) * (100 + taxAmount)) /
      10000;

    setRows(updatedRows);
    calculateTotals();
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;

    rows.forEach((row) => {
      subtotal += parseInt(row.amount);
      totalDiscount += parseInt(row.discount);
      totalTax += parseInt(row.tax);
      grandTotal += parseInt(row.total);
    });

    formik.setFieldValue("subTotal", isNaN(subtotal) ? 0 : subtotal);
    formik.setFieldValue(
      "txnDiscount",
      isNaN(totalDiscount) ? 0 : totalDiscount
    );
    formik.setFieldValue("txnTax", isNaN(totalTax) ? 0 : totalTax);
    formik.setFieldValue("grandTotal", isNaN(grandTotal) ? 0 : grandTotal);
  };

  // const handleAdjustmentChange = (e) => {
  //   const adjustmentValue = parseFloat(e.target.value);
  //   const newGrandTotal = (parseFloat(grandTotal) - adjustmentValue).toFixed(2);
  //   setAdjustment(adjustmentValue);
  //   formik.setFieldValue("grandTotal", newGrandTotal);
  // };

  useEffect(() => {
    calculateTotals();
  }, [rows]);

  useEffect(() => {
    ProductList();
    AccountList();
    DealList();
    ContactList();
  }, []);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Invoice</b>
                <br></br>
                {/* <img
                  src={userImage}
                  className="img-fluid mt-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  alt="user"
                  onClick={() => document.getElementById("imageInput").click()}
                /> */}
                {/* Input for image upload */}
                {/* <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" /> */}
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/invoices"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Invoice Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Invoice Owner</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="invoiceOwner"
                  className={`form-control form-size  ${formik.touched.invoiceOwner && formik.errors.invoiceOwner
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("invoiceOwner")}
                  id="invoiceOwner"
                  value={owner}
                  readOnly
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.invoiceOwner &&
                    formik.errors.invoiceOwner && (
                      <div className="text-danger">
                        {formik.errors.invoiceOwner}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales Order</lable>
              &nbsp;&nbsp; 
                <input
                  type="text"
                  name="salesOrder"
                  id="salesOrder"
                  className={`form-control form-size  ${formik.touched.salesOrder && formik.errors.salesOrder
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("salesOrder")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.salesOrder && formik.errors.salesOrder && (
                    <div className="text-danger">
                      {formik.errors.salesOrder}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Subject</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className={`form-control form-size  ${formik.touched.subject && formik.errors.subject
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("subject")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="text-danger">{formik.errors.subject}</div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Email</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="email"
                  className={`form-control form-size  ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger">{formik.errors.email}</div>
                  )}
                </div>
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Purchase Order</lable>
                &nbsp;&nbsp; 
                <input
                  type="text"
                  name="purchaseOrder"
                  id="purchaseOrder"
                  className={`form-control form-size  ${formik.touched.purchaseOrder && formik.errors.purchaseOrder
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("purchaseOrder")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.purchaseOrder &&
                    formik.errors.purchaseOrder && (
                      <div className="text-danger">
                        {formik.errors.purchaseOrder}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable> Invoice Date</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="date"
                  name="invoiceDate"
                  id="invoiceDate"
                  className={`form-control form-size  ${formik.touched.invoiceDate && formik.errors.invoiceDate
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("invoiceDate")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                    <div className="text-danger">
                      {formik.errors.invoiceDate}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Status</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  type="text"
                  name="status"
                  id="status"
                  className={`form-select form-size  ${formik.touched.status && formik.errors.status
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("status")}
                >
                  <option value=""></option>
                  <option value="Analysed">Analysed</option>
                  <option value="Processed">Processed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Intermediated">Intermediated</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Due Date</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="date"
                  name="dueDate.substring(0,10)"
                  id="dueDate"
                  className={`form-control form-size  ${formik.touched.dueDate && formik.errors.dueDate
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("dueDate")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.dueDate && formik.errors.dueDate && (
                    <div className="text-danger">{formik.errors.dueDate}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales Commission</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="salesCommission"
                  id="salesCommission"
                  className={`form-control form-size  ${formik.touched.salesCommission &&
                      formik.errors.salesCommission
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("salesCommission")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.salesCommission &&
                    formik.errors.salesCommission && (
                      <div className="text-danger">
                        {formik.errors.salesCommission}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Deal Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
               
                <select
                  style={{ width: "60%" }}
                  name="dealName"
                  className={`form-select form-size  ${formik.touched.dealName && formik.errors.dealName
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("dealName")}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(dealOption) &&
                    dealOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>

              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {" "}
                  {formik.touched.dealName && formik.errors.dealName && (
                    <div className="text-danger">{formik.errors.dealName}</div>
                  )}
                </div>
              </div>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Account Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  name="accountName"
                  className={`form-select form-size  ${formik.touched.accountName && formik.errors.accountName
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("accountName")}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(accountOption) &&
                    accountOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {" "}
                  {formik.touched.accountName &&
                    formik.errors.accountName && (
                      <div className="text-danger">
                        {formik.errors.accountName}
                      </div>
                    )}
                </div>
              </div>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Contact Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  name="contactName"
                  className={`form-select form-size  ${formik.touched.contactName && formik.errors.contactName
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("contactName")}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(contactOption) &&
                    contactOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.contactName && formik.errors.contactName && (
                    <div className="text-danger">
                      {formik.errors.contactName}
                    </div>
                  )}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Street</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="shippingStreet"
                  id="shippingStreet"
                  className={`form-control form-size  ${formik.touched.shippingStreet &&
                      formik.errors.shippingStreet
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("shippingStreet")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device ">
                  {formik.touched.shippingStreet &&
                    formik.errors.shippingStreet && (
                      <div className="text-danger">
                        {formik.errors.shippingStreet}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Street</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="billingStreet"
                  id="billingStreet"
                  className={`form-control form-size  ${formik.touched.billingStreet && formik.errors.billingStreet
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("billingStreet")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.billingStreet &&
                    formik.errors.billingStreet && (
                      <div className="text-danger">
                        {formik.errors.billingStreet}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping City</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="shippingCity"
                  id="shippingCity"
                  className={`form-control form-size  ${formik.touched.shippingCity && formik.errors.shippingCity
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("shippingCity")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.shippingCity &&
                    formik.errors.shippingCity && (
                      <div className="text-danger">
                        {formik.errors.shippingCity}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing City</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="billingCity"
                  id="billingCity"
                  className={`form-control form-size  ${formik.touched.billingCity && formik.errors.billingCity
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("billingCity")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.billingCity && formik.errors.billingCity && (
                    <div className="text-danger">
                      {formik.errors.billingCity}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping State</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="shippingState"
                  id="shippingState"
                  className={`form-control form-size  ${formik.touched.shippingState && formik.errors.shippingState
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("shippingState")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.shippingState &&
                    formik.errors.shippingState && (
                      <div className="text-danger">
                        {formik.errors.shippingState}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing State</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="billingState"
                  id="billingState"
                  className={`form-control form-size  ${formik.touched.billingState && formik.errors.billingState
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("billingState")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.billingState &&
                    formik.errors.billingState && (
                      <div className="text-danger">
                        {formik.errors.billingState}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Zip Code</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="shippingCode"
                  id="shippingCode"
                  className={`form-control form-size  ${formik.touched.shippingCode && formik.errors.shippingCode
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("shippingCode")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.shippingCode &&
                    formik.errors.shippingCode && (
                      <div className="text-danger">
                        {formik.errors.shippingCode}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Zip Code</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="billingCode"
                  id="billingCode"
                  className={`form-control form-size  ${formik.touched.billingCode && formik.errors.billingCode
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("billingCode")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.billingCode && formik.errors.billingCode && (
                    <div className="text-danger">
                      {formik.errors.billingCode}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Country</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="shippingCountry"
                  id="shippingCountry"
                  className={`form-control form-size  ${formik.touched.shippingCountry &&
                      formik.errors.shippingCountry
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("shippingCountry")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.shippingCountry &&
                    formik.errors.shippingCountry && (
                      <div className="text-danger">
                        {formik.errors.shippingCountry}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Country</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  name="billingCountry"
                  id="billingCountry"
                  className={`form-control form-size  ${formik.touched.billingCountry &&
                      formik.errors.billingCountry
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("billingCountry")}
                />
              </div>
              <div className="row  sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.billingCountry &&
                    formik.errors.billingCountry && (
                      <div className="text-danger">
                        {formik.errors.billingCountry}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="container-fluid my-5">
          <h4>
            <b>Invoice Items</b>
          </h4>
        </div>
        <div className="container">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    Product Name
                  </th>
                  <th scope="col">Quantity</th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    List Price
                  </th>
                  <th scope="col">Amount</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Tax</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody className="table-secondary">
                {rows.map((row, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <select
                        className="form-select"
                        name={`invoiceItemList[${index}].productName`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].productName`
                        )}
                        value={row.selectedOption}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                      >
                        <option selected value=""></option>
                        {productOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.productName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`invoiceItemList[${index}].quantity`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].quantity`
                        )}
                        value={row.quantity}
                        className="form-control"
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`invoiceItemList[${index}].listPrice`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].listPrice`
                        )}
                        value={row.listPrice}
                        className="form-control"
                        id={`listPrice_${index}`}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`invoiceItemList[${index}].amount`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].amount`
                        )}
                        value={row.amount}
                        className="form-control"
                        id={`amount_${index}`}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`invoiceItemList[${index}].discount`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].discount`
                        )}
                        value={row.discount}
                        className="form-control"
                        onChange={(e) =>
                          handleDiscountChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`invoiceItemList[${index}].tax`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].tax`
                        )}
                        value={row.tax}
                        readOnly
                        className="form-control"
                        onChange={(e) => handleTaxChange(index, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`invoiceItemList[${index}].total`}
                        {...formik.getFieldProps(
                          `invoiceItemList[${index}].total`
                        )}
                        value={row.total ? row.total.toFixed(2) : 0}
                        className="form-control"
                        id={`total_${index}`}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-primary" onClick={addRow}>
            Add Row
          </button>
          {rows.length > 1 && (
            <button
              type="button"
              className="btn btn-outline-danger mx-3"
              onClick={deleteRow}
            >
              <FaTrash />
            </button>
          )}
        </div>

        {/* Invoice Items Counts */}
        <div className="container-fluid">
          <div className="container-fluid row mt-5 mx-2">
            <div className="container-fluid p-3 col-md-8"></div>
            <div className="container-fluid p-3 col-md-4 col-12 border rounded">
              <div className="container-fluid py-2">
                <label className="text-dark text-end">Sub Total(SGT)</label>
                <input
                  {...formik.getFieldProps("subTotal")}
                  name="subTotal"
                  className="form-control p-1"
                  type="text"
                  readOnly
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Discount (%)</label>
                <div className="input-group">
                  <input
                    className="form-control p-1"
                    type="text"
                    {...formik.getFieldProps("txnDiscount")}
                    name="txnDiscount"
                    readOnly
                  />
                </div>
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Tax (%)</label>
                <div className="input-group">
                  <input
                    className="form-control p-1"
                    type="text"
                    {...formik.getFieldProps("txnTax")}
                    name="txnTax"
                    readOnly
                  />
                </div>
              </div>
              {/* <div className="container-fluid py-2">
                <label className="text-dark">Adjustment(SGT)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("adjustment")}
                  name="adjustment"
                  onChange={handleAdjustmentChange}
                />
              </div> */}
              <div className="container-fluid py-2">
                <label className="text-dark">Grand Total(SGT)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("grandTotal")}
                  name="grandTotal"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Terms and Conditions</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-start justify-content-center mb-3 sm-device">
                <lable>Terms & Conditions</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <textarea
                  rows="3"
                  type="text"
                  className={`form-control form-size  ${formik.touched.termsAndConditions && formik.errors.termsAndConditions
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("termsAndConditions")}
                  name="termsAndConditions"
                  id="termsAndConditions"
                />
              </div>
            </div>
          </div>
          <div className="row  sm-device">
            <div className="col-5"></div>
            <div className="col-6  sm-device">
              {formik.touched.termsAndConditions &&
                formik.errors.termsAndConditions && (
                  <div className="text-danger">
                    {formik.errors.termsAndConditions}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Description Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-start justify-content-center mb-3 sm-device">
                <lable>Description</lable>
                &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className={`form-control form-size  ${formik.touched.description && formik.errors.description
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("description")}
                  name="description"
                  id="description"
                />
              </div>
            </div>
          </div>
          <div className="row  sm-device">
            <div className="col-5"></div>
            <div className="col-6  sm-device">
              {formik.touched.description &&
                formik.errors.description && (
                  <div className="text-danger">
                    {formik.errors.description}
                  </div>
                )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default InvoicesCreate;
