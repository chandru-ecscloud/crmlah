import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import success from "../../assets/success.mp4";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

function EventView() {

  const { id } = useParams();
  const [eventData, setEventData] = useState({});
  console.log("Deal Data:", eventData);
  // const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [link, setLink] = useState("https://ecscloudinfotech.com/ecs/");
  const [copyButtonText, setCopyButtonText] = useState(<LuCopy />);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userData = async () => {
    try {
      const response = await axios(`${API_URL}getAllEventManagementById/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setEventData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    userData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/event/edit/${id}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopyButtonText(<LuCopyCheck className="text-success" />);

    setTimeout(() => {
      setCopyButtonText(<LuCopy />);
    }, 1000);
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
                  overlay={
                    <Tooltip id="button-tooltip-2" className="mailtip">
                      Back
                    </Tooltip>
                  }
                >
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/event")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          <button className="btn btn-primary" onClick={handleShow}>
            Generate Link
          </button>
          <Link to="/members">
            <button className="btn btn-primary ms-3">Members</button>
          </Link>
          <button className="btn btn-warning ms-3" onClick={handleEdit}>
            Edit
          </button>
        </div>
      </section>
      <section
        className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div
          className="container-fluid align-items-center col-10 my-3 "
          id="userDetails-container"
        >
          <div className="row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Event View</span>
            </div>

            <div className="container-fluid row">
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark ">Company Name</label>
                <span className="text-dark">&nbsp; : &nbsp;{eventData.companyName || ""}</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">First Name</label>
                <span className="text-dark">&nbsp; : &nbsp;{eventData.firstName || ""}</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Last Name</label>
                <span className="text-dark">&nbsp; : &nbsp;{eventData.lastName || ""}</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label"> Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{eventData.businessEmail || ""}
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">&nbsp; : &nbsp;{eventData.phone || ""}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="container-fluid align-items-center col-10 my-3 "
          id="Details"
        >
          {" "}
          <div className="my-2 container-fluid row">
            <span className="mt-3 mb-2 fs-6 fw-bold my-2 border-bottom">Enquiry</span>
          </div>
          <div className="address-item ">
            <span className="text-dark"> {eventData.enquiry || ""}</span>
          </div>
        </div>
        <div
          className="container-fluid align-items-center col-10 my-3"
          id="Details"
        >
          <div className="my-2 container-fluid row">
            <span className="fs-6 fw-bold my-2 border-bottom">Agenda</span>
          </div>
          <div className="address-item">
            <span className="text-dark"> {eventData.eventAgenda || ""}</span>
          </div>
        </div>
        <div
          className="container-fluid align-items-center col-10 my-3"
          id="Details"
        >
          <div className="my-3 container-fluid row">
            <span className="mt-3 mb-2 fs-6 fw-bold my-2 border-bottom">Description</span>
          </div>
          <div className="address-item ">
            <span className="text-dark ms-2"> {eventData.eventDescription || ""}</span>
          </div>
        </div>

      </section>

      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        className="d-flex align-items-center"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center">
          <div className="d-flex justify-content-center mb-3">
            <video src={success} autoPlay loop muted className="w-50 rounded" />
          </div>
          <p className="fw-midium mb-3">Thank You!</p>
          <p className="fw-midium">
            Your Link Has Been Successfully Generated!
          </p>
          <div className="d-flex gap-3 align-items-center justify-content-center mt-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <span className="link-text">{link}</span>
            </a>
            <button className="btn " onClick={handleCopy}>
              {copyButtonText}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EventView;
