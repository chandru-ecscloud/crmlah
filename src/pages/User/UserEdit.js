import React, { useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
// import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = yup.object().shape({
    userName: yup.string().required("*Enter the User Name"),
    companyName: yup.string().required("*Enter the Company Name"),
    email: yup
        .string()
        .email("*Pls Enter valid email")
        .required("*Enter the Email"),

    role: yup.string().required("*Select the Role"),
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
        .min(8, "*phone must be at atleast 8 characters")
        .max(10, "*phone must be at most 10 characters"),
    address: yup.string().required("*Enter Address"),
    city: yup.string().required("*Enter city"),
    state: yup.string().required("*Enter state"),
    zipCode: yup
        .string()
        .required("*Enter zipcode")
        .matches(/^\d+$/, "Must be only digits"),
    country: yup.string().required("*Enter contry"),
});
function UserEdit() {
    const userId = sessionStorage.getItem("userId");
    const owner = sessionStorage.getItem("user_name");
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
    const [userImage, setUserImage] = useState(User);

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPasword] = useState(false);
    const formik = useFormik({
        initialValues: {
            userName: "",
            companyName: "",
            email: "",
            role: "",
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
            state: "",
            zipCode: "",
            country: "",

        },
        validationSchema: validationSchema,
        onSubmit: async (data) => {
            console.log("User Datas:", data);
            data.role = "CMP_USER";
            data.jwtRole = "CMP_USER";
            // try {
            //     const response = await axios.post(``, data, {
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //     });
            //     if (response.status === 201) {
            //         toast.success(response.data.message);
            //         navigate("/emailsuccess");
            //     } else {
            //         toast.error(response.data.message);
            //     }
            // } catch (error) {
            //     toast.error("Failed: " + error.message);
            // }
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleCPasswordVisibility = () => {
        setShowCPasword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };


    return (
        <section className="createLead">
            <form onSubmit={formik.handleSubmit}>
                <div className="container-fluid">
                    <div className="row mt-3">
                        <div className="col-lg-6 col-md-6 col-12">
                            <h4>
                                <b>Create User</b>
                            </h4>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
                            <Link to={"/users"}>
                                <button className="btn btn-danger">Cancel</button>
                            </Link>
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
                    <h4>
                        <b>Lead Information</b>
                    </h4>
                </div>

                <div className="container">
                    <div className="row">

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <lable>User Name</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.userName && formik.errors.userName
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("userName")}
                                    name="userName"
                                    id="userName"
                                    value={"Harishragavendhar B"}
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.userName && formik.errors.userName && (
                                        <p className="text-danger">{formik.errors.userName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <lable>Company Name</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.companyName && formik.errors.companyName
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("companyName")}
                                    name="companyName"
                                    id="companyName"
                                    value={"ECS"}
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
                                <lable>Email</lable> &nbsp;&nbsp;
                                <input
                                    type="email"
                                    className={`form-size form-control  ${formik.touched.email && formik.errors.email
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("email")}
                                    id="email"
                                    value={"harish@gmail.com"}
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
                                <lable>Role</lable> &nbsp;&nbsp;
                                <select
                                    type="text"
                                    className={`form-size form-select  ${formik.touched.role && formik.errors.role
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("role")}
                                    id="role"
                                >
                                    <option value=""></option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
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
                                <lable>Password</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.password && formik.errors.password
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("password")}
                                    id="password"
                                    value={"Harish@123"}
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="text-danger">{formik.errors.password}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <lable>Confirm Password</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.cpassword && formik.errors.cpassword
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("cpassword")}
                                    id="cpassword"
                                    value={"Harish@123"}
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.cpassword && formik.errors.cpassword && (
                                        <p className="text-danger">{formik.errors.cpassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <lable>Phone</lable> &nbsp;&nbsp;
                                <div className="input-group" style={{ width: "60%" }}>
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
                                        className={`form-size form-control  ${formik.touched.phone && formik.errors.phone
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("phone")}
                                        id="phone"
                                        aria-label="Text input with checkbox"
                                        value={"6385921325"}
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
                                <lable>Address</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.address && formik.errors.address
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("address")}
                                    name="address"
                                    id="address"
                                    value={"1/234, north street, pinnathur"}
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
                                <lable>City</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.city && formik.errors.city
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("city")}
                                    name="city"
                                    id="city"
                                    value={"Thiruvarur"}
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
                                <lable>State</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.state && formik.errors.state
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("state")}
                                    name="state"
                                    id="state"
                                    value={"Tamil Nadu"}
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
                                <lable>Zip Code</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.zipCode && formik.errors.zipCode
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("zipCode")}
                                    name="zipCode"
                                    id="zipCode"
                                    value={"614706"}
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
                                <lable>Country</lable> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.country && formik.errors.country
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("country")}
                                    name="country"
                                    id="country"
                                    value={"India"}
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
        </section >
    );
}
export default UserEdit