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

function QuotesEdit() {
  // const [subTotal, setSubTotal] = useState("");
  // const [discount, setDiscount] = useState("");
  // const [tax, setTax] = useState("");
  // const [adjustment, setAdjustment] = useState("");
  // const [grandTotal, setGrandTotal] = useState("");
  const owner = sessionStorage.getItem('user_name');
  const token = sessionStorage.getItem("token"); 
  const role = sessionStorage.getItem('role');
  const [accountOption, setAccountOption] = useState([]);
  // console.log("Account Name",accountOption);
  const [dealOption, setDealOption] = useState([]);
  // console.log("Deal Name",dealOption);
  const [contactOption, setContactOption] = useState([]);
  // console.log("Contact Name",contactOption);

  const [userImage, setUserImage] = useState(User);

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

//  const handleInputChange = (id, fieldName, value) => {
//     const updatedRows = rows.map((row) => {
//       if (row.id === id) {
//         return { ...row, [fieldName]: value };
//       }
//       return row;
//     });
//     setRows(updatedRows);
//   }; 

  const { id } = useParams();
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    price: "",
    discount: "",
    total_amount: "",
    item_description: "",
    description: "",
    terms_and_conditions: "",
    tax: "",
    adjustment: "",
    grand_total: "",
    quote_owner: "",
    subject: "",
    quote_stage: "",
    deal_name: "",
    valid_until: "",
    contact_name: "",
    account_name: "",
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
    navigate("/quotes");
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
        const response = await axios(`${API_URL}allQuotes/${id}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },  
        });

        const keyMapping = {
          product: "product",
          quantity: "quantity",
          price: "price",
          discount: "discount",
          totalAmount: "total_amount",
          itemDescription: "item_description",
          description: "description",
          termsAndConditions: "terms_and_conditions",
          tax: "tax",
          adjustment: "adjustment",
          grandTotal: "grand_total",
          quoteOwner: "quote_owner",
          subject: "subject",
          quoteStage: "quote_stage",
          dealName: "deal_name",
          validUntil: "valid_until",
          contactName: "contact_name",
          accountName: "account_name",
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
              key === "validUntil"
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

  const updateQuotes = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateQuote/${id}`,
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
        navigate("/quotes");
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
              <b>Edit Quotes</b>
              <br></br>
              <img
                  src={userImage}
                  className="img-fluid mt-3"
                  style={{ width: "70px", height: "70px", cursor: "pointer", borderRadius: '50%' }}
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
                <FaCamera className="cameraIcon"/>
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
                onClick={updateQuotes}
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Quotes Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label htmlFor="quotesowner">Quotes Owner</label>&nbsp;&nbsp;
            <select
              id="quote_owner"
              className="form-size form-select"
              name="quote_owner"
              onChange={handleChange}
            >
              <option value={owner} selected={formData.lead_owner === owner}>
                {owner}
              </option>
              <option
                value="Suriya"
                selected={formData.quote_owner === "Suriya"}
              >
                Suriya
              </option>
              <option
                value="Vignesh Devan"
                selected={formData.quote_owner === "Vignesh Devan"}
              >
                Vignesh Devan
              </option>
              <option
                value="Chandru R"
                selected={formData.quote_owner === "Chandru R"}
              >
                Chandru R
              </option>
              <option
                value="Gayathri M"
                selected={formData.quote_owner === "Gayathri M"}
              >
                Gayathri M
              </option>
              <option
                value="Poongodi K"
                selected={formData.quote_owner === "Poongodi K"}
              >
                Poongodi K
              </option>
              <option
                value="Suriya G"
                selected={formData.quote_owner === "Suriya G"}
              >
                Suriya G
              </option>
              <option
                value="Leela Prasanna D"
                selected={formData.quote_owner === "Leela Prasanna D"}
              >
                Leela Prasanna D
              </option>
              <option
                value="Saravanan M"
                selected={formData.quote_owner === "Saravanan M"}
              >
                Saravanan M
              </option>
              <option
                value="Nagaraj VR"
                selected={formData.quote_owner === "Nagaraj VR"}
              >
                Nagaraj VR
              </option>
              <option
                value="Yalini A"
                selected={formData.quote_owner === "Yalini A"}
              >
                Yalini A
              </option>
              <option
                value="Vishnu Priya"
                selected={formData.quote_owner === "Vishnu Priya"}
              >
                Vishnu Priya
              </option>
              <option
                value="Kavitha"
                selected={formData.quote_owner === "Kavitha"}
              >
                Kavitha
              </option>
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
            <lable>Valid Until</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="valid_until"
              id="valid_until"
              value={formData.valid_until || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quotes Stage</lable> &nbsp;&nbsp;
            <select
              id="quote_stage"
              className="form-size form-select"
              name="quote_stage"
              onChange={handleChange}
            >
              <option value=""></option>
              <option
                value="Analysed"
                selected={formData.quote_stage === "Analysed"}
              >
                Analysed
              </option>
              <option
                value="Proccess"
                selected={formData.quote_stage === "Proccess"}
              >
                Proccess
              </option>
              <option
                value="Intermediate"
                selected={formData.quote_stage === "Intermediate"}
              >
                Intermediate
              </option>
              <option
                value="Terminated"
                selected={formData.quote_stage === "Terminated"}
              >
                Terminated
              </option>
              <option
                value="Analysed"
                selected={formData.quote_stage === "Analysed"}
              >
                Analysed
              </option>
            </select>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Team</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="team"
              id="team"
              placeholder="--"
            />
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
              name="shipping_city"
              id="shipping_city"
              value={formData.billing_street || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping City</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_city"
              id="shipping_city"
              value={formData.shipping_city || ""}
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
          <b>Quotes Items</b>
        </h4>
      </div>
      <div className="container-fluid">
        <div className="container p-0" style={{ overflowX: "scroll" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ position: "sticky", left: "0" }}>S.No</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>List Price(Rs.)</th>
                <th>Amount(Rs.)</th>
                <th>Discount(Rs.)</th>
                <th>Tax(Rs.)</th>
                <th>Total(Rs.)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td
                    className="text-center fw-bold"
                    style={{ position: "sticky", left: "0" }}
                  >
                    <span>{row.id}</span>
                  </td>
                  <td>
                    <select 
                    className="form-select p-1 w-150"
                    value={formData.product || ""}
                    onChange={handleChange}>
                      <option value=""></option>
                      <option value="Access laptop">Access laptop</option>
                      <option value="Lenovo laptop">Lenovo laptop</option>
                      <option value="Hp laptop">Hp laptop</option>
                      <option value="Dell laptop">Dell laptop</option>
                      <option value="Laptop">Laptop</option>
                      <option value="mobiles">mobiles</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control p-1"
                      value={formData.quantity || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control p-1"
                      value={formData.price || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control p-1"
                      value={formData.amount || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control p-1"
                      value={formData.discount || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control p-1"
                      value={formData.tax || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control p-1"
                      value={formData.total_amount || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <Button
                      className="px-2 py-0 mx-1 my-0"
                      variant="danger"
                      style={{ borderRadius: "50%" }}
                      onClick={() => removeRow(row.id)}
                    >
                      x
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="container my-4">
          <Button variant="primary" onClick={addRow}>
            <FaPlus /> Add Row
          </Button>
        </div>

        <div className="container-fluid row mt-5 mx-2">
          <div className="container-fluid p-3 col-md-4 border rounded">
            <div className="container-fluid py-2">
              <label className="text-dark text-end">Sub Total(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                value={formData.total_amount || ""}
                onChange={handleChange}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Discount(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                value={formData.discount || ""}
                onChange={handleChange}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Tax(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                value={formData.tax || ""}
                onChange={handleChange}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Adjustment(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                value={formData.adjustment || ""}
                onChange={handleChange}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Grand Total(Rs.)</label>
              <input
                className="form-control p-1"
                type="number"
                value={formData.grand_total || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="container-fluid p-3 col-md-8"></div>
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
              value={formData.terms_and_conditions || ""}
              onChange={handleChange}
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

export default QuotesEdit;
