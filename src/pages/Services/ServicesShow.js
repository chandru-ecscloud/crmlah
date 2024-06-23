import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { useNavigate } from "react-router-dom";
// import { BsThreeDots } from "react-icons/bs";
// import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
function ServicesShow() {
  const { id } = useParams();
  // const owner = sessionStorage.getItem("user_name");
  // const token = sessionStorage.getItem("token");
  const [clientData, setClientData] = useState({});
  const navigate = useNavigate();
  // const token = sessionStorage.getIte  m("token");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${API_URL}allServices/${id}`, {
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

  const handelEdit = () => {
    navigate(`/services/edit/${id}`);
  };

  // const renderQuotedItems = () => {
  //   return quotedItems.map((item, index) => (
  //     <tr key={index} style={{ borderTop: "1px solid #9494947c" }}>
  //       <td className="px-5 py-2">
  //         <span>
  //           {item.appointmentName || "--"} <br />
  //         </span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span className="text-primary">
  //           {item.appointmentFor || "--"} <br />
  //         </span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.serviceName || "--"}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.appointmentStartTime || "--"}</span>
  //       </td>
  //       <td className="px-5 py-2">
  //         <span>{item.location || "--"}</span>
  //       </td>
  //     </tr>
  //   ));
  // };

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
                    onClick={() => navigate("/services")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
                {/* <img
                  className="img-fluid"
                  style={{ width: "5rem" }}
                  src={USER}
                  alt="profile"
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
            onClick={handelEdit}
          >
            Edit
          </button>

          {/* <button className="btn bg-light bg-gradient mx-2  text-dark shadow-none">
            <BsThreeDots />
          </button> */}
        </div>
      </section>

      {/* Leads Information Section */}
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* left Side Content */}
        {/* <div className="container-fluid col-md-2 m-0" id="ulList-container">
          <h3 className="text-start ms-4 mt-3 fw-bold fw-bold">Related List</h3>
          <ul className="m-0 py-1">
            <li className="mt-2">
              <Link className="py-3">Notes</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Attachments</Link>
            </li>
            <li className="mt-4">
              <Link className="py-3">Appointments</Link>
            </li>
          </ul>
        </div> */}

        {/* Right Side Content */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/* Service Information */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Service Information</span>
            </div>

            <div className="container-fluid col-12">
              <div>
                <label className="text-dark Label pt-3">Service Owner</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.serviceOwner || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Service Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.serviceName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Duration</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.duration || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Location</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.location || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Created By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.created_by || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Modified By</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.modified_by || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="container-fluid row" id="Details">
            <div className="my-3 border-bottom container-fluid row d-flex justify-content-between align-items-center">
              <span className="my-3 fs-6 fw-bold col-10 my-3">
                Price Information
              </span>
            </div>

            <div className="container col-12">
              <div>
                <label className="text-dark Label">Price</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.price || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Tax</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{clientData.tax || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Description Information */}
          <div className="container-fluid row" id="Details">
            <div className="my-3 border-bottom container-fluid row">
              <span className="my-3 fs-6 fw-bold my-3">
                Description Information
              </span>
            </div>

            <div>
              <label className="text-dark Label">Description</label>
              <span className="text-dark">
                &nbsp; : &nbsp;{clientData.description || "--"}
              </span>
            </div>
          </div>

          {/* Notes */}
          {/* <div className="container-fluid row" id="Details">
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
          </div> */}

          {/* Appointments */}
          {/* <div className="container-fluid row my-3" id="Details">
            <div
              className="container-fluid col-12"
              style={{ overflowX: "scroll" }}
            >
              <div
                className="container col-12"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span
                  className="fs-6 fw-bold my-1"
                  style={{ position: "sticky", left: 0 }}
                >
                  Appointments
                </span>
              </div>
              <table
                className="Qoutes-table"
                style={{ borderRadius: "10px", border: "none" }}
              >
                <thead>
                  <tr style={{ borderTop: "1px solid #9494947c" }}>
                    <td className="p-2">Appointment Name</td>
                    <td className="p-2">Appointment For</td>
                    <td className="p-2">Service Name</td>
                    <td className="p-2">Appointment Start Time</td>
                    <td className="p-2">Location</td>
                  </tr>
                </thead>
              
              </table>
            </div>

            <div
              className="container-fluid col-12"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
                alignItems: "flex-end",
              }}
            ></div>
          </div> */}
        </div>
      </section>
    </>
  );
}

export default ServicesShow;
