import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";

const validationSchema = yup.object({
  invoice_owner: yup.string().required("*Select The Invoice Owner"),
  sales_order: yup.string().required("*Enter The Sales Order"),
  subject: yup.string().required("*Enter The Subject"),
  purchase_order: yup.string().required("*Enter The Purchase Order"),
  invoice_date: yup.string().required("*Enter The Invoice Date"),
  status: yup.string().required("*Enter The Status"),
  due_date: yup.string().required("*Enter The Due Date"),
  sales_commission: yup.string().required("*Enter The Sales Commission"),
  deal_name: yup.string().required("*Select The Deal Name "),
  account_name: yup.string().required("*Select The Account Name "),
  contact_name: yup.string().required("*Select The Contact Name "),
  shipping_street: yup.string().required("*Enter The Shipping Street "),
  billing_street: yup.string().required("*Enter The Billing Street "),
  shipping_city: yup.string().required("*Enter The Shipping City "),
  billing_city: yup.string().required("*Enter The Billing City "),
  shipping_state: yup.string().required("*Enter The Shipping State "),
  billing_state: yup.string().required("*Enter The Billing State "),
  shipping_code: yup.string().required("*Enter The Shipping Code "),
  billing_code: yup.string().required("*Enter The Billing Code "),
  shipping_country: yup.string().required("*Enter The Shipping Country "),
  billing_country: yup.string().required("*Enter The Billing Country "),
  terms_and_conditions: yup
    .string()
    .required("*Enter The  terms_and_conditions "),
  description: yup.string().required("*Enter The Description "),
});

function InvoicesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState(User);
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const [accountOption, setAccountOption] = useState([]);
  const [dealOption, setDealOption] = useState([]);
  const [contactOption, setContactOption] = useState([]);

  const formik = useFormik({
    initialValues: {
      invoice_owner: "",
      company_id: userId,
      sales_order: "",
      subject: "",
      purchase_order: "",
      invoice_date: "",
      status: "",
      due_date: "",
      sales_commission: "",
      deal_name: "",
      account_name: "",
      contact_name: "",
      shipping_street: "",
      billing_street: "",
      shipping_city: "",
      billing_city: "",
      shipping_state: "",
      billing_state: "",
      shipping_code: "",
      billing_code: "",
      shipping_country: "",
      billing_country: "",
      terms_and_conditions: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Invoice:", data);
      try {
        const response = await axios.put(
          `${API_URL}updateInvoice/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/invoices");
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

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${API_URL}allInvoices/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        const validstring = getData.invoiceDate;
        const InvoiceDate = new Date(validstring);
        const InvoiceDate1 = `${InvoiceDate.getFullYear()}-${(
          InvoiceDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${InvoiceDate.getDate()
          .toString()
          .padStart(2, "0")}`;
        const validstring1 = getData.dueDate;
        const DueDate = new Date(validstring1);
        const DueDate1 = `${DueDate.getFullYear()}-${(DueDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${DueDate.getDate().toString().padStart(2, "0")}`;

        const payload = {
          invoice_owner: getData.invoiceOwner,
          sales_order: getData.salesOrder,
          subject: getData.subject,
          purchase_order: getData.purchaseOrder,
          invoice_date: InvoiceDate1,
          status: getData.status,
          due_date: DueDate1,
          sales_commission: getData.salesCommission,
          deal_name: getData.dealName,
          account_name: getData.accountName,
          contact_name: getData.contactName,
          shipping_street: getData.shippingStreet,
          billing_street: getData.billingStreet,
          shipping_city: getData.shippingCity,
          billing_city: getData.billingCity,
          shipping_state: getData.shippingState,
          billing_state: getData.billingState,
          shipping_code: getData.shippingCode,
          billing_code: getData.billingCode,
          shipping_country: getData.shippingCountry,
          billing_country: getData.billingCountry,
          terms_and_conditions: getData.termsAndConditions,
          description: getData.description,
        };
        console.log(getData.invoiceOwner);
        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
    AccountList();
    DealList();
    ContactList();
  }, [id]);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Invoice</b>
                <br></br>
                <img
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
                />
                {/* Input for image upload */}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" />
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/invoices"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Update
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
            <input
              type="hidden"
              //  value={userId}
              name="company_id"
            />
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Invoice Owner</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  name="invoice_owner"
                  className={`form-select form-size  ${
                    formik.touched.invoice_owner && formik.errors.invoice_owner
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("invoice_owner")}
                >
                  <option value={owner}>{owner}</option>
                  <option value="Vignesh Devan">Vignesh Devan</option>
                  <option value="Chandru R">Chandru R</option>
                  <option value="Gayathri M">Gayathri M</option>
                  <option value="Poongodi K">Poongodi K</option>
                  <option value="Suriya G">Suriya G</option>
                  <option value="Leela Prasanna D">Leela Prasanna D</option>
                  <option value="Saravanan M">Saravanan M</option>
                  <option value="Nagaraj VR">Nagaraj VR</option>
                  <option value="Yalini A">Yalini A</option>
                  <option value="Vishnu Priya">Vishnu Priya</option>
                  <option value="Kavitha">Kavitha</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6  sm-device">
                  {formik.touched.invoice_owner &&
                    formik.errors.invoice_owner && (
                      <div className="text-danger">
                        {formik.errors.invoice_owner}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales Order</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="sales_order"
                  className={`form-control form-size  ${
                    formik.touched.sales_order && formik.errors.sales_order
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("sales_order")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.sales_order && formik.errors.sales_order && (
                    <div className="text-danger">
                      {formik.errors.sales_order}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Subject</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="subject"
                  className={`form-control form-size  ${
                    formik.touched.subject && formik.errors.subject
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subject")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="text-danger">{formik.errors.subject}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Purchase Order</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="purchase_order"
                  className={`form-control form-size  ${
                    formik.touched.purchase_order &&
                    formik.errors.purchase_order
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("purchase_order")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.purchase_order &&
                    formik.errors.purchase_order && (
                      <div className="text-danger">
                        {formik.errors.purchase_order}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable> Invoice Date</lable> &nbsp;&nbsp;
                <input
                  type="date"
                  name="invoice_date"
                  className={`form-control form-size  ${
                    formik.touched.invoice_date && formik.errors.invoice_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("invoice_date")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.invoice_date &&
                    formik.errors.invoice_date && (
                      <div className="text-danger">
                        {formik.errors.invoice_date}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Status</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  name="status"
                  className={`form-select form-size  ${
                    formik.touched.status && formik.errors.status
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

              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Due Date</lable> &nbsp;&nbsp;
                <input
                  type="date"
                  name="due_date"
                  className={`form-control form-size  ${
                    formik.touched.due_date && formik.errors.due_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("due_date")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.due_date && formik.errors.due_date && (
                    <div className="text-danger">{formik.errors.due_date}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales Commission</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="sales_commission"
                  className={`form-control form-size  ${
                    formik.touched.sales_commission &&
                    formik.errors.sales_commission
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("sales_commission")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.sales_commission &&
                    formik.errors.sales_commission && (
                      <div className="text-danger">
                        {formik.errors.sales_commission}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Deal Name</lable> &nbsp;&nbsp;
                {/* <input
             
              type="text"
              className="form-size form-control"
              id="deal_name"
            /> */}
                <select
                  style={{ width: "60%" }}
                  name="deal_name"
                  className={`form-select form-size  ${
                    formik.touched.deal_name && formik.errors.deal_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("deal_name")}
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

              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {" "}
                  {formik.touched.deal_name && formik.errors.deal_name && (
                    <div className="text-danger">{formik.errors.deal_name}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  name="account_name"
                  className={`form-select form-size  ${
                    formik.touched.account_name && formik.errors.account_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("account_name")}
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
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {" "}
                  {formik.touched.account_name &&
                    formik.errors.account_name && (
                      <div className="text-danger">
                        {formik.errors.account_name}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Contact Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  name="contact_name"
                  className={`form-select form-size  ${
                    formik.touched.contact_name && formik.errors.contact_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("contact_name")}
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
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.contact_name &&
                    formik.errors.contact_name && (
                      <div className="text-danger">
                        {formik.errors.contact_name}
                      </div>
                    )}
                </div>
              </div>
            </div>
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
                <lable>Shipping Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="shipping_street"
                  className={`form-control form-size  ${
                    formik.touched.shipping_street &&
                    formik.errors.shipping_street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_street")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device ">
                  {formik.touched.shipping_street &&
                    formik.errors.shipping_street && (
                      <div className="text-danger">
                        {formik.errors.shipping_street}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Street</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="billing_street"
                  className={`form-control form-size  ${
                    formik.touched.billing_street &&
                    formik.errors.billing_street
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_street")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_street &&
                    formik.errors.billing_street && (
                      <div className="text-danger">
                        {formik.errors.billing_street}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="shipping_city"
                  className={`form-control form-size  ${
                    formik.touched.shipping_city && formik.errors.shipping_city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_city")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_city &&
                    formik.errors.shipping_city && (
                      <div className="text-danger">
                        {formik.errors.shipping_city}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing City</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="billing_city"
                  className={`form-control form-size  ${
                    formik.touched.billing_city && formik.errors.billing_city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_city")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_city &&
                    formik.errors.billing_city && (
                      <div className="text-danger">
                        {formik.errors.billing_city}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="shipping_state"
                  className={`form-control form-size  ${
                    formik.touched.shipping_state &&
                    formik.errors.shipping_state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_state")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_state &&
                    formik.errors.shipping_state && (
                      <div className="text-danger">
                        {formik.errors.shipping_state}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing State</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="billing_state"
                  className={`form-control form-size  ${
                    formik.touched.billing_state && formik.errors.billing_state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_state")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_state &&
                    formik.errors.billing_state && (
                      <div className="text-danger">
                        {formik.errors.billing_state}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="shipping_code"
                  className={`form-control form-size  ${
                    formik.touched.shipping_code && formik.errors.shipping_code
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_code")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_code &&
                    formik.errors.shipping_code && (
                      <div className="text-danger">
                        {formik.errors.shipping_code}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Code</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="billing_code"
                  className={`form-control form-size  ${
                    formik.touched.billing_code && formik.errors.billing_code
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_code")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_code &&
                    formik.errors.billing_code && (
                      <div className="text-danger">
                        {formik.errors.billing_code}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="shipping_country"
                  className={`form-control form-size  ${
                    formik.touched.shipping_country &&
                    formik.errors.shipping_country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("shipping_country")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shipping_country &&
                    formik.errors.shipping_country && (
                      <div className="text-danger">
                        {formik.errors.shipping_country}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Country</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="billing_country"
                  className={`form-control form-size  ${
                    formik.touched.billing_country &&
                    formik.errors.billing_country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("billing_country")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billing_country &&
                    formik.errors.billing_country && (
                      <div className="text-danger">
                        {formik.errors.billing_country}
                      </div>
                    )}
                </div>
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
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Terms & Conditions</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  style={{ width: "70%" }}
                  name="terms_and_conditions"
                  className={`form-control form-size  ${
                    formik.touched.terms_and_conditions &&
                    formik.errors.terms_and_conditions
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("terms_and_conditions")}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-7 sm-device">
                  {formik.touched.terms_and_conditions &&
                    formik.errors.terms_and_conditions && (
                      <div className="text-danger">
                        {formik.errors.terms_and_conditions}
                      </div>
                    )}
                </div>
              </div>
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
                <lable>Description</lable> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description")}
                  name="description"
                  id="description"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default InvoicesEdit;
