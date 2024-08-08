import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import success from "../../assets/success.mp4";

function EventView() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [link, setLink] = useState("https://ecscloudinfotech.com/ecs/");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEdit = () => {
    navigate(`/event/edit`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopyButtonText("✓ Copied");

    setTimeout(() => {
      setCopyButtonText("Copy");
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
          <button className="btn btn-secondary" onClick={handleShow}>
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
          className="container-fluid col-md-10 m-0 "
          id="userDetails-container"
        >
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Event View</span>
            </div>

            <div className="container-fluid row">
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark ">Company Name</label>
                <span className="text-dark">&nbsp; : &nbsp;ECS Cloud</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">First Name</label>
                <span className="text-dark">&nbsp; : &nbsp;Sakthivel</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Last Name</label>
                <span className="text-dark">&nbsp; : &nbsp;Jayabal</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label"> Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;Sakthiveljayabal23@gmail.com
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">&nbsp; : &nbsp;6382307159</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="container-fluid align-items-center col-10 my-3"
          id="Details"
        >
          <div className="address-item pt-4">
            <label className="text-dark Label">Enquiry</label>
            <span className="text-dark">&nbsp; : &nbsp; test</span>
          </div>
        </div>
        <div
          className="container-fluid align-items-center col-10 my-3"
          id="Details"
        >
          <div className="address-item  pt-4">
            <label className="text-dark Label">Agenda</label>
            <span className="text-dark">&nbsp; : &nbsp; test</span>
          </div>
        </div>
        <div
          className="container-fluid align-items-center col-10 my-3"
          id="Details"
        >
          <div className="address-item  pt-4">
            <label className="text-dark Label">Description</label>
            <span className="text-dark">&nbsp; : &nbsp; test</span>
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
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <video src={success} autoPlay loop muted className="w-50" />
          </div>
          <div className="d-flex justify-content-center">
            <p className="fw-bold ">Thank You!</p>
          </div>
          <div className="d-flex justify-content-center">
            <p className="fw-bold">Your Link Is successfully Generated!</p>
          </div>
          <div className="d-flex gap-3 align-items-center justify-content-center">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
            <button className="btn btn-secondary" onClick={handleCopy}>
              {copyButtonText}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EventView;
