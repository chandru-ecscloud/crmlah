import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SendInvoice from "../Email/SendInvoice";
import AttactmentPdf from "../../assets/Attactment pdf.jpg";
import AttactmentExcel from "../../assets/Attactment Excel.jpg";
import AttactmentOther from "../../assets/Attactment others.jpg";
// import AttactmentYoutube from "../../assets/AttachmentYoutube.jpg";
import AttactmentWord from "../../assets/Attactment Word.jpg";
import AttactmentPpt from "../../assets/Attachment Ppt.png";
// import { MdDeleteOutline } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import DeleteAttach from "../../components/common/DeleteModelAttach";

function ProposalShow() {
  const { id } = useParams();
  const [proposalData, setProposalData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllCompanyProposalById/${id}`
      );

      if (response.status === 200) {
        setProposalData(response.data);
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

    const attachmentId = attachment.id;
    const url = attachment.multipleAttachments;
    const extension = url.split(".").pop().toLowerCase();
    const fileName = url.split("/").pop();

    const downloadFile = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const renderCard = (src, label, attachmentId, isVideo = false) => (
      <div className="position-relative d-flex justify-content-center mb-3">
        <div className="delete-icon-container">
          <DeleteAttach id={attachmentId} onSuccess={getData} />
        </div>
        <div className="card" style={{ width: "18rem", marginTop: "20px" }}>
          {isVideo ? (
            <video
              width="100%"
              height="auto"
              controls
              style={{ maxHeight: "150px" }}
            >
              <source src={src} type="video/mp4" />
              <source src={src} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={src}
              alt={label}
              style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
            />
          )}
          <div className="card-body">
            <div className="row">
              <div className="col-md-8 col-12 text-end">
                <p>{label}</p>
              </div>
              <div className="col-md-4 col-12 text-end">
                <p>
                  <IoMdDownload
                    onClick={downloadFile}
                    style={{ cursor: "pointer" }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return renderCard(url, "Image", attachmentId);
      case "pdf":
        return renderCard(AttactmentPdf, "PDF", attachmentId);
      case "xls":
      case "xlsx":
      case "csv":
        return renderCard(AttactmentExcel, "Excel", attachmentId);
      case "mp4":
      case "ogg":
        return renderCard(url, "Video", attachmentId, true);
      case "doc":
      case "docx":
        return renderCard(AttactmentWord, "Word", attachmentId);
      case "ppt":
      case "pptx":
        return renderCard(AttactmentPpt, "PPT", attachmentId);
      default:
        return renderCard(AttactmentOther, "Other", attachmentId);
    }
  };

  return (
    <>
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
            </div>
          </div>
          <div className="container-fluid row" id="Details">
            <div className="my-3 container-fluid row">
              <span className="mt-3 mb-2 fs-6 fw-bold my-3">Mail Body</span>
            </div>
            <div className="mb-4">
              <span className="text-dark preserve-whitespace">
                {proposalData.mailBody || ""}
              </span>
            </div>
          </div>
          <div className="container-fluid row" id="Details">
            <div className="my-3 container-fluid row">
              <span className="mt-3 mb-2 fs-6 fw-bold my-3">
                Description Information
              </span>
            </div>
            <div className="mb-4">
              <span className="text-dark">
                {proposalData.description || ""}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProposalShow;
