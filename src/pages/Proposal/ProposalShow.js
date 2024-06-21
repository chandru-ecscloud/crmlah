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

function ProposalShow() {
  const { id } = useParams();
  const [proposalData, setProposalData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  // Dummy fetchData function to simulate API call
  // const fetchData = async () => {
  //   try {
  //     // Simulated data, replace with your actual API call
  //     const response = await axios.get(`${API_URL}/proposal/${id}`);
  //     setProposalData({
  //       ...response.data,
  //       attachment: "https://www.example.com/sample.pdf", // Replace with actual dummy attachment URL
  //     });
  //     setInvoiceData(response.data.invoiceData);
  //   } catch (error) {
  //     toast.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [id]);

  const handelEdit = () => {
    navigate(`/proposal/edit`);
  };

  const renderAttachment = (attachment) => {
    if (!attachment) {
      return <span>No attachment available</span>;
    }

    const extension = attachment.split('.').pop().toLowerCase();

    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
      return <img src={attachment} alt="Attachment" style={{ width: "100%", maxHeight: "300px" }} />;
    } else if (extension === 'pdf') {
      return <iframe src={attachment} title="Attachment" style={{ width: "100%", height: "500px" }} />;
    } else {
      return <a href={attachment} download>Download Attachment</a>;
    }
  };

  return (
    <>
      {/* header section */}
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
                    onClick={() => navigate("/deals")}
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
          <button
            className={`btn btn-warning ms-2 ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER"}
            onClick={handelEdit}
          >
            Edit
          </button>
        </div>
      </section>

      {/* Deals Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        <div className="container-fluid col-md-9 m-0" id="userDetails-container">
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
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
                  &nbsp; : &nbsp;{proposalData.subject || "Subject A"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Attachment</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{renderAttachment(proposalData.attachment)}
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
                &nbsp; : &nbsp;{proposalData.descriptionInfo || "Test"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProposalShow;
