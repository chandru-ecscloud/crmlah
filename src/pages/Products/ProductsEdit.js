import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

function ProductsEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem('role');
  const [userImage, setUserImage] = useState(User);

  const [formData, setFormData] = useState({
    salutation: "",
    product_owner: "",
    product_code: "",
    product_name: "",
    product_active: "",
    product_category: "",
    vendor_name: "",
    sales_start_date: "",
    sales_end_date: "",
    support_start_date: "",
    support_end_date: "",
    commission_rate:"",
    description_info: "",
    unit_price:"",
    usage_unit:"",
    quantity_in_stock:"",
    quantity_ordered:"",
    handler:""

  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handelCancel = () => {
    navigate(`/products`);
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${API_URL}allProducts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const keyMapping = {
          salutation: "salutation",
          productOwner: "product_owner",
          productCode: "product_code",
          productName: "product_name",
          productActive: "product_active",
          productCategory: "product_category",
          vendorName: "vendor_name",
          salesStartDate: "sales_start_date",
          salesEndDate: "sales_end_date",
          supportStartDate: "support_start_date",
          supportEndDate: "support_end_date",
          descriptionInfo: "description_info",
          unitPrice:"unit_price",
          usageUnit:"usage_unit",
          quantityInStock:"quantity_in_stock",
          handler:"handler",
          quantityOrdered:"quantity_ordered",
          commissionRate:"commission_rate"
    
        };

        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            const newKey = keyMapping[key] || key;
            acc[newKey] =
              key === "salesStartDate" ||
              key === "supportStartDate" ||
              key === "salesEndDate" ||
              key === "supportEndDate"
                ? response.data[key].split("T")[0]
                : response.data[key];
            return acc;
          },
          {}
        );

        setFormData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  const updateProduct = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateProduct/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/products");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="createLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Edit Products</b>
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
                onClick={updateProduct}
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
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <label>Product Owner</label>&nbsp;&nbsp;
            <select
              id="product_owner"
              className="form-size form-select"
              name="product_owner"
              onChange={handleChange}
            >
              <option value={owner} selected={formData.lead_owner === owner}>
                {owner}
              </option>{" "}
              <option
                value="Vignesh Devan"
                selected={formData.product_owner === "Vignesh Devan"}
              >
                Vignesh Devan
              </option>
              <option
                value="Chandru R"
                selected={formData.product_owner === "Chandru R"}
              >
                Chandru R
              </option>
              <option
                value="Gayathri M"
                selected={formData.product_owner === "Gayathri M"}
              >
                Gayathri M
              </option>
              <option
                value="Poongodi K"
                selected={formData.product_owner === "Poongodi K"}
              >
                Poongodi K
              </option>
              <option
                value="Suriya G"
                selected={formData.product_owner === "Suriya G"}
              >
                Suriya G
              </option>
              <option
                value="Leela Prasanna D"
                selected={formData.product_owner === "Leela Prasanna D"}
              >
                Leela Prasanna D
              </option>
              <option
                value="Saravanan M"
                selected={formData.product_owner === "Saravanan M"}
              >
                Saravanan M
              </option>
              <option
                value="Nagaraj VR"
                selected={formData.product_owner === "Nagaraj VR"}
              >
                Nagaraj VR
              </option>
              <option
                value="Yalini A"
                selected={formData.product_owner === "Yalini A"}
              >
                Yalini A
              </option>
              <option
                value="Vishnu Priya"
                selected={formData.product_owner === "Vishnu Priya"}
              >
                Vishnu Priya
              </option>
              <option
                value="Kavitha"
                selected={formData.product_owner === "Kavitha"}
              >
                Kavitha
              </option>
            </select>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Product Name</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="product_name"
              id="product_name"
              value={formData.product_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Product Code</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="product_code"
              id="product_code"
              value={formData.product_code || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Vendor Name</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="vendor_name"
              id="vendor_name"
              value={formData.vendor_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Product Active</lable> &nbsp;&nbsp;
            <input
              type="checkbox"
              className=""
              name="product_active"
              id="product_active"
              value={formData.product_active || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Manufacturer</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="manufacturer"
              id="manufacturer"
              onChange={handleChange}
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Product Category</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="product_category"
              id="product_category"
              value={formData.product_category || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales Start Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="sales_start_date"
              id="sales_start_date"
              value={formData.sales_start_date || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Sales End Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="sales_end_date"
              id="sales_end_date"
              value={formData.sales_end_date || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Support Start Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="support_start_date"
              id="support_start_date"
              value={formData.support_start_date || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Support End Date</lable> &nbsp;&nbsp;
            <input
              type="date"
              className="form-size form-control"
              name="support_end_date"
              id="support_end_date"
              value={formData.support_end_date || ""}
              onChange={handleChange}
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
              type="text"
              className="form-size form-control"
              name="unit_price"
              id="unit_price"
              onChange={handleChange}
              value={formData.unit_price || ""}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Commission Rate</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="commission_rate"
              id="commission_rate"
              onChange={handleChange}
              value={formData.commission_rate || ""}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Tax</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="tax"
              id="tax"
              onChange={handleChange}
              value={formData.tax || ""}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Taxable</lable> &nbsp;&nbsp;
            <input
              type="checkbox"
              className="form-size"
              name="taxable"
              id="taxable"
              onChange={handleChange}
              value={formData.taxable || ""}
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
              type="text"
              className="form-size form-control"
              name="usage_unit"
              id="usage_unit"
              onChange={handleChange}
              value={formData.usage_unit || ""}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quantity Ordered</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="quantity_ordered"
              id="quantity_ordered"
              onChange={handleChange}
              value={formData.quantity_ordered || ""}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quantity in Stock</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="quantity_in_stock"
              id="quantity_in_stock"
              onChange={handleChange}
              value={formData.quantity_in_stock || ""}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Reorder Level</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="reorder_level"
              id="reorder_level"
              onChange={handleChange}
              placeholder="--"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Handler</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="handler"
              id="handler"
              onChange={handleChange}
              value={formData.handler || ""}
              
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Quantity in Demand</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="qty_demand"
              id="qty_demand"
              onChange={handleChange}
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
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="description_info"
              id="description_info"
              value={formData.description_info || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsEdit;
