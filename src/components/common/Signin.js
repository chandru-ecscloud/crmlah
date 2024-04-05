import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HeroImage from "../../assets/heroImage.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  userName: yup.string().required("!Enter the User Name"),
  companyName: yup.string().required("!Enter the Company Name"),
  email: yup
    .string()
    .email("!Pls Enter valid email")
    .required("!Enter the Email"),
  password: yup
    .string()
    .required("!Enter the valid Password")
    .min(4, "!min length of 4 chars")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .max(10, "!Enter upto 15 chars only"),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("!Confirm Password is required"),
  country_code: yup.string().required("!Enter Country Code Number"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "phone must be at atleast 8 characters")
    .max(12, "phone must be at most 10 characters"),
  address: yup.string().required("!Enter Address"),
  city: yup.string().required("!Enter city"),
  state: yup.string().required("!Enter state"),
  zipCode: yup
    .string()
    .required("!Enter zipcode")
    .matches(/^\d+$/, "Must be only digits"),
  country: yup.string().required("!Enter contry"),
});

const CompanyRegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPasword] = useState(false);

  const {
    register,
    handleSubmit,
    // control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPasword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const handleApiSubmit = async (data) => {
    data.role = "CMP_USER";
    data.jwtRole = "CMP_USER";
    try {
      const response = await axios.post(`${API_URL}newUserRegister`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/emailsuccess");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    // console.log(data);
  };

  return (
    <form>
      {/*  UserName */}
      <div className="mb-3">
        <label htmlfor="userName" className="form-label">
          UserName:
        </label>
        <input
          {...register("userName")}
          type="text"
          className="form-control"
          id="userName"
        />
        <p className="text-danger">{errors.userName?.message}</p>
      </div>

      <div className="mb-3">
        <label htmlfor="userName" className="form-label">
          Company Name:
        </label>
        <input
          {...register("companyName")}
          type="text"
          className="form-control"
          id="companyName"
        />
        <p className="text-danger">{errors.companyName?.message}</p>
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlfor="email" className="form-label">
          Email address:
        </label>
        <input
          {...register("email")}
          type="email"
          className="form-control"
          id="email"
          style={{ outlineColor: "red !important" }}
        />
        <p className="text-danger">{errors.email?.message}</p>
      </div>

      {/* password */}
      <div className="form-group mb-3">
        <label htmlfor="password" className="form-label">
          Password
        </label>
        <div className="input-group">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="InputPassword1"
            style={{ margin: "0px" }}
          />
          <span
            className="input-group-append eye-icon"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <p className="text-danger">{errors.password?.message}</p>
      </div>

      {/* Cpassword */}
      <div className="form-group mb-3">
        <label htmlfor="cpassword" className="form-label">
          ConfirmPassword
        </label>
        <div className="input-group">
          <input
            {...register("cpassword")}
            type={showCPassword ? "text" : "password"}
            className="form-control"
            id="cpassword"
          />
          <span
            className="input-group-append eye-icon"
            onClick={toggleCPasswordVisibility}
          >
            {showCPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <p className="text-danger">{errors.cpassword?.message}</p>
      </div>

      {/* phone num */}
      {/* <div className="mb-3">
        <label htmlfor="Phone" className="form-label">
          Phone
        </label>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              country={"sg"}
              inputStyle={{ width: "100%" }}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {errors.phone && (
          <div style={{ color: "red" }}>{errors.phone.message}</div>
        )}
      </div> */}

      <div className="mb-3">
        <lable className="form-label">Phone</lable>
        <div className="input-group">
          <div>
            <select
              className="form-select"
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
          />
        </div>
        <p className="text-danger">{errors.phone?.message}</p>
      </div>

      {/* address */}
      <div className="mt-4">
        <label className="form-label">Address</label>
        <div className="mb-3">
          <input
            {...register("address")}
            type="text"
            className="form-control"
            id="address"
            placeholder="Enter address"
          />
          <p className="text-danger">{errors.address?.message}</p>
        </div>
        <div className="mb-3">
          <input
            {...register("city")}
            type="text"
            className="form-control"
            id="city"
            placeholder="City"
          />
          <p className="text-danger">{errors.city?.message}</p>
        </div>
        <div className="row">
          <div className="col-md-6 col-12">
            <input
              {...register("state")}
              type="text"
              className="form-control "
              id="state"
              placeholder="Enter state"
            />
            <p className="text-danger">{errors.state?.message}</p>
          </div>
          <div className="col-md-6 col-12">
            <input
              {...register("zipCode")}
              type="text"
              className="form-control "
              pattern="[0-9]*"
              id="zipCode"
              placeholder="zip"
              //  onChange={(e)=>{e.target.value.replace(/\D/g, '')}}
            />
            <p className="text-danger">{errors.zipCode?.message}</p>
          </div>
        </div>
        <div className="mb-3">
          <input
            {...register("country")}
            type="text"
            className="form-control"
            id="country"
            placeholder="Country"
          />
          <p className="text-danger">{errors.country?.message}</p>
        </div>
      </div>

      <button
        className="contactsubmitBtn btn btn-danger mx-auto"
        onClick={handleSubmit((data) => {
          handleApiSubmit(data);
        })}
        type="submit"
      >
        Register
      </button>
    </form>
  );
};

const CompanyRegistrationPage = () => {
  return (
    <div className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-start justify-content-center mt-5">
              <img src={HeroImage} alt="CRMLAH" className="img-fluid" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="row">
                <h3 className="registerWord text-center mt-3">REGISTER FORM</h3>
                <CompanyRegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
