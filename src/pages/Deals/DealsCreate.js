import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

const schema = yup.object().shape({
  deal_name: yup.string().required("!Enter Deal Name"),
  account_name: yup.string().required("!Enter Account Name"),
  contact_name: yup.string().required("!Enter Contact Name"),
  deal_owner: yup.string().required("!Select Deal Owner"),
  email: yup.string().email().required("!Enter Email"),
});

function DealsCreate() {
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const [accountOption, setAccountOption] = useState([]);
  console.log(accountOption);
  const [dealOption, setDealOption] = useState([]);
  console.log(dealOption);
  const [contactOption, setContactOption] = useState([]);
  console.log(contactOption);
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handelCancel = () => {
    navigate("/deal");
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
    AccountList();
    DealList();
    ContactList();
  }, []);

  const handleApiSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}newDeal`, data, {
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
    console.log("Api Deals Data:", data);
  };

  return (
    <section className="createLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Create Deal</b>
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
                onClick={handleSubmit((data) => {
                  handleApiSubmit(data);
                })}
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
        <input type="hidden" {...register("company_id")} value={userId} name="company_id" />
          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Deal Owner</lable> &nbsp;&nbsp;
              <select
                {...register("deal_owner")}
                type="text"
                className="form-size form-select"
                id="deal_owner"
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

            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.deal_owner?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Amount</lable> &nbsp;&nbsp;
            <input
              {...register("amount")}
              type="text"
              className="form-size form-control"
              name="amount"
              id="amount"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-center justify-content-end mb-3">
                <lable>Email</lable> &nbsp;&nbsp;
                <input
                  {...register("email")}
                  type="email"
                  className="form-size form-control"
                  id="email"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-5">
                  <p className="text-danger">{errors.email?.message}</p>
                </div>
              </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Deal Name</lable> &nbsp;&nbsp;
              {/* <input
                {...register("deal_name")}
                type="text"
                className="form-size form-control"
                id="deal_name"
              /> */}
               <select style={{ width: '60%' }} {...register("deal_name")} className="form-select">
                <option value="" selected disabled></option>
                {Array.isArray(dealOption) &&
                  dealOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.deal_name?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Contact Name</lable> &nbsp;&nbsp;
              <select style={{ width: '60%' }} {...register("contact_name")} className="form-select">
                <option value="" selected disabled></option>
                {Array.isArray(contactOption) &&
                  contactOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.contact_name?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Account Name</lable> &nbsp;&nbsp;
              <select style={{ width: '60%' }} {...register("account_name")} className="form-select" aria-label="Product">
                <option value="" selected disabled></option>
                {Array.isArray(accountOption) &&
                  accountOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.account_name?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Closing Date</lable> &nbsp;&nbsp;
            <input
              {...register("closing_date")}
              type="date"
              className="form-size form-control"
              name="closing_date"
              id="closing_date"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Account</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="account"
              id="account"
              placeholder="--"
            />
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
            <select id="stage" className="form-size form-select" name="stage"  {...register("stage")}>
              <option value=""></option>
              <option value="processing">Processing</option>
              <option value="intermediate">Intermediate</option>
              <option value="approved">Approved</option>
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
              {...register("probability")}
              type="text"
              className="form-size form-control"
              name="probability"
              id="probability"
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
              {...register("campaign_source")}
              type="text"
              className="form-size form-control"
              name="campaign_source"
              id="campaign_source"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Lead Source</lable> &nbsp;&nbsp;
            <select
              {...register("lead_source")}
              id="lead_source"
              className="form-size form-select"
              name="lead_source"
            >
              <option value=""></option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">Whatsapp</option>
              <option value="facebook">Facebook</option>
              <option value="website">Website</option>
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
            {...register("shipping_street")}
              type="text"
              className="form-size form-control"
              name="shipping_street"
              id="shipping_street"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Street</lable> &nbsp;&nbsp;
            <input
             {...register("billing_street")}
              type="text"
              className="form-size form-control"
              name="billing_street"
              id="billing_street"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping City</lable> &nbsp;&nbsp;
            <input
            {...register("shipping_city")}
              type="text"
              className="form-size form-control"
              name="shipping_city"
              id="shipping_city"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing City</lable> &nbsp;&nbsp;
            <input
             {...register("billing_city")}
              type="text"
              className="form-size form-control"
              name="billing_city"
              id="billing_city"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping State</lable> &nbsp;&nbsp;
            <input
            {...register("shipping_state")}
              type="text"
              className="form-size form-control"
              name="shipping_state"
              id="shipping_state"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing State</lable> &nbsp;&nbsp;
            <input
            {...register("billing_state")}
              type="text"
              className="form-size form-control"
              name="billing_state"
              id="billing_state"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Code</lable> &nbsp;&nbsp;
            <input
             {...register("shipping_code")}
              type="text"
              className="form-size form-control"
              name="shipping_code"
              id="shipping_code"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Code</lable> &nbsp;&nbsp;
            <input
             {...register("billing_code")}
              type="text"
              className="form-size form-control"
              name="billing_code"
              id="billing_code"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Country</lable> &nbsp;&nbsp;
            <input
             {...register("shipping_country")}
              type="text"
              className="form-size form-control"
              name="shipping_country"
              id="shipping_country"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Country</lable> &nbsp;&nbsp;
            <input
            {...register("billing_country")}
              type="text"
              className="form-size form-control"
              name="billing_country"
              id="billing_country"
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
              {...register("description_info")}
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="description_info"
              id="description_info"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DealsCreate;
