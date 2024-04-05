import React, { useState } from "react";
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
  vendor_name: yup.string().required("!Enter Vendor Name"),
  product_name: yup.string().required("!Enter Product Name"),
  product_code: yup.string().required("!Enter Product Code"),
  product_owner: yup.string().required("!Select Product Owner"),
});
function ProductCreate() {
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem('role');
  const [userImage, setUserImage] = useState(User);
  const userId = sessionStorage.getItem("userId");
  const [checked,setChecked] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handelCancel = () => {
    navigate("/products");
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

  const handleApiSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}newProduct`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    };
  };

  return (
    <section className="createLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Create Product</b>
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
          <b>Product Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
        <input type="hidden" {...register("company_id")} value={userId} name="company_id" />

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Product Owner</lable> &nbsp;&nbsp;
              <select
                {...register("product_owner")}
                type="text"
                className="form-size form-control"
                id="product_owner"
              >
                <option value={owner}>{owner}</option>
                <option value="Suriya">Suriya</option>
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
                <p className="text-danger">{errors.product_owner?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Product Name</lable> &nbsp;&nbsp;
              <input
                {...register("product_name")}
                type="text"
                className="form-size form-control"
                id="product_name"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.product_name?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Product Code</lable> &nbsp;&nbsp;
              <input
                {...register("product_code")}
                type="text"
                className="form-size form-control"
                id="product_code"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.product_code?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Vendor Name</lable> &nbsp;&nbsp;
              <input
                {...register("vendor_name")}
                type="text"
                className="form-size form-control"
                id="vendor_name"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.vendor_name?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-start mb-3" >
            <lable id="productActive">Product Active</lable> &nbsp;&nbsp;
            <input
            {...register("product_active")}
              type="checkbox"
              value={checked}
              onChange={() =>{setChecked(!checked)}}
              className="p-1 ms-3"
              name="product_active"
              id="product_active"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Manufacturer</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="manufacturer"
              id="manufacturer"
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Product Category</lable> &nbsp;&nbsp;
            <input
            {...register("product_category")}
              type="text"
              className="form-size form-control"
              name="product_category"
              id="product_category"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales Start Date</lable> &nbsp;&nbsp;
            <input
            {...register("sales_start_date")}
              type="date"
              className="form-size form-control"
              name="sales_start_date"
              id="sales_start_date"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales End Date</lable> &nbsp;&nbsp;
            <input
            {...register("sales_end_date")}
              type="date"
              className="form-size form-control"
              name="sales_end_date"
              id="sales_end_date"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Support Start Date</lable> &nbsp;&nbsp;
            <input
            {...register("support_start_date")}
              type="date"
              className="form-size form-control"
              name="support_start_date"
              id="support_start_date"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Support End Date</lable> &nbsp;&nbsp;
            <input
            {...register("support_end_date")}
              type="date"
              className="form-size form-control"
              name="support_end_date"
              id="support_end_date"
            />
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
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Unit Price</lable> &nbsp;&nbsp;
            <input
            {...register("unit_price")}
              type="text"
              className="form-size form-control"
              name="unit_price"
              id="unit_price"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Commission Rate</lable> &nbsp;&nbsp;
            <input
            {...register("commission_rate")}
              type="text"
              className="form-size form-control"
              name="commission_rate"
              id="commission_rate"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Tax</lable> &nbsp;&nbsp;
            <input
            {...register("tax")}
              type="text"
              className="form-size form-control"
              name="tax"
              id="tax"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-start mb-3">
            <lable id="productActive">Taxable</lable> &nbsp;&nbsp;
            <input
            {...register("taxable")}
              type="checkbox"
              className="p-1 ms-3"
              name="taxable"
              id="taxable"
            />
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
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Usage Unit</lable> &nbsp;&nbsp;
            <input
            {...register("usage_unit")}
              type="text"
              className="form-size form-control"
              name="usage_unit"
              id="usage_unit"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quantity Ordered</lable> &nbsp;&nbsp;
            <input
             {...register("quantity_ordered")}
              type="text"
              className="form-size form-control"
              name="quantity_ordered"
              id="quantity_ordered"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quantity in Stock</lable> &nbsp;&nbsp;
            <input
             {...register("quantity_in_stock")}
              type="text"
              className="form-size form-control"
              name="quantity_in_stock"
              id="quantity_in_stock"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Reorder Level</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="reorder_level"
              id="reorder_level"
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Handler</lable> &nbsp;&nbsp;
            <input
            {...register("handler")}
              type="text"
              className="form-size form-control"
              name="handler"
              id="handler"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quantity in Demand</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="qty_demand"
              id="qty_demand"
              placeholder="--"
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

export default ProductCreate;
