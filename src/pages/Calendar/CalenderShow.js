import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
// import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import CalenderEdit from "./CalenderEdit";
import { MdDelete } from "react-icons/md";

function CalenderShow({
  id,
  showViewModal,
  setShowViewModal,
  setShowDeleteModal,
  showEditModal,
  setShowEditModal,
}) {
  //   const { id } = useParams();
  const [clientData, setClientData] = useState({});

  // console.log("Ids is", clientData)
  // const [selectedEvent, setSelectedEvent] = useState(null);

  const userData = async () => {
    try {
      const response = await axios.get(`${API_URL}allAppointments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setClientData(response.data);
      // console.log("clientData",clientData)
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowViewModal(false);
  };

  useEffect(() => {
    if (id) {
      // Add a condition to check if id is defined
      console.log("id", id);
      userData();
    }
  }, [id, showViewModal]);

  return (
    <Modal
      show={showViewModal}
      size="xl"
      onHide={() => setShowViewModal(false)}
      centered
      scrollable
    >
      <Modal.Header className="Calenderview">
        <div className="">
          <b>
            <h5 className="modal-title">View Event Details</h5>
          </b>
        </div>
        <span className="calenderEdit-icon">
          <CalenderEdit
            id={id}
            setShowEditModal={setShowEditModal}
            setShowViewModal={setShowViewModal}
            showEditModal={showEditModal}
          />
          <button className="btn text-light">
            <MdDelete size={20} onClick={handleDeleteClick} />
          </button>
        </span>
        <span></span>

        <button className="btn close" onClick={() => setShowViewModal(false)}>
          <span className="text-light fs-4">X</span>
        </button>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <section className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Appointment For</b>
                </div>
                <div className="col-6">: {clientData.appointmentFor}</div>
              </div>
            </div>
            {/* <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Service Name</b>
                </div>
                <div className="col-6">: {clientData.serviceName}</div>
              </div>
            </div>

            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Duration</b>
                </div>
                <div className="col-6">: {clientData.duration}</div>
              </div>
            </div> */}
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Appointment Mode</b>
                </div>
                <div className="col-6">: {clientData.appointmentMode}</div>
              </div>
            </div>

            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Name</b>
                </div>
                <div className="col-6">: {clientData.appointmentName}</div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Start Date</b>
                </div>
                <div className="col-6">: {clientData.appointmentStartDate}</div>
              </div>
            </div>

            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Start Time</b>
                </div>
                <div className="col-6">: {clientData.appointmentStartTime}</div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Location</b>
                </div>
                <div className="col-6">: {clientData.location}</div>
              </div>
            </div>

            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Member</b>
                </div>
                <div className="col-6">: {clientData.member}</div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Street</b>
                </div>
                <div className="col-6">: {clientData.street}</div>
              </div>
            </div>

            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>City</b>
                </div>
                <div className="col-6">: {clientData.city}</div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>State</b>
                </div>
                <div className="col-6">: {clientData.state}</div>
              </div>
            </div>

            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>zipCode</b>
                </div>
                <div className="col-6">: {clientData.zipCode}</div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Country</b>
                </div>
                <div className="col-6">: {clientData.country}</div>
              </div>
            </div>

            <div className="col-md-6  col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Description</b>
                </div>
                <div className="col-6">: {clientData.description}</div>
              </div>
            </div>
            <div className="col-md-6  col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <b>Role</b>
                </div>
                <div className="col-6">
                  : {clientData.appointmentRoleType || "--"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}

export default CalenderShow;
