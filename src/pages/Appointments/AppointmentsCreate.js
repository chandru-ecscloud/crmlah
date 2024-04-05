import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function AppointmentsCreate() {
  const [lgShow, setLgShow] = useState(false);
  const role = sessionStorage.getItem("role");
  const [formData, setFormData] = useState({
    appointment_for: "",
    service: "",
    duration: "",
    appointment_name: "",
    appointment_start_date: "",
    location: "",
    address: "",
    member: "",
    remainder: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}newAppointment`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        toast.success("Appointment Created Successfully.");
        navigate("/appointment");
      } else {
        toast.error("Appointment Created Unsuccessful.");
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <>
      <Button
        className={`btn btn-primary ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER"}
        onClick={() => setLgShow(true)}
      >
        Create Appointment
      </Button>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Create Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <section className="createLead">
            <div className="container-fluid">
              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-end justify-content-end">
                  <span>
                    <button
                      className="btn btn-danger"
                      onClick={() => setLgShow(false)}
                    >
                      Cancel
                    </button>
                  </span>
                  &nbsp;
                  <span>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div className="container-fluid my-5">
              <h4>
                <b>Appointment Information</b>
              </h4>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <label htmlFor="appointment_for">Appointment For</label>
                  &nbsp;&nbsp;
                  <select
                    id="appointment_for"
                    className="form-size form-select"
                    name="appointment_for"
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="Suriya">Suriya</option>
                    <option value="Vignesh Devan">Vignesh Devan</option>
                    <option value="Chandru R">Chandru R</option>
                    <option value="Gayathri M">Gayathri M</option>
                    <option value="Poongodi K">Poongodi K</option>
                    <option value="Suriya G">Suriya G</option>
                    <option value="Leela Prasanna D">Leela Prasanna D</option>
                    <option value="Saravanan M">Saravanan M</option>
                    <option value="Nagaraj VR">Nagaraj VR</option>
                    <option value="Yalini A">Yalini A</option>
                    <option value="Vishnu Priya">Vishnu Priya</option>
                    <option value="Kavitha">Kavitha</option>
                  </select>
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Service Name</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="service_name"
                    id="service_name"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Start Date</lable> &nbsp;&nbsp;
                  <input
                    type="date"
                    className="form-size form-control"
                    name="appointment_start_date"
                    id="appointment_start_date"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Start Time</lable> &nbsp;&nbsp;
                  <input
                    type="time"
                    className="form-size form-control"
                    name="appointment_start_time"
                    id="appointment_start_time"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <label htmlFor="duration">Duration</label>&nbsp;&nbsp;
                  <select
                    id="duration"
                    className="form-size form-select"
                    name="duration"
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="3 Hour">3 Hour</option>
                    <option value="5 Hour">5 Hour</option>
                  </select>
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Name</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="appointment_name"
                    id="appointment_name"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
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
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Member</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="member"
                    id="member"
                  />
                </div>
              </div>
            </div>
            <div className="container-fluid my-5">
              <h4>
                <b>Reminder</b>
              </h4>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <label htmlFor="minutes">Minutes</label>&nbsp;&nbsp;
                  <select
                    id="minutes"
                    className="form-size form-select"
                    name="minutes"
                  >
                    <option value="15 minutes before">15 minutes before</option>
                    <option value="30 minutes before">30 minutes before</option>
                    <option value="45 minutes before">45 minutes before</option>
                    <option value="50 minutes before">50 minutes before</option>
                  </select>
                </div>

                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <label htmlFor="days">Days</label>&nbsp;&nbsp;
                  <select
                    id="time"
                    className="form-size form-select"
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

                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <label htmlFor="hours">Hours</label>&nbsp;&nbsp;
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

                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <label htmlFor="none">Not Neccessary</label>&nbsp;&nbsp;
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

            <div className="container-fluid my-5">
              <h4>
                <b>Address Information</b>
              </h4>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Street</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="street"
                    id="street"
                    value={formData.street || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>City</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="city"
                    id="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>State</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="state"
                    id="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Zip Code</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
                  <lable>Country</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className="form-size form-control"
                    name="country"
                    id="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="container-fluid my-5">
              <h4>
                <b>Description Information</b>
              </h4>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-8 d-flex align-items-center justify-content-end mb-3">
                  <lable>Description</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    style={{ width: "70%" }}
                    className="form-control"
                    name="description_info"
                    value={formData.description_info || ""}
                    id="description_info"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AppointmentsCreate;
