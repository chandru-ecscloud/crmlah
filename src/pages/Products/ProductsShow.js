import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
import { Tooltip, Zoom } from "@mui/material";

function ProductsShow() {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allProducts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const transformedData = Object.keys(response.data).reduce(
          (acc, key) => {
            let value = response.data[key];
            if (
              (key === "salesEndDate" ||
                key === "salesStartDate" ||
                key === "supportEndDate" ||
                key === "supportStartDate") &&
              value
            ) {
              const date = new Date(value);

              value = date.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              value = value.replace(/\d{4}$/, "2024");
            }

            acc[key] = value;
            return acc;
          },
          {}
        );
        setProductData(transformedData);
        console.log("Product Data:",transformedData);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  const handelEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  return (
    <>
      {/* {/ header section /} */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-sm-6 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <Tooltip TransitionComponent={Zoom} title="Back">
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/products")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </Tooltip>
                <img
                  className="img-fluid"
                  style={{ width: "5rem" }}
                  src={USER}
                  alt="profile"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 mt-1" id="buttons-container">
          <SendEmail />

          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
            onClick={handelEdit}
          >
            Edit
          </button>

          <button className="btn bg-light bg-gradient mx-2  text-dark shadow-none">
            <BsThreeDots />
          </button>
        </div>
      </section>

      {/* {/ Products Information Section /} */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* {/ left Side Content /} */}
        <div className="container-fluid col-md-2 m-0" id="ulList-container">
          <h3 className="text-start ms-4 mt-3 fw-bold fw-bold">Related List</h3>
          <ul className="m-0 py-1">
            <li className="mt-2">
              <Link className="py-3">Notes</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Products</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Attachments</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Open Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Closed Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Invited Meeting</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Emails</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Campaigns</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Social</Link>
            </li>

            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">
                Add Related List
              </Link>
            </li>
          </ul>
          <h3 className="text-start ms-4 mt-4 fw-bold">Links</h3>
          <ul className="m-0 py-1">
            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">Add Links</Link>
            </li>
          </ul>
        </div>

        {/* {/ Right Side Content /} */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* {/ Details /} */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Product Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productOwner || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Product Category</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCategory || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Product Code</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCode || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Unit Price</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.unitPrice || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Vendor Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.vendorName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Qty Ordered</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.qtyOrdered || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Quantity in Stock</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.quantityInStock || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* {/ Hide Details /} */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Hide Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Product Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Product Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productOwner || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Product Active</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Product Category</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCategory || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Sales End Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.salesEndDate || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Support End Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.supportEndDate || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.updatedBy || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Product Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Vendor Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.vendorName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Manufacturer</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.manufacturer || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Sales Start Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.salesStartDate || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Support Start Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.supportStartDate || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.createdBy || "--"}
                </span>
              </div>
            </div>

            {/* {/ Price  Information /} */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Price Information
                </span>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Unit Price</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.unitPrice || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Taxable</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.taxable ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Tax</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.tax || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Commission Rate</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.commissionRate || "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* {/ Stock   Information /} */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Stock Information
                </span>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Usage Unit</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.usageUnit || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Quantity in Stock</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.quantityInStock || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Handler</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.handler || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Qty Ordered</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.handler || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Reorder Level</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.reorderLevel || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Qty Demand</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.qtyDemand || "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* {/ Description Information /} */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row">
                <span className="my-3 fs-6 fw-bold my-3">
                  Description Information
                </span>
              </div>

              <div>
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.descriptionInfo || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* {/ Notes /} */}
          <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Notes</span>
              </div>
              <div className="dropdown">
                <Link
                  className="btn border border-primary text-primary dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Recent Last
                </Link>
                <ul className="dropdown-menu">
                  <li className="mt-2"></li>
                </ul>
              </div>
            </div>

            <div className="container  col-12">
              <textarea
                className="form-control py-2 m-3 textarea"
                placeholder="'Add note...'"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductsShow;
