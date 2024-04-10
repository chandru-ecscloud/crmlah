import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import AppointmentsEdit from "./AppointmentsEdit";
import { toast } from "react-toastify";

function AppointmentsShow() {
  const { id } = useParams();
  const [clientData, setClientData] = useState({});
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${API_URL}allAppointments/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        setClientData(response.data);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  return (
    <>
      {/* header section */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-sm-6 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <img
                  className="img-fluid"
                  style={{ width: "5rem" }}
                  src={USER}
                  alt="profile"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 mt-1" id="buttons-container">
          {/* <BookAppointment /> */}

          <button className="btn bg-primary bg-gradient mx-2 text-white shadow-none">
            Send Email
          </button>

          <AppointmentsEdit />

          <button className="btn bg-light bg-gradient mx-2  text-dark shadow-none">
            <BsThreeDots />
          </button>
        </div>
      </section>

      {/* Leads Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* left Side Content */}
        <div className="container-fluid col-md-2 m-0" id="ulList-container">
          <h3 className="text-start ms-4 mt-3 fw-bold fw-bold">Related List</h3>
          <ul className="m-0 py-1">
            <li className="mt-2">
              <Link className="py-3">Notes</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Products</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Attachments</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Open Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Closed Activites</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Invited Meeting</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Emails</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Campaigns</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Social</Link>
            </li>

            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">
                Add Related List
              </Link>
            </li>
          </ul>
          <h3 className="text-start ms-4 mt-4 fw-bold">Links</h3>
          <ul className="m-0 py-1">
            <li className="mt-4">
              <Link className="ms-2 text-primary fw-bold">Add Links</Link>
            </li>
          </ul>
        </div>

        {/* Right Side Content */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Details</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Appointment For</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.appointment_for || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Service Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.service || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Duration</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.duration || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Lead Source</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.lead_source || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Company</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.company || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.country || "--"}
                </span>
              </div> */}
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
              <div>
                <label className="text-dark Label">Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.appointment_name || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Location</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.appointment_start_date || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Remainder</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.location || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Member</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.member || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Remainder</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.remainder || "--"}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Start Date</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.company || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Member</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.first_name || "--"}{" "}
                  {clientData.last_name}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.email || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Website</label>
                <span className="text-dark">--</span>
              </div>

              <div>
                <label className="text-dark Label">Lead Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.status || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Annual Revenue</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div>

              <div>
                <label className="text-dark Label">No of Employees</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div>

              <div>
                <label className="text-dark Label">Rating</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div>

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.created_by || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Skype Id</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.skype_id || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Twitter</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.twitter || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Secondary Email</label>
                <span className="text-dark">&nbsp; : &nbsp; --</span>
              </div> */}
            </div>

            {/* Address Information */}
            <div className="container-fluid row" id="Details">
              <div className="my-3 container-fluid row d-flex justify-content-between align-items-center">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
                <button className="btn bg-info col-2 text-white">
                  Locate Map
                </button>
              </div>

              <div className="my-3"></div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">Street</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.street || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">State</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.state || "--"}
                  </span>
                </div>
                <div>
                  <label className="text-dark Label">Country</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.country || "--"}
                  </span>
                </div>
              </div>

              <div className="container col-md-6">
                <div>
                  <label className="text-dark Label">City</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.city || "--"}
                  </span>
                </div>

                <div>
                  <label className="text-dark Label">Zip Code</label>
                  <span className="text-dark">
                    &nbsp; : &nbsp;{clientData.zipCode || "--"}
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
                  &nbsp; : &nbsp;{clientData.description_info || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="container-fluid row" id="Details">
            <div className="container my-3 col-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="my-3 fs-6 fw-bold my-3">Notes</span>
              </div>
              <div className="dropdown">
                <Link
                  className="btn border border-primary text-primary dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Recent Last
                </Link>
                <ul className="dropdown-menu">
                  <li className="mt-2"></li>
                </ul>
              </div>
            </div>

            <div className="container  col-12">
              <textarea
                className="form-control py-2 m-3 textarea"
                placeholder="'Add note...'"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AppointmentsShow;
