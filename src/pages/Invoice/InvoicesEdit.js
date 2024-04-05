import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";

import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

function InvoicesEdit() {
  const [userImage, setUserImage] = useState(User);
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const [accountOption, setAccountOption] = useState([]);
  // console.log("Account Name",accountOption);
  const [dealOption, setDealOption] = useState([]);
  // console.log("Deal Name",dealOption);
  const [contactOption, setContactOption] = useState([]);
  // console.log("Contact Name",contactOption);

  const [subTotal, setSubTotal] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [grandTotal, setGrandTotal] = useState("");

  const [rows, setRows] = useState([
    {
      id: 1,
      productName: "",
      quantity: "",
      listPrice: "",
      amount: "",
      discount: "",
      tax: "",
      total: "",
    },
  ]);
  const [nextId, setNextId] = useState(2);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: nextId,
        productName: "",
        quantity: "",
        listPrice: "",
        amount: "",
        discount: "",
        tax: "",
        total: "",
      },
    ]);
    setNextId(nextId + 1);
  };

  const removeRow = (idToRemove) => {
    const updatedRows = rows.filter((row) => row.id !== idToRemove);
    setRows(updatedRows);
  };

  // const handleInputChange = (id, fieldName, value) => {
  //   const updatedRows = rows.map((row) => {
  //     if (row.id === id) {
  //       return { ...row, [fieldName]: value };
  //     }
  //     return row;
  //   });
  //   setRows(updatedRows);
  // };

  const { id } = useParams();
  const [formData, setFormData] = useState({
    subject: "",
    invoice_date: "",
    sales_order: "",
    purchase_order: "",
    due_date: "",
    status: "",
    email:"",
    sales_commission: "",
    account_name: "",
    contact_name: "",
    deal_name: "",
    invoice_owner: "",

    billing_street: "",
    billing_city: "",
    billing_state: "",
    billing_code: "",
    billing_country: "",

    shipping_street: "",
    shipping_city: "",
    shipping_state: "",
    shipping_code: "",
    shipping_country: "",

    product_name: "",
    quantity: "",
    list_price: "",
    amount: "",
    discount: "",
    tax: "",
    total: "",
    adjustment: "",
    grand_total: "",
    item_description: "",
    terms_and_conditions: "",
    description: "",
    created_at: "",
    created_by: "",
    updated_at: "",
    updated_by: "",
    company_id: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handelCancel = () => {
    navigate("/invoices");
  };

  
  const AccountList = async () => {
    try {
      const response = await axios(`${API_URL}accountNamesList`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
        const response = await axios.get(
          `${API_URL}allInvoices/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const keyMapping = {
          subject: "subject",
          invoiceDate: "invoice_date",
          salesOrder: "sales_order",
          purchaseOrder: "purchase_order",
          dueDate: "due_date",
          email:"email",
          status: "status",
          salesCommission: "sales_commission",
          accountName: "account_name",
          contactName: "contact_name",
          dealName: "deal_name",
          invoiceOwner: "invoice_owner",

          billingStreet: "billing_street",
          billingCity: "billing_city",
          billingState: "billing_state",
          billingCode: "billing_code",
          billingCountry: "billing_country",

          shippingStreet: "shipping_street",
          shippingCity: "shipping_city",
          shippingState: "shipping_state",
          shippingCode: "shipping_code",
          shippingCountry: "shipping_country",

          productName: "product_name",
          quantity: "quantity",
          listPrice: "list_price",
          amount: "amount",
          discount: "discount",
          tax: "tax",
          total: "total",
          adjustment: "adjustment",
          grandTotal: "grand_total",
          itemDescription: "item_description",
          termsAndConditions: "terms_and_conditions",
          description: "description",
          createdAt: "created_at",
          createdBy: "created_by",
          updatedAt: "updated_at",
          updatedBy: "updated_by",
          companyId: "company_id",
        };

        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            const newKey = keyMapping[key] || key;
            acc[newKey] =
              key === "invoiceDate" || key === "dueDate"
                ? response.data[key].split("T")[0]
                : response.data[key];
            return acc;
          },
          {}
        );

        setFormData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
    AccountList();
    DealList();
    ContactList();
  }, [id]);

  const updateInvoice = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateInvoice/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/invoices");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="createLead">
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
            <span>
              <button className="btn btn-danger" onClick={handelCancel}>
                Cancel
              </button>
            </span>
            &nbsp;
            <span>
              <button
                className="btn btn-primary"
                type="button"
                onClick={updateInvoice}
              >
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
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label>Invoice Owner</label>&nbsp;&nbsp;
            <select
              id="invoice_owner"
              className="form-size form-select"
              name="invoice_owner"
              onChange={handleChange}
            >
              <option value={owner} selected={formData.lead_owner === owner}>
                {owner}
              </option>{" "}
              <option
                value="Suriya"
                selected={formData.invoice_owner === "Suriya"}
              >
                Suriya
              </option>
              <option
                value="Vignesh Devan"
                selected={formData.invoice_owner === "Vignesh Devan"}
              >
                Vignesh Devan
              </option>
              <option
                value="Chandru R"
                selected={formData.invoice_owner === "Chandru R"}
              >
                Chandru R
              </option>
              <option
                value="Gayathri M"
                selected={formData.invoice_owner === "Gayathri M"}
              >
                Gayathri M
              </option>
              <option
                value="Poongodi K"
                selected={formData.invoice_owner === "Poongodi K"}
              >
                Poongodi K
              </option>
              <option
                value="Suriya G"
                selected={formData.invoice_owner === "Suriya G"}
              >
                Suriya G
              </option>
              <option
                value="Leela Prasanna D"
                selected={formData.invoice_owner === "Leela Prasanna D"}
              >
                Leela Prasanna D
              </option>
              <option
                value="Saravanan M"
                selected={formData.invoice_owner === "Saravanan M"}
              >
                Saravanan M
              </option>
              <option
                value="Nagaraj VR"
                selected={formData.invoice_owner === "Nagaraj VR"}
              >
                Nagaraj VR
              </option>
              <option
                value="Yalini A"
                selected={formData.invoice_owner === "Yalini A"}
              >
                Yalini A
              </option>
              <option
                value="Vishnu Priya"
                selected={formData.invoice_owner === "Vishnu Priya"}
              >
                Vishnu Priya
              </option>
              <option
                value="Kavitha"
                selected={formData.invoice_owner === "Kavitha"}
              >
                Kavitha
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales Order</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="sales_order"
              id="sales_order"
              value={formData.sales_order || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Subject</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="subject"
              id="subject"
              value={formData.subject || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Email</lable> &nbsp;&nbsp;
            <input
              type="email"
              className="form-size form-control"
              name="email"
              id="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Purchase Order</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="purchase_order"
              id="purchase_order"
              value={formData.purchase_order || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable> Invoice Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="invoice_date"
              id="invoice_date"
              value={formData.invoice_date || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label>Status</label>&nbsp;&nbsp;
            <select
              id="status"
              className="form-size form-select"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option value=""></option>
              <option
                value="Analysed"
                selected={formData.status === "Analysed"}
              >
                Analysed
              </option>
              <option
                value="Processed"
                selected={formData.status === "Processed"}
              >
                Processed
              </option>
              <option
                value="Delivered"
                selected={formData.status === "Delivered"}
              >
                Delivered
              </option>
              <option
                value="Intermediated"
                selected={formData.status === "Intermediated"}
              >
                Intermediated
              </option>
              <option
                value="Terminated"
                selected={formData.status === "Terminated"}
              >
                Terminated
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Due Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="due_date"
              id="due_date"
              value={formData.due_date || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales Commission</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="sales_commission"
              id="sales_commission"
              value={formData.sales_commission || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Contact Name</lable> &nbsp;&nbsp;
            {/* <input
              type="text"
              className="form-size form-control"
              name="contact_name"
              id="contact_name"
              value={formData.contact_name || ""}
              onChange={handleChange}
            /> */}

            <select style={{ width: '60%' }} className="form-select"
              onChange={handleChange} name="contact_name" id="contact_name">
                <option value="" selected disabled></option>
                {Array.isArray(contactOption) &&
                  contactOption.map((option) => (
                    <option key={option} value={option}  selected={formData.contact_name === option}>
                      {option}
                    </option>
                  ))}
              </select>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Account Name</lable> &nbsp;&nbsp;
            <select style={{ width: '60%' }} className="form-select" onChange={handleChange} name="account_name" id="account_name">
                <option value=""></option>
                {Array.isArray(accountOption) &&
                  accountOption.map((option) => (
                    <option key={option} value={option}  selected={formData.account_name === option}>
                      {option}
                    </option>
                  ))}
              </select>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Deal Name</lable> &nbsp;&nbsp;
            {/* <input
              type="text"
              className="form-size form-control"
              name="deal_name"
              id="deal_name"
              value={formData.deal_name || ""}
              onChange={handleChange}
            /> */}
             <select style={{ width: '60%' }} className="form-select" onChange={handleChange} name="deal_name" id="deal_name">
                <option value=""></option>
                {Array.isArray(dealOption) &&
                  dealOption.map((option) => (
                    <option key={option} value={option}  selected={formData.deal_name === option}>
                      {option}
                    </option>
                  ))}
              </select>
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
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Street</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_street"
              id="shipping_street"
              value={formData.shipping_street || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Street</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_street"
              id="billing_street"
              value={formData.billing_street || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Country</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_country"
              id="shipping_country"
              value={formData.shipping_country || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing City</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_city"
              id="billing_city"
              value={formData.billing_city || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Code</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_code"
              id="shipping_code"
              value={formData.shipping_code || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Code</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_code"
              id="billing_code"
              value={formData.billing_code || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Country</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_country"
              id="shipping_country"
              value={formData.shipping_country || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Country</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_country"
              id="billing_country"
              value={formData.billing_country || ""}
              onChange={handleChange}
            />
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
          <div className="col-8 d-flex align-items-center justify-content-end mb-3">
            <lable>Terms & Conditions</lable> &nbsp;&nbsp;
            <input
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="terms_and_conditions"
              id="terms_and_conditions"
              onChange={handleChange}
              value={formData.terms_and_conditions || ""}
            />
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
          <div className="col-8 d-flex align-items-center justify-content-end mb-3">
            <lable>Description</lable> &nbsp;&nbsp;
            <input
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="description"
              id="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default InvoicesEdit;
