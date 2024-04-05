import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css"; 

function AccountsEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem('user_name');
  const role = sessionStorage.getItem('role');
  const token = sessionStorage.getItem("token"); 
  const [accountOption, setAccountOption] = useState([]);
  const [userImage, setUserImage] = useState(User); 

  const [formData, setFormData] = useState({
    account_name: "",
    account_owner: "",
    parent_account: "",
    account_number: "",
    account_type: "",
    country_code:"",
    phone: "",
    email: "",
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
    description_info: "",
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

  const handelCancel = () => {
    navigate(`/accounts`);
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${API_URL}allAccounts/${id}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const keyMapping = {
          accountOwner: "account_owner",
          accountName: "account_name",
          accountNumber: "account_number",
          accountType: "account_type",
          parentAccount: "parent_account",
          email:"email",
          phone:"phone",
          countryCode:"country_code",
          
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

          descriptionInfo: "description_info",
        };

        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            const newKey = keyMapping[key] || key;
            acc[newKey] = response.data[key];
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
  }, [id]);

  const updateAccount = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateAccount/${id}`,
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
        navigate("/accounts");
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
              <b>Edit Account</b>
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
                onClick={updateAccount}
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Account Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label htmlFor="account_owner">Account Owner</label>&nbsp;&nbsp;
            <select
              id="account_owner"
              className="form-size form-select"
              name="account_owner"
              onChange={handleChange}
            >
              <option value={owner} selected={formData.lead_owner === owner}>
                {owner}
              </option>
              <option
                value="Vignesh Devan"
                selected={formData.account_owner === "Vignesh Devan"}
              >
                Vignesh Devan
              </option>
              <option
                value="Chandru R"
                selected={formData.account_owner === "Chandru R"}
              >
                Chandru R
              </option>
              <option
                value="Gayathri M"
                selected={formData.account_owner === "Gayathri M"}
              >
                Gayathri M
              </option>
              <option
                value="Poongodi K"
                selected={formData.account_owner === "Poongodi K"}
              >
                Poongodi K
              </option>
              <option
                value="Suriya G"
                selected={formData.account_owner === "Suriya G"}
              >
                Suriya G
              </option>
              <option
                value="Leela Prasanna D"
                selected={formData.account_owner === "Leela Prasanna D"}
              >
                Leela Prasanna D
              </option>
              <option
                value="Saravanan M"
                selected={formData.account_owner === "Saravanan M"}
              >
                Saravanan M
              </option>
              <option
                value="Nagaraj VR"
                selected={formData.account_owner === "Nagaraj VR"}
              >
                Nagaraj VR
              </option>
              <option
                value="Yalini A"
                selected={formData.account_owner === "Yalini A"}
              >
                Yalini A
              </option>
              <option
                value="Vishnu Priya"
                selected={formData.account_owner === "Vishnu Priya"}
              >
                Vishnu Priya
              </option>
              <option
                value="Kavitha"
                selected={formData.account_owner === "Kavitha"}
              >
                Kavitha
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label htmlFor="rating">Rating</label>&nbsp;&nbsp;
            <select id="rating" className="form-size form-select" name="rating">
              <option value="--">--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
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
            <lable>Phone</lable> &nbsp;&nbsp;
            <div className="input-group" style={{ width: "60%" }}>
              <div>
                <select
                  className="form-size form-select"
                  name="country_code"
                  value={formData.country_code || ""}
                  onChange={handleChange}
                  style={{
                    width: "80px",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                >
                  <option value="+65" selected={formData.country_code === "+65"}>+65</option>
                  <option value="+91" selected={formData.country_code === "+91"}>+91</option>
                </select>
              </div>

              <input
                type="tel"
                name="phone"
                id="phone"
                className="form-control"
                aria-label="Text input with checkbox"
                onChange={handleChange}
                value={formData.phone || ""}
              />
            </div>
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
            <lable>Account Site</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="account_site"
              id="account_site"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Parent Account</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="parent_account"
              value={formData.parent_account || ""}
              id="parent_account"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Fax</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="fax"
              id="fax"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Website</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="Website"
              id="Website"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Account Number</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="account_number"
              value={formData.account_number || ""}
              id="account_number"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Ticker Symbol</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="ticker_symbol"
              id="ticker_symbol"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Account Type</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="account_type"
              id="account_type"
              value={formData.account_type || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Ownership</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="owner_ship"
              id="owner_ship"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label>Industry</label>&nbsp;&nbsp;
            <select
              id="industry"
              className="form-size form-select"
              name="industry"
            >
              <option value="--">--</option>
              <option value="option1">Option 1</option>
              <option value="option1">Option 2</option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Employees</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="employees"
              id="employees"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>SIC Code</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="sic_code"
              id="sic_code"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Annual Revenue</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="annual_revenue"
              id="annual_revenue"
              placeholder="--"
            />
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
            <lable>Shipping City</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_city"
              value={formData.shipping_city || ""}
              id="shipping_city"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing City</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_city"
              value={formData.billing_city || ""}
              id="billing_city"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping State</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_state"
              value={formData.shipping_state || ""}
              id="shipping_state"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing State</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_state"
              value={formData.billing_state || ""}
              id="billing_state"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Code</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_code"
              value={formData.shipping_code || ""}
              id="shipping_code"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Code</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_code"
              value={formData.billing_code || ""}
              id="billing_code"
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Country</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="shipping_country"
              value={formData.shipping_country || ""}
              id="shipping_country"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Country</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="billing_country"
              value={formData.billing_country || ""}
              id="billing_country"
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
              name="description_info"
              id="description_info"
              value={formData.description_info || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountsEdit;
