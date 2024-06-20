import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
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
  getData,
}) {
  const [clientData, setClientData] = useState({});
  const currentData = new Date().toISOString().split("T")[0];
  // Fetch user data based on appointment ID
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}allAppointments/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setClientData(response.data);
    } catch (error) {
      toast.error("Error fetching data: " + error.message);
    }
  };

  // Handle delete click event
  const handleDeleteClick = async () => {
    setShowDeleteModal(true);
    setShowViewModal(false);

    const mailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Invoice</title>
        <style>
          body { background-color: #ddd; }
          .invoice-box {
            font-size: 12px;
            max-width: 600px;
            background-color: #fff;
            margin: auto;
            padding: 30px;
            border-bottom: 3px solid #0059ff;
            line-height: 24px;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            color: #555;
            min-height: 85vh;
          }
          .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
          .invoice-box table td { padding: 5px; vertical-align: top; }
          .invoice-box table td.third { text-align: right; }
          .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
          .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
          .invoice-box table tr.item.last td { border-bottom: none; }
          .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
          .invoice { padding: 1rem; }
          #scan { float: right; }
          #scan img { max-width: 100%; height: auto; }
          @media print { .invoice-box { border: 0; } }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table>
            <tr class="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td class="title">
                      <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png"
                        style="width: 75%; max-width: 180px" alt="Logo" />
                    </td>
                    <td class="third">
                      <b>Date:</b> ${currentData}<br />
                      The Alexcier, 237 Alexandra Road,<br />
                      #04-10, Singapore-159929.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="invoice">
            <h1 style="color: black;">Hi, ${clientData.appointmentName}</h1>
            <p style="margin: 2rem 0 0; font-size: 1rem;">
              We regret to inform you that your scheduled appointment has been cancelled at your request. If you have any questions or need further assistance, please do not hesitate to contact us.<br />
            </p>
            <hr />
            <p style=" margin: 2rem 0 0;">See You Soon,</p>
            <h4 style=" margin: 0; ">${clientData.appointmentName}</h4>
            <p style=" margin: 0 ; ">ECS Cloud</p>
            <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
            <hr />
          </div>
        </div>
      </body>
      </html>`;

    try {
      const response = await axios.post(`${API_URL}sendMail`, {
        toMail: clientData.email,
        fromMail: clientData.email,
        subject: "Your Appointment Has Been Cancelled",
        htmlContent: mailContent,
      });

      if (response.status === 200) {
        toast.success("Mail sent successfully.");
      } else {
        toast.error("Error sending mail: " + response.data.message);
      }
    } catch (error) {
      toast.error("Failed to send email: " + error.message);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("id", id);
      fetchUserData();
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
        <div>
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
            getData={getData}
          />
          <button className="btn text-light">
            <MdDelete size={20} onClick={handleDeleteClick} />
          </button>
        </span>
        <button className="btn close" onClick={() => setShowViewModal(false)}>
          <span className="text-light fs-4">X</span>
        </button>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <section className="container-fluid">
          <div className="row">
            {clientData.appointmentFor && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Appointment For</b></div>
                  <div className="col-6">: {clientData.appointmentFor}</div>
                </div>
              </div>
            )}
            {clientData.appointmentMode && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Appointment Mode</b></div>
                  <div className="col-6">: {clientData.appointmentMode}</div>
                </div>
              </div>
            )}
            {clientData.appointmentName && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Name</b></div>
                  <div className="col-6">: {clientData.appointmentName}</div>
                </div>
              </div>
            )}
            {clientData.appointmentStartDate && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Start Date</b></div>
                  <div className="col-6">: {clientData.appointmentStartDate}</div>
                </div>
              </div>
            )}
            {clientData.appointmentStartTime && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Start Time</b></div>
                  <div className="col-6">: {clientData.appointmentStartTime}</div>
                </div>
              </div>
            )}
            {clientData.location && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Location</b></div>
                  <div className="col-6">: {clientData.location}</div>
                </div>
              </div>
            )}
            {clientData.member && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Member</b></div>
                  <div className="col-6">: {clientData.member}</div>
                </div>
              </div>
            )}
            {clientData.street && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Street</b></div>
                  <div className="col-6">: {clientData.street}</div>
                </div>
              </div>
            )}
            {clientData.city && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>City</b></div>
                  <div className="col-6">: {clientData.city}</div>
                </div>
              </div>
            )}
            {clientData.state && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>State</b></div>
                  <div className="col-6">: {clientData.state}</div>
                </div>
              </div>
            )}
            {clientData.zipCode && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Zip Code</b></div>
                  <div className="col-6">: {clientData.zipCode}</div>
                </div>
              </div>
            )}
            {clientData.country && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Country</b></div>
                  <div className="col-6">: {clientData.country}</div>
                </div>
              </div>
            )}
            {clientData.additionalInformation && (
              <div className="col-md-6 col-12 my-2">
                <div className="row">
                  <div className="col-6"><b>Description</b></div>
                  <div className="col-6">: {clientData.additionalInformation}</div>
                </div>
              </div>
            )}
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6"><b>Role</b></div>
                <div className="col-6">: {clientData.appointmentRoleType || "--"}</div>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}

export default CalenderShow;
