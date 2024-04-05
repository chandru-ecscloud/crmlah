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
  account_name: yup.string().required("!Enter Account Name"),
  parent_account: yup.string().required("!Enter Parent Account"),
  email: yup.string().email().required("!Enter Email"),
  phone: yup
    .string()
    .required("!Enter Phone Number")
    .matches(/^\d+$/, "Must be only digits")
    .min(8)
    .max(10),
  country_code: yup.string().required("!Enter Country Code Number"), 
  account_owner: yup.string().required("!Select Account Owner"),
});

function AccountsCreate() {
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const role = sessionStorage.getItem('role');
  const userId = sessionStorage.getItem("userId");
  const [accountOption, setAccountOption] = useState([]);
  console.log(accountOption);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handelCancel = () => {
    navigate("/accounts");
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

  const handleApiSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}newAccount`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/accounts");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    };

    console.log("Api Account Data:",data);
  };

  useEffect(() => {
    AccountList();
  }, []);

  return (
    <section className="createLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Create Account</b>
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
          <b>Account Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
        <input type="hidden" {...register("company_id")} value={userId} name="company_id" />
        
          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Account Owner</lable> &nbsp;&nbsp;
              <select
                {...register("account_owner")}
                type="text"
                className="form-size form-control"
                id="account_owner"
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
                <p className="text-danger">{errors.account_owner?.message}</p>
              </div>
            </div>
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
              <lable>Phone</lable> &nbsp;&nbsp;
              <div className="input-group" style={{ width: "60%" }}>
                <div>
                  <select
                    className="form-size form-select"
                    {...register("country_code")}
                    style={{
                      width: "80px",
                      borderTopRightRadius: "0px",
                      borderBottomRightRadius: "0px",
                    }}
                  >
                    <option value="+65">+65</option>
                    <option value="+91">+91</option>
                  </select>
                </div>

                <input
                  {...register("phone")}
                  type="tel"
                  name="phone"
                  id="phone"
                  className="form-control"
                  aria-label="Text input with checkbox"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-5"></div>
              <div className="col-5">
                <p className="text-danger">{errors.phone?.message}</p>
              </div>
            </div>
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

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Email</lable> &nbsp;&nbsp;
              <input
                {...register("email")}
                type="text"
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
              <lable>Parent Account</lable> &nbsp;&nbsp;
              <input
                {...register("parent_account")}
                type="text"
                className="form-size form-control"
                id="parent_account"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.parent_account?.message}</p>
              </div>
            </div>
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
            {...register("account_number")}
              type="text"
              className="form-size form-control"
              name="account_number"
              id="account_number"
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
            {...register("account_type")}
              type="text"
              className="form-size form-control"
              name="account_type"
              id="account_type"
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
            <label htmlFor="accountOwner">Industry</label>&nbsp;&nbsp;
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

export default AccountsCreate;
