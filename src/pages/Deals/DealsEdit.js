import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

function DealsEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem('role');
  const [userImage, setUserImage] = useState(User);

  const [accountOption, setAccountOption] = useState([]);
  // console.log("Account Name",accountOption);
  const [dealOption, setDealOption] = useState([]);
  // console.log("Deal Name",dealOption);
  const [contactOption, setContactOption] = useState([]);
  // console.log("Contact Name",contactOption);

  const [formData, setFormData] = useState({
    deal_name: "",
    accessories: "",
    account: "",
    account_name: "",
    lead_source: "",
    contact_name: "",
    amount: "",
    closing_date: "",
    stage: "",
    probability: "",
    campaign_source: "",
    description_info: "",
    deal_owner: "",
    created_at: "",
    updated_at: "",
  });

  console.log("lead_source",formData.lead_source);
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
    navigate(`/deals`);
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
        const response = await axios(`${API_URL}allDeals/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:",response);

        const keyMapping = {
          dealName: "deal_name",
          accessories: "accessories",
          account: "account",
          accountName: "account_name",
          leadSource: "lead_source",
          contactName: "contact_name",
          amount: "amount",
          closingDate: "closing_date",
          stage: "stage",
          probability: "probability",
          campaignSource: "campaign_source",
          descriptionInfo: "description_info",
          dealOwner: "deal_owner",

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
        };

        // console.log("Key Mapping Account Name:",keyMapping.accountName);

        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            const newKey = keyMapping[key] || key;
            acc[newKey] =
              key === "closingDate"
                ? response.data[key].split("T")[0]
                : response.data[key];
            return acc;
          },
          {}
        );

        setFormData(transformedData);
        console.log("Deal Data:",transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
    AccountList();
    DealList();
    ContactList();
  }, [id]);

  const updateDeal = async () => {
    try {
      const response = await axios.put(`${API_URL}updateDeal/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/deals");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="editLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Edit Deal</b>
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
                onClick={updateDeal}
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Deal Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label htmlFor="dealOwner">Deal Owner</label>&nbsp;&nbsp;
            <select
              id="deal_owner"
              className="form-size form-select"
              name="deal_owner"
              onChange={handleChange}
            >
              <option value={owner} selected={formData.deal_owner === owner}>
                {owner}
              </option>
              <option
                value="Vignesh Devan"
                selected={formData.deal_owner === "Vignesh Devan"}
              >
                Vignesh Devan
              </option>
              <option
                value="Chandru R"
                selected={formData.deal_owner === "Chandru R"}
              >
                Chandru R
              </option>
              <option
                value="Gayathri M"
                selected={formData.deal_owner === "Gayathri M"}
              >
                Gayathri M
              </option>
              <option
                value="Poongodi K"
                selected={formData.deal_owner === "Poongodi K"}
              >
                Poongodi K
              </option>
              <option
                value="Suriya G"
                selected={formData.deal_owner === "Suriya G"}
              >
                Suriya G
              </option>
              <option
                value="Leela Prasanna D"
                selected={formData.deal_owner === "Leela Prasanna D"}
              >
                Leela Prasanna D
              </option>
              <option
                value="Saravanan M"
                selected={formData.deal_owner === "Saravanan M"}
              >
                Saravanan M
              </option>
              <option
                value="Nagaraj VR"
                selected={formData.deal_owner === "Nagaraj VR"}
              >
                Nagaraj VR
              </option>
              <option
                value="Yalini A"
                selected={formData.deal_owner === "Yalini A"}
              >
                Yalini A
              </option>
              <option
                value="Vishnu Priya"
                selected={formData.deal_owner === "Vishnu Priya"}
              >
                Vishnu Priya
              </option>
              <option
                value="Kavitha"
                selected={formData.deal_owner === "Kavith"}
              >
                Kavitha
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Amount</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="amount"
              id="amount"
              value={formData.amount || ""}
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
            <lable>Closing Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="closing_date"
              id="closing_date"
              value={formData.closing_date || ""}
              onChange={handleChange}
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
            <lable>Pipeline</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="pipeline"
              id="pipeline"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Type</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="type"
              id="type"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Stage</lable> &nbsp;&nbsp;
             <select id="stage" className="form-size form-select" name="stage" onChange={handleChange}>
              <option value="" selected={formData.stage === ""}></option>
              <option value="Processing" selected={formData.stage === "Processing"}>Processing</option>
              <option value="Intermediate" selected={formData.stage === "Intermediate"}>Intermediate</option>
              <option value="Approved" selected={formData.stage === "Approved"}>Approved</option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Next Step</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="next_step"
              id="next_step"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Probability(%)</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="probability"
              id="probability"
              value={formData.probability || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Career Source</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="career_source"
              id="career_source"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Expected Revenue</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="expected_revenue"
              id="expected_revenue"
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Lead Name</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="lead_name"
              id="lead_name"
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Campaign Source</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="campaign_source"
              id="campaign_source"
              value={formData.campaign_source || ""}
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

              {/* <select
                style={{ width: '60%' }}
                className="form-select"
                onChange={handleChange}
                name="contact_name"
                id="contact_name"
                value={formData.contact_name} // Set the value attribute to reflect the current state
              >
                <option value=""></option>
                {Array.isArray(contactOption) &&
                  contactOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select> */}

          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Contact Email</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="contact_email"
              id="contact_email"
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Lead Source</lable> &nbsp;&nbsp;
            <select
              className="form-size form-select"
              name="lead_source"
              value={formData.lead_source || ""}
              onChange={handleChange}
            >
              <option value=""></option>
              <option
                value="Instagram"
                selected={formData.lead_source === "Instagram"}
              >
                Instagram
              </option>
              <option
                value="Whatsapp"
                selected={formData.lead_source === "Whatsapp"}
              >
                Whatsapp
              </option>
              <option
                value="Facebook"
                selected={formData.lead_source === "Facebook"}
              >
                Facebook
              </option>
              <option
                value="Twitter"
                selected={formData.lead_source === "Twitter"}
              >
                Twitter
              </option>
              <option
                value="Website"
                selected={formData.lead_source === "Website"}
              >
                Website
              </option>
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

export default DealsEdit;
