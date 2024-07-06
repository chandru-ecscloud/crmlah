import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import AppointmentsEdit from "./AppointmentsEdit";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
function AppointmentsShow() {
  const { id } = useParams();
  const [clientData, setClientData] = useState({});

  const navigate = useNavigate();

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

  useEffect(() => {
    userData();
  }, [id]);

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
                    onClick={() => navigate("/appointments")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9 mt-1" id="buttons-container">
          {/* <BookAppointment /> */}
          <AppointmentsEdit id={id} name="Edit" getData={userData} />
        </div>
      </section>

      {/* Leads Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
      
        {/* center Content */}
        <div className=" container-fluid row justify-content-center ">
          <div
            className="container-fluid col-md-9 m-0"
            id="userDetails-container"
          >
            {/* Details */}
            <div className="container-fluid row" id="Details">
              <div className="border-bottom py-3">
                <span className="fs-6 fw-bold my-3">Details</span>
              </div>

              <div className="container-fluid col-12 mt-3">
                <div className="address-item">
                  <label className="text-dark Label">Appointment For</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.appointmentFor || "--"}
                  </span>
                </div>

                <div className="address-item">
                  <label className="text-dark Label">Appointment Mode</label>
                  <span className="text-dark">
                    &nbsp;&nbsp;&nbsp; : &nbsp;
                    {clientData.appointmentMode || "--"}
                  </span>
                </div>

                <div className="address-item">
                  <label className="text-dark Label">Appointment Status</label>
                  <span className="text-dark">
                    &nbsp;&nbsp;&nbsp; : &nbsp;
                    {clientData.appointmentstatus || "--"}
                  </span>
                </div>
              </div>

              <div className="container-fluid col-md-6"></div>
            </div>

            {/* Hide Details */}
            <div className="container-fluid row" id="Details">
              <div className="border-bottom py-3">
                <span className="fs-6 fw-bold my-3">Hide Details</span>
              </div>

              <div className="py-3">
                <span className="fs-6 fw-bold"> Appointment Information</span>
              </div>

              <div className="container-fluid col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Name</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.appointmentName || "--"}
                  </span>
                </div>

                <div className="address-item">
                  <label className="text-dark Label">Start Time</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.appointmentStartTime || "--"}
                  </span>
                </div>
              </div>

              <div className="container-fluid col-md-6">
                <div className="address-item">
                  <label className="text-dark Label">Start Date</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.appointmentStartDate || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Location</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.location || "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Created At</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;
                    {clientData.created_at
                      ? clientData.created_at.split("T")[0]
                      : "--"}
                  </span>
                </div>
                <div className="address-item">
                  <label className="text-dark Label">Updated At</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;
                    {clientData.updated_at
                      ? clientData.updated_at.split("T")[0]
                      : "--"}
                  </span>
                </div>
              </div>

              {/* Address Information */}
              <div className="container-fluid row" id="Details">
                <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                  <span className="my-3 fs-6 fw-bold col-10 my-3">
                    Address Information
                  </span>
                </div>

                <div className="my-3"></div>

                <div className="container col-md-6">
                  <div className="address-item">
                    <label className="text-dark Label">Street</label>
                    <span className="text-dark">
                      {clientData.street || "--"}
                    </span>
                  </div>
                  <div className="address-item">
                    <label className="text-dark Label">State&nbsp; &nbsp;: &nbsp;</label>
                    <span className="text-dark">
                      {clientData.state || "--"}
                    </span>
                  </div>
                  <div className="address-item">
                    <label className="text-dark Label">Country&nbsp; &nbsp;: &nbsp;</label>
                    <span className="text-dark">
                      {clientData.country || "--"}
                    </span>
                  </div>
                </div>

                <div className="container col-md-6">
                  <div className="address-item">
                    <label className="text-dark Label">City&nbsp; &nbsp;: &nbsp;</label>
                    <span className="text-dark">
                      {clientData.city || "--"}
                    </span>
                  </div>

                  <div className="address-item">
                    <label className="text-dark Label">Zip Code&nbsp; &nbsp;: &nbsp;</label>
                    <span className="text-dark">
                      {clientData.zipCode || "--"}
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

                <div className="address-item">
                  <label className="text-dark Label">Description</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.additionalInformation || "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes -- */}
          </div>
        </div>
      </section>
    </>
  );
}

export default AppointmentsShow;
