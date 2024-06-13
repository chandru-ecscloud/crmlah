import React, { useEffect } from "react";
// import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../../styles/dummy.css";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("*User Name is required"),
  companyName: Yup.string().required("*Company Name is required"),
  countryCode: Yup.string().required("*Country Code is required"),
  phone: Yup.string()
    .required('Phone number is required')
    .test('phone-length', function (value) {
      const { countryCode } = this.parent;
      if (value && /\s/.test(value)) {
        return this.createError({ message: 'Phone number should not contain spaces' });
      }
      if (countryCode === '65') {
        return value && value.length === 8 ? true : this.createError({ message: 'Phone number must be 8 digits only' });
      }
      if (countryCode === '91') {
        return value && value.length === 10 ? true : this.createError({ message: 'Phone number must be 10 digits only' });
      }
      return true; // Default validation for other country codes
    }),
  email: Yup.string().email("Invalid email").required("*Email is required"),
  registrationStatus: Yup.string().required("*Status is required"),
  role: Yup.string().required("*Role is required"),
  address: Yup.string().required("*Enter Your Address"),
  city: Yup.string().required("*Enter Your City"),
  // state: Yup.string().required("*Enter Your State"),
  zipCode: Yup.string().required("*Enter Country Code Number"),
  country: Yup.string().required("*Enter Your Country "),
  licenseLimit: Yup.number()
    .required("*License Limit is required")
    .positive("*License Limit must be positive")
    .integer("*License Limit must be an integer"),
});

function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const companyId = sessionStorage.getItem("companyId");

  const formik = useFormik({
    initialValues: {
      companyId: id,
      name: "",
      companyName: "",
      countryCode: "",
      phone: "",
      email: "",
      registrationStatus: "",
      role: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      licenseLimit: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Company Edit Data:", data);
      try {
        // Make both API calls simultaneously
        const [userResponse, companyResponse] = await Promise.all([
          axios.put(`${API_URL}updateUserRegister/${id}`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
          axios.put(
            `${API_URL}updateCompanyRegister/${formik.values.companyId}`,
            {
              licenseLimit: data.licenseLimit,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        // Check responses and handle accordingly
        if (userResponse.status === 200 && companyResponse.status === 200) {
          // Assuming both APIs return status 200 on success
          toast.success(companyResponse.data.message);
          navigate("/company");
        } else {
          toast.error(companyResponse.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error?.response?.data.message);
      }
    },
  });

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}allUserRegistrations/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        formik.setValues(response.data);
        console.log("userData", response.data);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, []);

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setUserImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Company</b>
                <br></br>
                {/* <img
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
                /> */}
                {/* Input for image upload */}
                {/* <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" /> */}
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <span>
                <Link to="/company">
                  <button className="btn btn-danger">Cancel</button>
                </Link>
              </span>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          {/* <h4>
            <b>Company Information</b>
          </h4> */}
        </div>
        <div className="container">
          <div className="row">
            <input
              type="hidden"
              {...formik.getFieldProps("companyId")}
              value={id}
              name="companyId"
            />

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Name</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("name")}
                  type="text"
                  className="form-size form-control"
                  id="name"
                  name="name"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger ">{formik.errors.name}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyName")}
                  type="text"
                  className="form-size form-control"
                  id="companyName"
                  name="companyName"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className="text-danger">
                      {formik.errors.companyName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Phone</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      {...formik.getFieldProps("countryCode")}
                      id="countryCode"
                      name="countryCode"
                      className={`form-size form-control  ${formik.touched.countryCode && formik.errors.countryCode
                        ? "is-invalid"
                        : ""
                        }`}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <option value="65" selected>+65</option>
                      <option value="91">+91</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-size form-control  ${formik.touched.phone && formik.errors.phone
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("phone")}
                    id="phone"
                    aria-label="Text input with checkbox"
                  />
                </div>
              </div>

              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-danger">{formik.errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Email</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  className="form-size form-control"
                  id="email"
                  name="email"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger ">{formik.errors.email}</div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Status</label>&nbsp;&nbsp;
                <select
                  id="registrationStatus"
                  className="form-size form-select"
                  name="registrationStatus"
                >
                  <option value="--"></option>
                  <option value="approved">Approved</option>
                  <option value="pending" selected>
                    Pending
                  </option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.registrationStatus && formik.errors.registrationStatus && (
                    <div className="text-danger ">{formik.errors.registrationStatus}</div>
                  )}
                </div>
              </div>
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Registration Status</label>&nbsp;&nbsp;
                <select
                  id="registrationStatus"
                  className="form-size form-select"
                  {...formik.getFieldProps("registrationStatus")}
                >
                  {/* <option value=""></option> */}
                  <option selected value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.registrationStatus &&
                    formik.errors.registrationStatus && (
                      <div className="text-danger ">
                        {formik.errors.registrationStatus}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>License Limit</label>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("licenseLimit")}
                  type="text"
                  className="form-size form-control"
                  id="licenseLimit"
                  name="licenseLimit"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.licenseLimit &&
                    formik.errors.licenseLimit && (
                      <div className="text-danger ">
                        {formik.errors.licenseLimit}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Role</label>&nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("role")}
                  type="text"
                  className="form-size form-control"
                  id="role"
                  name="role"
                  readOnly
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-danger ">{formik.errors.role}</div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Password</label>&nbsp;&nbsp;
                <div className="input-group " style={{ width: "60%" }}>
                  <input
                    {...formik.getFieldProps("Password")}
                    type={showPassword ? "text" : "password"}
                    className="form-size form-control"
                    id="Password"
                    name="Password"
                  />
                  <span
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.Password && formik.errors.Password && (
                    <div className="text-danger ">{formik.errors.Password}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Confirm Password</label>&nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <input
                    {...formik.getFieldProps("confirm_Password")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-size form-control"
                    id="confirm_Password"
                    name="confirm_Password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.confirm_Password &&
                    formik.errors.confirm_Password && (
                      <div className="text-danger ">
                        {formik.errors.confirm_Password}
                      </div>
                    )}
                </div>
              </div>
            </div> */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Address</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("address")}
                  type="text"
                  className="form-size form-control"
                  id="address"
                  name="address"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.address && formik.errors.address && (
                    <div className="text-danger ">{formik.errors.address}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>City</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("city")}
                  type="text"
                  className="form-size form-control"
                  id="city"
                  name="city"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-danger ">{formik.errors.city}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>State</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("state")}
                  type="text"
                  className="form-size form-control"
                  id="state"
                  name="state"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.state && formik.errors.state && (
                    <div className="text-danger ">{formik.errors.state}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Zip Code</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("zipCode")}
                  type="text"
                  className="form-size form-control"
                  id="zipCode"
                  name="zipCode"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <div className="text-danger ">{formik.errors.zipCode}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Country</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("country")}
                  type="text"
                  className="form-size form-control"
                  id="country"
                  name="country"
                />
              </div>
              <div className="row sm-device pb-4">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-danger ">{formik.errors.country}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CompanyEdit;
