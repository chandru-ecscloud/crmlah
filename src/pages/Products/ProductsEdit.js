import React, { useState, useEffect } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  product_owner: yup.string().required("*Product Owner is required."),
  product_name: yup.string().required("*Product name is required."),
  product_code: yup.string().required("*Product code is required."),
  vendor_name: yup.string().required("*Vendor name is required."),
  product_category: yup.string().required("*Product category is required."),
  sales_start_date: yup.date().required("*Date is required"),
  sales_end_date: yup.date().required("*Date is required"),
  support_start_date: yup.date().required("*Date is required"),
  support_end_date: yup.date().required("*Date is required"),
  unit_price: yup.number().required("*Unit price is required."),
  commission_rate: yup.number().required("*Commission rate is required."),
  tax: yup.number().required("*Tax is required."),
  usage_unit: yup.string().required("*Usage unit is required."),
  quantity_ordered: yup.number().required("*Quantity ordered is required."),
  quantity_in_stock: yup.number().required("*Quantity in stock is required."),
  handler: yup.string().required("*Handler demand is required."),
  description_info: yup.string().required("*Description is required"),
});

function ProductsEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [userImage, setUserImage] = useState(User);
  const userId = sessionStorage.getItem("userId");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      product_owner: "",
      company_id: userId,
      product_name: "",
      product_code: "",
      vendor_name: "",
      product_active: "",
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
      taxable: "",
      unit_price: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Api Producct Data:", data);
      try {
        const response = await axios.put(
          `${API_URL}updateProduct/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
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

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allProducts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        const validstring = getData.salesStartDate;
        const validUntilDate = new Date(validstring);
        const salesStartDate = `${validUntilDate.getFullYear()}-${(
          validUntilDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${validUntilDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const validstring2 = getData.salesEndDate;
        const validUntilDate2 = new Date(validstring2);
        const salesEndDate = `${validUntilDate2.getFullYear()}-${(
          validUntilDate2.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${validUntilDate2
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const validstring3 = getData.supportStartDate;
        const validUntilDate3 = new Date(validstring3);
        const supportStartDate = `${validUntilDate3.getFullYear()}-${(
          validUntilDate3.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${validUntilDate3
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const validstring4 = getData.supportEndDate;
        const validUntilDate4 = new Date(validstring4);
        const supportEndDate = `${validUntilDate4.getFullYear()}-${(
          validUntilDate4.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${validUntilDate4
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const payload = {
          product_owner: getData.productOwner,
          company_id: userId,
          product_name: getData.productName,
          product_code: getData.productCode,
          vendor_name: getData.vendorName,
          product_active: getData.productActive,
          manufacturer: getData.manufacturer,
          product_category: getData.productCategory,
          sales_start_date: salesStartDate,
          sales_end_date: salesEndDate,
          support_start_date: supportStartDate,
          support_end_date: supportEndDate,
          unit_price: getData.unitPrice,
          usage_unit: getData.usageUnit,
          quantity_ordered: getData.quantityOrdered,
          quantity_in_stock: getData.quantityInStock,
          reorder_level: getData.reorderLevel,
          handler: getData.handler,
          quantity_in_demand: getData.quantityInDemand,
          description_info: getData.descriptionInfo,
          commission_rate: getData.commissionRate,
          tax: getData.tax,
          taxable: getData.taxable,
        };
        console.log("Converted Data", getData.quantityOrdered);
        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

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

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Update Product</b>
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
                  Update
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
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.product_owner && formik.errors.product_owner
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("product_owner")}
                  id="product_owner"
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
                <lable>Product Name</lable> &nbsp;&nbsp;
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
                <lable>Product Code</lable> &nbsp;&nbsp;
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

            <div className="col-lg-6 col-md-6 col-12 mb-3">
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
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div
                className="d-flex align-items-center justify-content-center sm-device  "
                style={{ marginRight: "38%" }}
              >
                <label>Product Active</label> &nbsp;&nbsp;
                <input
                  type="checkbox"
                  checked={formik.values.product_active}
                  onChange={() =>
                    formik.setFieldValue(
                      "product_active",
                      !formik.values.product_active
                    )
                  }
                  className={`form-check-input p-1 ms-3 ${
                    formik.touched.product_active &&
                    formik.errors.product_active
                      ? "is-invalid"
                      : ""
                  }`}
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
                <lable>Product Category</lable> &nbsp;&nbsp;
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

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Sales Start Date</lable> &nbsp;&nbsp;
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
                <lable>Sales End Date</lable> &nbsp;&nbsp;
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
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
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
                <lable>Unit Price</lable> &nbsp;&nbsp;
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
                <lable>Commission Rate</lable> &nbsp;&nbsp;
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
                <lable>Tax</lable> &nbsp;&nbsp;
                <input
                  type="text"
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
                  checked={formik.values.taxable}
                  className={`form-check-input p-1 ms-3 ${
                    formik.touched.taxable && formik.errors.taxable
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={() =>
                    formik.setFieldValue("taxable", !formik.values.taxable)
                  }
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
            <b>Price Information</b>
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
                  // className="form-size form-control "
                  name="reorder_level"
                  id="reorder_level"
                  placeholder="--"
                />
              </div>
            </div> */}

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
              </div>
            </div> */}
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

export default ProductsEdit;
