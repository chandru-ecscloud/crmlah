import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
// import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = yup.object().shape({
  name: yup.string().required("*Enter the Name"),
  companyName: yup.string().required("*Enter the Company Name"),
  email: yup
    .string()
    .email("*Pls Enter valid email")
    .required("*Enter the Email"),

  role: yup.string().required("*Select the Role"),
  appointmentRoleType: yup.string().required("*Select the Appointment Role"),
  countryCode: yup.string().required("*Country Code is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("phone-length", function (value) {
      const { countryCode } = this.parent;
      if (countryCode === "65") {
        return value && value.length === 8
          ? true
          : this.createError({ message: "Phone number must be 8 digits only" });
      }
      if (countryCode === "91") {
        return value && value.length === 10
          ? true
          : this.createError({
              message: "Phone number must be 10 digits only",
            });
      }
      return true; // Default validation for other country codes
    }),
  address: yup.string().required("*Enter Address"),
  city: yup.string().required("*Enter city"),
  state: yup.string().required("*Enter state"),
  zipCode: yup
    .string()
    .required("*Enter zipcode")
    .matches(/^\d+$/, "Must be only digits"),
  country: yup.string().required("*Enter contry"),
  registrationStatus: yup.string().required("*Status is required"),
});
function UserEdit() {
  const companyId = sessionStorage.getItem("companyId");
  // const owner = sessionStorage.getItem("user_name");
  // const role = sessionStorage.getItem("role");
  const { id } = useParams();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      companyId: companyId,
      registrationStatus: "",
      name: "",
      companyName: "",
      email: "",
      role: "",
      appointmentRoleType: "",
      countryCode: "",
      phone: "",
      address: "",
      city: "",
      street: "",
      state: "",
      zipCode: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      try {
        const response = await axios.put(
          `${API_URL}updateUserRegister/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/users");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error?.response?.data?.message);
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
        console.log("userData", userData);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, []);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Update User</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/users"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Update
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>User Information</b>
          </h4>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("name")}
                  name="name"
                  id="name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-danger">{formik.errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyName && formik.errors.companyName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("companyName")}
                  name="companyName"
                  id="companyName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-danger">{formik.errors.companyName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Email</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="email"
                  className={`form-size form-control  ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                  id="email"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-danger">{formik.errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Role</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.role && formik.errors.role
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("role")}
                  id="role"
                >
                  <option></option>
                  <option value="CMP_ADMIN">Admin</option>
                  <option value="CMP_USER">User</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-danger">{formik.errors.role}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Appointment Role</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.appointmentRoleType &&
                    formik.errors.appointmentRoleType
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("appointmentRoleType")}
                  id="appointmentRoleType"
                >
                  <option></option>
                  <option value="SALES_MANAGER">SALES MANAGER</option>
                  <option value="SALES_EXECUTIVE">SALES EXECUTIVE</option>
                  <option value="FREELANCERS">FREELANCERS</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.appointmentRoleType &&
                    formik.errors.appointmentRoleType && (
                      <p className="text-danger">
                        {formik.errors.appointmentRoleType}
                      </p>
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
                      className={`form-size form-control  ${
                        formik.touched.countryCode && formik.errors.countryCode
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <option value="65" selected>
                        +65
                      </option>
                      <option value="91">+91</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-size form-control  ${
                      formik.touched.phone && formik.errors.phone
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
                <label>Registration Status</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  id="registrationStatus"
                  className="form-size form-select"
                  {...formik.getFieldProps("registrationStatus")}
                >
                  {/* <option value=""></option> */}
                  <option value="PENDING">PENDING</option>
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
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Address</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("address")}
                  name="address"
                  id="address"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-danger">{formik.errors.address}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>City</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.city && formik.errors.city
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("city")}
                  name="city"
                  id="city"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-danger">{formik.errors.city}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>State</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.state && formik.errors.state
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("state")}
                  name="state"
                  id="state"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-danger">{formik.errors.state}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Zip Code</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.zipCode && formik.errors.zipCode
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("zipCode")}
                  name="zipCode"
                  id="zipCode"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <p className="text-danger">{formik.errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Country</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.country && formik.errors.country
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("country")}
                  name="country"
                  id="country"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.country && formik.errors.country && (
                    <p className="text-danger">{formik.errors.country}</p>
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
export default UserEdit;
