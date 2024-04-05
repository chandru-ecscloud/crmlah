import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function BookAppointment() {
  const [showModal, setShowModal] = useState(false);

  const showAppointmentModal = () => {
    setShowModal(true);
  };

  const closeAppointmentModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bookAppointment">
      <Button variant="success" onClick={showAppointmentModal}>
        Book Appointment
      </Button>

      <Modal show={showModal} onHide={closeAppointmentModal} centered>
        <Modal.Header closeButton style={{backgroundColor: "#0077ff", color: "white"}}>
          <Modal.Title>Appointment Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-3">
                <label htmlFor="leadowner">Appointment For</label>&nbsp;&nbsp;
                <select
                  id="appointment_for"
                  className="form-size form-select"
                  name="appointment_for"
                >
                  <option value=""></option>
                  <option value="Suriya">Suriya</option>
                  <option value="Vignesh Devan">Vignesh Devan</option>
                  <option value="Chandru R">Chandru R</option>
                  <option value="Gayathri M">Gayathri M</option>
                  <option value="Poongodi K">Poongodi K</option>
                  <option value="Suriya G">Suriya G</option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="service_name">Service Name</label>&nbsp;&nbsp;
                <select
                  id="service_name"
                  className="form-size form-select"
                  name="service_name"
                >
                  <option value=""></option>
                  <option value="Service 1">Service 1</option>
                  <option value="Service 2">Service 2</option>
                  <option value="Service 3">Service 3</option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="appointment_start_date">
                  Appointment Start Date
                </label>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-size form-control"
                      name="appointment_start_date"
                      id="appointment_start_date"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="time"
                      className="form-size form-control"
                      name="appointment_start_time"
                      id="appointment_start_time"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="duration">Duration</label>&nbsp;&nbsp;
                <select
                  id="duration"
                  className="form-size form-select"
                  name="duration"
                >
                  <option value=""></option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="3 Hour">3 Hour</option>
                  <option value="5 Hour">5 Hour</option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <lable>Appointment Name</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="appointment_name"
                  id="appointment_name"
                />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="leadowner">Location</label>&nbsp;&nbsp;
                <select
                  id="location"
                  className="form-size form-select"
                  name="location"
                >
                  <option value=""></option>
                  <option value="Client Address">Client Address</option>
                  <option value="Billing Address">Billing Address</option>
                  <option value="Client Address & Billing Address">
                    Client Address & Billing Address
                  </option>
                </select>
              </div>
              <div className="col-12 mb-3">
                <lable>Address</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="address"
                  id="address"
                />
              </div>
              <div className="col-12 mb-3">
                <lable>Member</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="member"
                  id="member"
                />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="leadowner">Reminder</label>&nbsp;&nbsp;
                <div className="row">
                  <div className="col-6">
                    <select
                      id="minutes"
                      className="form-size form-select mb-3"
                      name="minutes"
                    >
                      <option value="15 minutes before">
                        15 minutes before
                      </option>
                      <option value="30 minutes before">
                        30 minutes before
                      </option>
                      <option value="45 minutes before">
                        45 minutes before
                      </option>
                      <option value="50 minutes before">
                        50 minutes before
                      </option>
                    </select>
                  </div>
                  <div className="col-6">
                    <select
                      id="time"
                      className="form-size form-select mb-3"
                      name="time"
                    >
                      <option value="At time of appointment">
                        At time of appointment
                      </option>
                      <option value="option 1">1 day before</option>
                      <option value="option 2">2 day before</option>
                      <option value="option 3">3 day before</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <select
                      id="hour"
                      className="form-size form-select"
                      name="hour"
                    >
                      <option value="1 hour before">1 hour before</option>
                      <option value="2 hour before">2 hour before</option>
                      <option value="3 hour before">3 hour before</option>
                      <option value="4 hour before">4 hour before</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <select
                      id="none"
                      className="form-size form-select"
                      name="none"
                    >
                      <option value="None">None</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAppointmentModal}>
            Cancel
          </Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookAppointment;
