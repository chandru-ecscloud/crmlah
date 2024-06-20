import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../../styles/dummy.css";

const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("*Company Name is required"),
    companyEmail: Yup.string().email("Invalid email").
        required("*Email is required"),
    companyMobile: Yup.string()
        .required('Phone number is required')
        .test('phone-length', function (value) {
            const { country_code } = this.parent;
            if (value && /\s/.test(value)) {
                return this.createError({ message: 'Phone number should not contain spaces' });
            }
            if (country_code === '65') {
                return value && value.length === 8 ? true : this.createError({ message: 'Phone number must be 8 digits only' });
            }
            if (country_code === '91') {
                return value && value.length === 10 ? true : this.createError({ message: 'Phone number must be 10 digits only' });
            }
            return false; // Default validation for other country codes
        }),
});



function CompanyAdd() {
    const navigate = useNavigate();
    const owner = sessionStorage.getItem("user_name");
    const token = sessionStorage.getItem("token");
    const [userImage, setUserImage] = useState(User);
    const role = sessionStorage.getItem("role");
    const companyId = sessionStorage.getItem("companyId");
    const [accountOption, setAccountOption] = useState([]);
    const [sameAsShipping, setSameAsShipping] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    console.log(accountOption);

    const formik = useFormik({
        initialValues: {
            company_id: companyId,
            companyOwnerName: owner,
            companyLogo: "",
            companyName: "",
            companyEmail: "",
            companyMobile: "",
            country_code: "65",
            companyStreet: "",
            companyCity: "",
            companyState: "",
            companyZipCode: "",
            companyCountry: "",
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: async (data) => {
            data.account_name = `${data.first_name}${data.last_name}`

            console.log("Account Datas:", data);
            // try {
            //     const response = await axios.post(`${API_URL}n`, data, {
            //         headers: {
            //             "Content-Type": "application/json",
            //             //Authorization: `Bearer ${token}`,
            //         },
            //     });
            //     if (response.status === 201) {
            //         toast.success(response.data.message);
            //         navigate("/accounts");
            //     } else {
            //         toast.error(response.data.message);
            //     }
            // } catch (error) {
            //     toast.error("Failed: " + error.message);
            // }
        },
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        formik.setFieldValue("companyLogo", file);
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
                    //Authorization: `Bearer ${token}`,
                },
            });
            setAccountOption(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        AccountList();
        formik.setFieldValue("country_code", 65);
    }, []);

    return (
        <section className="createLead">
            <form onSubmit={formik.handleSubmit}>
                <div className="container-fluid">
                    <div className="row mt-3">
                        <div className="col-lg-6 col-md-6 col-12">

                        </div>
                        <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
                            <span>
                                <Link to="/users">
                                    <button className="btn btn-danger">Cancel</button>
                                </Link>
                            </span>
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
                        <b>Update Company</b>
                    </h4>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end  sm-device">
                                <lable>Company Owner</lable>
                                <span className="text-danger">*</span> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps("companyOwnerName ")}
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.companyOwnerName && formik.errors.companyOwnerName
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    id="companyOwnerName "
                                    name="companyOwnerName "
                                    value={owner}
                                    readOnly
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.companyOwnerName && formik.errors.companyOwnerName && (
                                        <p className="text-danger">{formik.errors.companyOwnerName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <lable>Company Logo</lable>
                                <span className="text-danger">*</span> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps("file")}
                                    type="file"
                                    className={`form-size form-control  ${formik.touched.file && formik.errors.file
                                        ? "is-invalid"
                                        : ""
                                        
                                        }`}
                                        onChange={handleFileChange}
                                    id="file"
                                    name="file"
                                />
                            </div>
                            {selectedFile && (
                                <div className="mb-2">
                                    {selectedFile.type.startsWith("image") && (
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Selected File"
                                            style={{ maxHeight: "100px" }}
                                        />
                                    )}
                                </div>
                            )}
                        </div> */}

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>Company Logo</label>
                                <span className="text-danger">*</span> &nbsp;&nbsp;
                                <input
                                    type="file"
                                    className={`form-size form-control ${formik.touched.companyLogo && formik.errors.companyLogo ? "is-invalid" : ""}`}
                                    onChange={handleFileChange}
                                    id="companyLogo"
                                    name="companyLogo"
                                />
                                {formik.touched.companyLogo && formik.errors.companyLogo ? (
                                    <div className="invalid-feedback">{formik.errors.companyLogo}</div>
                                ) : null}
                            </div>
                            {selectedFile && (
                                <div className="d-flex justify-content-end align-items-center mt-2">
                                    {selectedFile.type.startsWith("image") && (
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Selected File"
                                            style={{ maxHeight: "100px" }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end  sm-device">
                                <lable>Company Name</lable>
                                <span className="text-danger">*</span> &nbsp;&nbsp;
                                <input
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.companyName && formik.errors.companyName
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    {...formik.getFieldProps("companyName")}
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
                                <lable>Company Email</lable>
                                <span className="text-danger">*</span> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps("companyEmail")}
                                    type="text"
                                    className={`form-size form-control  ${formik.touched.companyEmail && formik.errors.companyEmail
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    id="companyEmail"
                                    name="companyEmail"
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.companyEmail && formik.errors.companyEmail && (
                                        <div className="text-danger ">{formik.errors.companyEmail}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>Company Mobile</label>
                                <span className="text-danger">*</span> &nbsp;&nbsp;
                                <div className="input-group" style={{ width: "60%" }}>
                                    <div>
                                        <select
                                            className={`form-size form-select  ${formik.touched.country_code && formik.errors.country_code
                                                ? "is-invalid"
                                                : ""
                                                }`}
                                            {...formik.getFieldProps("country_code")}
                                            style={{
                                                width: "80px",
                                                borderTopRightRadius: "0px",
                                                borderBottomRightRadius: "0px",
                                            }}
                                            name="country_code"
                                            id="country_code"
                                        >
                                            <option value="65">+65</option>
                                            <option value="91">+91</option>
                                        </select>
                                    </div>
                                    <input
                                        {...formik.getFieldProps("companyMobile")}
                                        type="tel"
                                        name="companyMobile"
                                        id="companyMobile"
                                        className={`form-size form-control  ${formik.touched.companyMobile && formik.errors.companyMobile
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        aria-label="Text input with checkbox"
                                    />
                                </div>
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.country_code && formik.errors.country_code && (
                                        <div className="text-danger ">
                                            {formik.errors.country_code}
                                        </div>
                                    )}
                                    {formik.touched.phone && formik.errors.phone && (
                                        <div className="text-danger ">{formik.errors.phone}</div>
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
                        {/* Shipping Street */}
                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>Street</label> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps('companyStreet')}
                                    type="text"
                                    className="form-size form-control"
                                    name="companyStreet"
                                    id="companyStreet"
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.companyStreet && formik.errors.companyStreet && (
                                        <div className="text-danger">
                                            {formik.errors.companyStreet}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Billing Street */}
                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>City</label> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps('companyCity')}
                                    type="text"
                                    className="form-size form-control"
                                    name="companyCity"
                                    id="companyCity"
                                    value={sameAsShipping ? formik.values.street : formik.values.companyCity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={sameAsShipping}
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.companyCity && formik.errors.companyCity && (
                                        <div className="text-danger">
                                            {formik.errors.companyCity}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping City */}
                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>State</label> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps('companyState')}
                                    type="text"
                                    className="form-size form-control"
                                    name="companyState"
                                    id="companyState"
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.companyState && formik.errors.companyState && (
                                        <div className="text-danger">
                                            {formik.errors.companyState}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping State */}
                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>Code</label> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps('companyZipCode')}
                                    type="text"
                                    className="form-size form-control"
                                    name="companyZipCode"
                                    id="companyZipCode"
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.companyZipCode && formik.errors.companyZipCode && (
                                        <div className="text-danger">
                                            {formik.errors.companyZipCode}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Billing State */}
                        <div className="col-lg-6 col-md-6 col-12 mb-3">
                            <div className="d-flex align-items-center justify-content-end sm-device">
                                <label>Country</label> &nbsp;&nbsp;
                                <input
                                    {...formik.getFieldProps('country')}
                                    type="text"
                                    className="form-size form-control"
                                    name="country"
                                    id="country"
                                    value={sameAsShipping ? formik.values.state : formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={sameAsShipping}
                                />
                            </div>
                            <div className="row sm-device">
                                <div className="col-5"></div>
                                <div className="col-6 sm-device">
                                    {formik.touched.country && formik.errors.country && (
                                        <div className="text-danger">
                                            {formik.errors.country}
                                        </div>
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

export default CompanyAdd;

