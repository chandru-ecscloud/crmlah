import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SendInvoice from "../Email/SendInvoice";
import AttactmentPdf from "../../assets/Attactment pdf.jpg"; // Make sure the path is correct
import AttactmentExcel from "../../assets/Attactment Excel.jpg"; // Make sure the path is correct
import AttactmentOther from "../../assets/Attactment others.jpg"; // Make sure the path is correct

function ProposalShow() {
  const { id } = useParams();
  const [proposalData, setProposalData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  console.log("data", proposalData);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllCompanyProposalById/${id}`
      );

      if (response.status === 200) {
        setProposalData(response.data);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderAttachment = (attachment) => {
    if (!attachment) {
      return <span>No attachment available</span>;
    }

    const url = attachment.multipleAttachments;
    const extension = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return (
        <div>
          <img
            src={url}
            alt="Attachment"
            style={{ width: "100%", maxHeight: "350px" }}
            className="img-fluid mb-3"
          />
          {/* <a href={url} download>
            Download Attachment
          </a> */}
        </div>
      );
    } else if (extension === "pdf") {
      return (
        // <div className="text-center">
        //   <img
        //     src={AttactmentPdf}
        //     alt="PDF Thumbnail"
        //     style={{ width: "80%", height: "120px" }}
        //     className="img-fluid mb-3"
        //   />
        //   <p >
        //     <a href={url} target="_blank" rel="noopener noreferrer">
        //       Download PDF
        //     </a>
        //   </p>
        // </div>
        <div className="card" style={{ width: "18rem;" }}>
          <img
            src={AttactmentPdf}
            alt="PDF Thumbnail"
            style={{ width: "100%", height: "150px" }}
            className="img-fluid"
          />
          <div className="card-body">
          <p className="text-center">
            <a href={url} download>
              Download Pdf
            </a>
          </p>
          </div>
        </div>
      );
    } else if (extension === "excel") {
      return (
        <div className="card" style={{ width: "18rem;" }}>
          <img
            src={AttactmentExcel}
            alt="PDF Thumbnail"
            style={{ width: "100%", height: "150px" }}
            className="img-fluid"
          />
          <div className="card-body">
          <p className="text-center">
            <a href={url} download>
              Download Excel
            </a>
          </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card" style={{ width: "18rem;" }}>
          <img
            src={AttactmentOther}
            alt="PDF Thumbnail"
            style={{ width: "100%", height: "150px" }}
            className="img-fluid"
          />
          <div className="card-body">
          <p className="text-center">
            <a href={url} download>
              Download
            </a>
          </p>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-3 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="button-tooltip-2">Back</Tooltip>}
                >
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/user/proposal")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          {proposalData.email && (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="button-tooltip-2" className="mailtip">
                  Send Email
                </Tooltip>
              }
            >
              <span>
                <SendInvoice invoiceData={invoiceData} id={id} />
              </span>
            </OverlayTrigger>
          )}
          <Link to={`/user/proposal/edit/${id}`}>
            <button
              className={`btn btn-warning ms-2 ${
                role === "CMP_USER" && "disabled"
              }`}
              disabled={role === "CMP_USER"}
            >
              Edit
            </button>
          </Link>
        </div>
      </section>

      {/* Deals Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Details</span>
            </div>

            <div className="container-fluid col-md-12">
              <div>
                <label className="text-dark Label">Proposal Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{proposalData.proposalName || "Proposal A"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Proposal Type</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{proposalData.type || "Company Profile"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Subject</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{proposalData.subject || ""}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Attachment</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;
                  <div className="row">
                    {proposalData.companyProposalAttachments?.map(
                      (attachment, index) => (
                        <div key={index} className="col-md-4 col-12 mb-2">
                          {renderAttachment(attachment)}
                        </div>
                      )
                    )}
                  </div>
                </span>
              </div>
              <div>
                <label className="text-dark Label">Mail Body</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{proposalData.mailBody || ""}
                </span>
              </div>
            </div>
          </div>

          {/* Description Information */}
          <div className="container-fluid row" id="Details">
            <div className="my-3 container-fluid row">
              <span className="my-3 fs-6 fw-bold my-3">
                Description Information
              </span>
            </div>

            <div>
              <label className="text-dark Label">Description</label>
              <span className="text-dark">
                &nbsp; : &nbsp;{proposalData.description || ""}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProposalShow;
