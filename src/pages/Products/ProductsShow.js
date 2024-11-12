import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function ProductsShow() {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  // const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allProducts/${id}`, {
          headers: {
            "Content-Type": "application/json",          },
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
        console.log("Product Data:", transformedData);
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
        <div className="col-3 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="button-tooltip-2" className="mailtip">Back</Tooltip>}
                >
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/products")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          {/* <SendEmail /> */}

          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER"}
            onClick={handelEdit}
          >
            Edit
          </button>
        </div>
      </section>

      {/* {/ Products Information Section /} */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* {/ center Content /} */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* {/ Details /} */}
          {/* <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row">
                <label className="text-dark Label">Product Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productOwner || "--"}
                </span>
              </div>
              <div className="row">
                <label className="text-dark Label">Product Category</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCategory || "--"}
                </span>
              </div>
              <div className="row">
                <label className="text-dark Label">Product Code</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCode || "--"}
                </span>
              </div>
              <div className="row">
                <label className="text-dark Label">Unit Price</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.unitPrice || "--"}
                </span>
              </div>
              <div className="row">
                <label className="text-dark Label">Quantity in Stock</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.quantityInStock || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div> */}

          {/* {/ Hide Details /} */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Details</span>
            </div>

            <div className="py-3">
              <span className="fs-6 fw-bold"> Product Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Product Owner</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.productOwner || "--"}
                </span>
              </div>

              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Product Active</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;
                  {productData.productActive ? "Active" : "Inactive"}
                </span>
              </div>

              

              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Sales Start Date</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.salesStartDate || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Created At</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.createdAt ?productData.createdAt.split("T")[0]: "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Updated At</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.updatedAt ?productData.updatedAt.split("T")[0]: "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Product Name</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.productName || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Product Category</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.productCategory || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Sales End Date</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.salesEndDate || "--"}
                </span>
              </div>
              <div className="row mb-3">
                <label className="text-dark col-6 text-center">Created By</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{productData.createdBy || "--"}
                </span>
              </div>
            </div>
            {/* {/ Price  Information /} */}
            <div className="py-3">
              <span className="fs-6 fw-bold"> Price Information</span>
            </div>
            <div className="container-fluid col-md-6">
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Unit Price</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.unitPrice || "--"}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Taxable</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.taxable ? "Yes" : "No"}
                  </span>
                </div>
                
              </div>

              <div className="container-fluid col-md-6">
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Commission Rate</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.commissionRate || "--"}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Tax</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.tax || "--"}
                  </span>
                </div>
              </div>
             {/* {/ Stock   Information /} */}
              <div className="py-3">
              <span className="fs-6 fw-bold"> Stock Information</span>
            </div>
            <div className="container-fluid col-md-6">
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Usage Unit</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.usageUnit || "--"}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Quantity in Stock</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.quantityInStock || "--"}
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="text-dark col-6 text-center">Handler</label>
                  <span className="text-dark col-6">
                    &nbsp; : &nbsp;{productData.handler || "--"}
                  </span>
                </div>
              </div>
              <div className="container-fluid col-md-6"></div>
              {/* {/ Description Information /} */}
              <div className="py-3">
              <span className="fs-6 fw-bold">Description Information</span>
            </div>
              <div className="container-fluid col-md-12 mb-4 mt-2">
              <div className="row mb-3">
                <label className="text-dark col-4 text-center">Description</label>
                <span className="text-dark col-8">
                  &nbsp; : &nbsp;{productData.descriptionInfo || "--"}
                </span>
              </div>
              </div>

          </div>

          {/* Notes -- */}
        </div>
      </section>
    </>
  );
}

export default ProductsShow;
