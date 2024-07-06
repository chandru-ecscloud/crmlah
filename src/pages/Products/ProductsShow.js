import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
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
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Product Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productOwner || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Product Category</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCategory || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Product Code</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCode || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Unit Price</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.unitPrice || "--"}
                </span>
              </div>
              <div className="address-item">
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
              <div className="address-item">
                <label className="text-dark Label">Product Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productOwner || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Product Active</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  {productData.productActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Product Category</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productCategory || "--"}
                </span>
              </div>

              <div className="address-item">
                <label className="text-dark Label">Sales End Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.salesEndDate || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Created At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.createdAt ?productData.createdAt.split("T")[0]: "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Updated At</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.updatedAt ?productData.updatedAt.split("T")[0]: "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div className="address-item">
                <label className="text-dark Label">Product Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.productName || "--"}
                </span>
              </div>
              <div className="address-item">
                <label className="text-dark Label">Sales Start Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{productData.salesStartDate || "--"}
                </span>
              </div>
              <div className="address-item">
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
                <div className="address-item">
                  <label className="text-dark Label">Unit Price</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.unitPrice || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Taxable</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.taxable ? "Yes" : "No"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Tax</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.tax || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div className="address-item">
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
                <div className="address-item">
                  <label className="text-dark Label">Usage Unit</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.usageUnit || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Quantity in Stock</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.quantityInStock || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Handler</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{productData.handler || "--"}
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

              <div className="address-item">
                <label className="text-dark Label">Description</label>
                <span className="text-dark">
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
