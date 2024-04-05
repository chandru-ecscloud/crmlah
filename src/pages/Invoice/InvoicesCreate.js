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
  deal_name: yup.string().required("!Select Deal Name"),
  account_name: yup.string().required("!Select Account Name"),
  contact_name: yup.string().required("!Select Contact Name"),
  subject: yup.string().required("!Enter Subject"),
  status: yup.string().required("!Select Status"),
  invoice_owner: yup.string().required("!Select Invoice Owner"),
  email: yup.string().email().required("!Enter Email"),
});

function InvoicesCreate() {
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  
  const [accountOption, setAccountOption] = useState([]);
  console.log(accountOption);
  const [dealOption, setDealOption] = useState([]);
  console.log(dealOption);
  const [contactOption, setContactOption] = useState([]);
  console.log(contactOption);

  const [nextId, setNextId] = useState(2);


  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handelCancel = () => {
    navigate("/invoices");
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
      const response = await axios.post(`${API_URL}newInvoice`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
              <b>Create Invoice</b>
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
                // onClick={handleSubmit}
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
          <b>Invoice Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
        <input type="hidden" {...register("company_id")} value={userId} name="company_id" />
          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Invoice Owner</lable> &nbsp;&nbsp;
              <select
                {...register("invoice_owner")}
                type="text"
                className="form-size form-select"
                id="invoice_owner"
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
                <p className="text-danger">{errors.invoice_owner?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales Order</lable> &nbsp;&nbsp;
            <input
              {...register("sales_order")}
              type="text"
              className="form-size form-control"
              name="sales_order"
              id="sales_order"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Subject</lable> &nbsp;&nbsp;
              <input
                {...register("subject")}
                type="text"
                className="form-size form-control"
                id="subject"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.subject?.message}</p>
              </div>
            </div>
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

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Purchase Order</lable> &nbsp;&nbsp;
            <input
              {...register("purchase_order")}
              type="text"
              className="form-size form-control"
              name="purchase_order"
              id="purchase_order"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable> Invoice Date</lable> &nbsp;&nbsp;
            <input
              {...register("invoice_date")}
              type="date"
              className="form-size form-control"
              name="invoice_date"
              id="invoice_date"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Status</lable> &nbsp;&nbsp;
              <select
                {...register("status")}
                type="text"
                className="form-size form-control"
                id="status"
              >
                <option value=""></option>
                <option value="Analysed">Analysed</option>
                <option value="Processed">Processed</option>
                <option value="Delivered">Delivered</option>
                <option value="Intermediated">Intermediated</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.status?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Due Date</lable> &nbsp;&nbsp;
            <input
              {...register("due_date")}
              type="date"
              className="form-size form-control"
              name="due_date"
              id="due_date"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales Commission</lable> &nbsp;&nbsp;
            <input
              {...register("sales_commission")}
              type="text"
              className="form-size form-control"
              name="sales_commission"
              id="sales_commission"
            />
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default InvoicesCreate;
