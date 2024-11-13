import React, { useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import "../../styles/dummy.css";
import { useFormik } from "formik";
import UseScrollToError from "../UseScrollToError";

const validationSchema = yup.object().shape({
  // product_owner: yup.string().required("*Product Owner is required."),
  product_name: yup.string().required("*Product name is required."),
  product_code: yup.string().required("*Product code is required."),
  // vendor_name: yup.string().required("*Vendor name is required."),
  product_category: yup.string().required("*Product category is required."),
  sales_start_date: yup.date().required("*Date is required"),
  sales_end_date: yup.date().required("*Date is required")
  .min(yup.ref('sales_start_date'), 'Sales end date should not be before start date'),
  // support_start_date: yup.date().required("*Date is required"),
  // support_end_date: yup.date().required("*Date is required"),
  unit_price: yup.string()
  .matches(/^\d+(\.\d+)?$/, "Must be a valid number")
  .required("*Unit price is required."),
  // commission_rate: yup.string()
  // .matches(/^\d+$/, "Must be only digits")
  // .required("*Commission rate is required."),
  tax: yup.string()
  .matches(/^\d+(\.\d+)?$/, "Must be a valid number")
  .required("*Tax is required."),
  usage_unit: yup.string().matches(/^\d+$/, "Must be a digits").notRequired(),
  quantity_ordered: yup.string()
  .matches(/^\d+$/, "Must be only digits")
  .notRequired(),
  quantity_in_stock: yup.string()
  .matches(/^\d+$/, "Must be only digits")
  .notRequired(),
  // handler: yup.string().required("*Handler demand is required."),
  // description_info: yup.string().required("*Description is required"),
});

function ProductCreate() {
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [userImage, setUserImage] = useState(User);
  const companyId = sessionStorage.getItem("companyId");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      product_owner: owner,
      company_id: companyId,
      product_name: "",
      product_code: "",
      vendor_name: "",
      product_active: false,
      manufacturer: "",
      product_category: "",
      sales_start_date: "",
      sales_end_date: "",
      support_start_date: "",
      support_end_date: "",
      usage_unit: "",
      quantity_ordered: "",
      quantity_in_stock: "",
      reorder_level: "",
      handler: "",
      quantity_in_demand: "",
      description_info: "",
      commission_rate: "",
      tax: "",
      taxable: false,
      unit_price: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Api Product Data:", data);
      data.product_active = !!data.product_active;
      data.taxable = !!data.taxable;
      try {
        const response = await axios.post(`${API_URL}newProduct`, data, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/products");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

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
  UseScrollToError(formik)

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Product</b>
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
            <div className="col-lg-6 col-md-6 col-12 mb-3 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/products"}>
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
            <b>Product Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Product Owner</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.product_owner && formik.errors.product_owner
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("product_owner")}
                  id="product_owner"
                  value={owner}
                  readOnly
                />
                  {/* <option value={owner}>{owner}</option>
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
                </input> */}
              </div>

              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.product_owner &&
                    formik.errors.product_owner && (
                      <p className="text-danger">
                        {formik.errors.product_owner}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Product Name</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.product_name && formik.errors.product_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("product_name")}
                  name="product_name"
                  id="product_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.product_name &&
                    formik.errors.product_name && (
                      <p className="text-danger">
                        {formik.errors.product_name}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Product Code</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.product_code && formik.errors.product_code
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("product_code")}
                  name="product_code"
                  id="product_code"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.product_code &&
                    formik.errors.product_code && (
                      <p className="text-danger">
                        {formik.errors.product_code}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Vendor Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.vendor_name && formik.errors.vendor_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("vendor_name")}
                  name="vendor_name"
                  id="vendor_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.vendor_name && formik.errors.vendor_name && (
                    <p className="text-danger">{formik.errors.vendor_name}</p>
                  )}
                </div>
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div
                className="d-flex align-items-center justify-content-center sm-device  "
                style={{ marginRight: "38%" }}
              >
                <lable>Product Active</lable> &nbsp;&nbsp;
                <input
                  type="checkbox"
                  value={checked}
                  className={`form-check-input  p-1 ms-3 ${
                    formik.touched.product_active &&
                    formik.errors.product_active
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("product_active")}
                  name="product_active"
                  id="product_active"
                />
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Manufacturer</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control `}
                  name="manufacturer"
                  id="manufacturer"
                  placeholder="--"
                />
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales Start Date</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control  ${
                    formik.touched.sales_start_date &&
                    formik.errors.sales_start_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("sales_start_date")}
                  name="sales_start_date"
                  id="sales_start_date"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.sales_start_date &&
                    formik.errors.sales_start_date && (
                      <p className="text-danger">
                        {formik.errors.sales_start_date}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales End Date</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control  ${
                    formik.touched.sales_end_date &&
                    formik.errors.sales_end_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("sales_end_date")}
                  name="sales_end_date"
                  id="sales_end_date"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.sales_end_date &&
                    formik.errors.sales_end_date && (
                      <p className="text-danger">
                        {formik.errors.sales_end_date}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Product Category</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.product_category &&
                    formik.errors.product_category
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("product_category")}
                  name="product_category"
                  id="product_category"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.product_category &&
                    formik.errors.product_category && (
                      <p className="text-danger">
                        {formik.errors.product_category}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Support Start Date</lable> &nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control  ${
                    formik.touched.support_start_date &&
                    formik.errors.support_start_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("support_start_date")}
                  name="support_start_date"
                  id="support_start_date"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.support_start_date &&
                    formik.errors.support_start_date && (
                      <p className="text-danger">
                        {formik.errors.support_start_date}
                      </p>
                    )}
                </div>
              </div>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Support End Date</lable> &nbsp;&nbsp;
                <input
                  type="date"
                  className={`form-size form-control  ${
                    formik.touched.support_end_date &&
                    formik.errors.support_end_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("support_end_date")}
                  name="support_end_date"
                  id="support_end_date"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.support_end_date &&
                    formik.errors.support_end_date && (
                      <p className="text-danger">
                        {formik.errors.support_end_date}
                      </p>
                    )}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Price Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Unit Price</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.unit_price && formik.errors.unit_price
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("unit_price")}
                  name="unit_price"
                  id="unit_price"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.unit_price && formik.errors.unit_price && (
                    <p className="text-danger">{formik.errors.unit_price}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Commission Rate(%)</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.commission_rate &&
                    formik.errors.commission_rate
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("commission_rate")}
                  name="commission_rate"
                  id="commission_rate"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.commission_rate &&
                    formik.errors.commission_rate && (
                      <p className="text-danger">
                        {formik.errors.commission_rate}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Tax(%)</lable> 
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input onInput={(event)=>{ event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 2);}}
                  type="text"
                  value={checked}
                  className={`form-size form-control  ${
                    formik.touched.tax && formik.errors.tax ? "is-invalid" : ""
                  }`}
                  {...formik.getFieldProps("tax")}
                  name="tax"
                  id="tax"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.tax && formik.errors.tax && (
                    <p className="text-danger">{formik.errors.tax}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div
                className="d-flex align-items-center justify-content-center  "
                style={{ marginRight: "28%" }}
              >
                <lable>Taxable</lable> &nbsp;&nbsp;
                <input
                  type="checkbox"
                  value={checked}
                  className={`form-check-input p-1 ms-3 ${
                    formik.touched.taxable && formik.errors.taxable
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("taxable")}
                  name="taxable"
                  id="taxable"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Stock Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Usage Unit</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.usage_unit && formik.errors.usage_unit
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("usage_unit")}
                  name="usage_unit"
                  id="usage_unit"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.usage_unit && formik.errors.usage_unit && (
                    <p className="text-danger">{formik.errors.usage_unit}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Quantity Ordered</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.quantity_ordered &&
                    formik.errors.quantity_ordered
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("quantity_ordered")}
                  name="quantity_ordered"
                  id="quantity_ordered"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.quantity_ordered &&
                    formik.errors.quantity_ordered && (
                      <p className="text-danger">
                        {formik.errors.quantity_ordered}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Quantity in Stock</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.quantity_in_stock &&
                    formik.errors.quantity_in_stock
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("quantity_in_stock")}
                  name="quantity_in_stock"
                  id="quantity_in_stock"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.quantity_in_stock &&
                    formik.errors.quantity_in_stock && (
                      <p className="text-danger">
                        {formik.errors.quantity_in_stock}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Reorder Level</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control `}
                  {...formik.getFieldProps("reorder_level")}
                  name="reorder_level"
                  id="reorder_level"
                  placeholder="--"
                />
              </div> */}
              {/* <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.reorder_level && formik.errors.reorder_level && (
                    <p className="text-danger">{formik.errors.reorder_level}</p>
                  )}
                </div>
              </div> */}
            {/* </div> */}

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Handler</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.handler && formik.errors.handler
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("handler")}
                  name="handler"
                  id="handler"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.handler && formik.errors.handler && (
                    <p className="text-danger">{formik.errors.handler}</p>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Quantity in Demand</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control`}
                  {...formik.getFieldProps("quantity_in_demand")}
                  name="quantity_in_demand"
                  id="quantity_in_demand"
                  placeholder="--"
                />
              </div> */}
              {/* <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.quantity_in_demand && formi k.errors.quantity_in_demand && (
                    <p className="text-danger">{formik.errors.quantity_in_demand}</p>
                  )}
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Description Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-start justify-content-center mb-3 sm-device">
                <lable>Description</lable> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description_info")}
                  name="description_info"
                  id="description_info"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ProductCreate;
