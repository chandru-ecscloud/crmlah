import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HeroImage from "../../assets/heroImage.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";


const validationSchema = yup.object().shape({
  userName: yup.string().required("*Enter the User Name"),
  companyName: yup.string().required("*Enter the Company Name"),
  email: yup
    .string()
    .email("*Pls Enter valid email")
    .required("*Enter the Email"),
  password: yup
    .string()
    .required("*Enter the valid Password")
    .min(4, "*min length of 4 chars")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .max(10, "*Enter upto 15 chars only"),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("*Confirm Password is required"),
  country_code: yup.string().required("*Enter Country Code Number"),
  phone: yup
    .string()
    .required("*Phone number is required")
    .min(10, "*phone must be at atleast 8 characters")
    .max(12, "*phone must be at most 10 characters"),
  address: yup.string().required("*Enter Address"),
  city: yup.string().required("*Enter city"),
  state: yup.string().required("*Enter state"),
  zipCode: yup
    .string()
    .required("*Enter zipcode")
    .matches(/^\d+$/, "Must be only digits"),
  country: yup.string().required("*Enter contry"),
});



const CompanyRegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPasword] = useState(false);

  const formik = useFormik({
    initialValues: {
      userName: "",
      companyName: "",
      email: "",
      password: "",
      cpassword: "",
      country_code: "",
      phone: "",
      address: "",
      city: "",
      minutes: "",
      time: "",
      hour: "",
      none: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",

    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("User Datas:", data);
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
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPasword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };



  return (
    <form onSubmit={formik.handleSubmit}>

      {/*  UserName */}
      <div className="mb-3">
        <label htmlfor="userName" className="form-label">
          UserName:
        </label>
        <input
          type="text"
          name="userName"
          id="userName"
          {...formik.getFieldProps("userName")}
          className={`form-control ${formik.touched.userName && formik.errors.userName
            ? "is-invalid"
            : ""
            }`}
        />
        {formik.touched.userName && formik.errors.userName && (
          <p className="text-danger text-start">
            {formik.errors.userName}
          </p>
        )}

      </div>

      <div className="mb-3">
        <label htmlfor="companyName" className="form-label">
          Company Name:
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          {...formik.getFieldProps("companyName")}
          className={`form-control ${formik.touched.companyName && formik.errors.companyName
            ? "is-invalid"
            : ""
            }`}
        />
        {formik.touched.companyName && formik.errors.companyName && (
          <p className="text-danger text-start">
            {formik.errors.companyName}
          </p>
        )}

      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlfor="email" className="form-label">
          Email address:
        </label>
        <input
          type="text"
          name="email"
          id="email"
          {...formik.getFieldProps("email")}
          className={`form-control ${formik.touched.email && formik.errors.email
            ? "is-invalid"
            : ""
            }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-danger text-start">
            {formik.errors.email}
          </p>
        )}
      </div>

      {/* password */}
      <div className="form-group mb-3">
        <label htmlfor="password" className="form-label">
          Password
        </label>
        <div className="input-group">
        <input
          type="text"
          name="password"
          id="password"
          {...formik.getFieldProps("password")}
          className={`form-control ${formik.touched.password && formik.errors.password
            ? "is-invalid"
            : ""
            }`}
        />
        
          <span
            className="input-group-append eye-icon"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-danger text-start">
            {formik.errors.password}
          </p>
        )}
      </div>

      {/* Cpassword */}
      <div className="form-group mb-3">
        <label htmlfor="cpassword" className="form-label">
          ConfirmPassword
        </label>
        <div className="input-group">
        <input
          type="text"
          name="cpassword"
          id="cpassword"
          {...formik.getFieldProps("cpassword")}
          className={`form-control ${formik.touched.cpassword && formik.errors.cpassword
            ? "is-invalid"
            : ""
            }`}
        />
        
          <span
            className="input-group-append eye-icon"
            onClick={toggleCPasswordVisibility}
          >
            {showCPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.cpassword && formik.errors.cpassword && (
          <p className="text-danger text-start">
            {formik.errors.cpassword}
          </p>
        )}
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
              {...formik.getFieldProps("country_code")}
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
          type="tel"
          name="phone"
          id="phone"
          {...formik.getFieldProps("phone")}
          className={`form-control ${formik.touched.phone && formik.errors.phone
            ? "is-invalid"
            : ""
            }`}
        />
         
        </div>
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-danger text-start">
            {formik.errors.phone}
          </p>
        )}
      </div>

      {/* address */}
      <div className="mt-4">
        <label className="form-label">Address</label>
        <div className="mb-3">
          <input
            
            type="type"
            name="address"
            id="address"
            {...formik.getFieldProps("address")}
            className={`form-control ${formik.touched.address && formik.errors.address
              ? "is-invalid"
              : ""
              }`}
          
            placeholder="Enter address"
          />
           {formik.touched.address && formik.errors.address && (
          <p className="text-danger text-start">
            {formik.errors.address}
          </p>
        )}
        </div>
        <div className="mb-3">
          <input
             type="type"
             name="city"
             id="city"
             {...formik.getFieldProps("city")}
             className={`form-control ${formik.touched.city && formik.errors.city
               ? "is-invalid"
               : ""
               }`}
            placeholder="City"
          />
          {formik.touched.city && formik.errors.city && (
          <p className="text-danger text-start">
            {formik.errors.city}
          </p>
        )}
        </div>
        <div className="row">
          <div className="col-md-6 col-12">
           
            <input
              type="type"
              name="state"
              id="state"
              {...formik.getFieldProps("state")}
              className={`form-control ${formik.touched.state && formik.errors.state
                ? "is-invalid"
                : ""
                }`}
             placeholder="Enter state"
            />
            {formik.touched.state && formik.errors.state && (
          <p className="text-danger text-start">
            {formik.errors.state}
          </p>
        )}
          </div>
          <div className="col-md-6 col-12">
            <input
             
              type="text"
              //className="form-control "
              pattern="[0-9]*"
              id="zipCode"
              {...formik.getFieldProps("zipCode")}
              className={`form-control ${formik.touched.zipCode && formik.errors.zipCode
                ? "is-invalid"
                : ""
                }`}
              placeholder="zip"
            //  onChange={(e)=>{e.target.value.replace(/\D/g, '')}}
            />
             {formik.touched.zipCode && formik.errors.zipCode && (
          <p className="text-danger text-start">
            {formik.errors.zipCode}
          </p>
        )}
          </div>
        </div>
        <div className="mb-3">
          <input
           
            type="text"
            id="country"
            {...formik.getFieldProps("country")}
              className={`form-control ${formik.touched.country && formik.errors.country
                ? "is-invalid"
                : ""
                }`}
            placeholder="Country"
          />
          {formik.touched.country && formik.errors.country && (
          <p className="text-danger text-start">
            {formik.errors.country}
          </p>
        )}
        </div>
      </div>

      <button
        className="contactsubmitBtn btn btn-danger mx-auto"
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
