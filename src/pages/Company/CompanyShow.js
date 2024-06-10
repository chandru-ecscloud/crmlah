import React, { useEffect, useState } from "react";
import "../../styles/Ragul.css";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import USER from "../../assets/user.png";
import { useParams } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../../Config/URL";

// import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import SendEmail from "../Email/SendEmail";
import { Tooltip, Zoom } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

function CompanyShow() {
  const { id } = useParams();
  // const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  // const [total, setTotal] = useState(0);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({});
  // console.log(userData);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}allUserRegistrations/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
        console.log("userData", userData);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, []);

  const handelEdit = () => {
    navigate(`/company/edit/${id}`);
  };

  return (
    <>
      {/* header section */}
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-sm-6 py-1">
          <div className="container">
            <div className="container-fluid row image-container">
              <div className="image-container">
                <Tooltip TransitionComponent={Zoom} title="Back">
                  <button
                    className="btn fs-4 border-white"
                    onClick={() => navigate("/company")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </Tooltip>
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
          <SendEmail />

          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
            onClick={handelEdit}
          >
            Edit
          </button>
        </div>
      </section>

      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
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
                <label className="text-dark Label">User Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.userName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.companyName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.email || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;{userData.phone || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Hide Details</span>
            </div>
            <div className="py-3">
              <span className="fs-6 fw-bold"> Company Information</span>
            </div>

            <div className="container-fluid col-md-12">
              <div>
                <label className="text-dark Label">User Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.userName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.companyName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.email || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;&nbsp;{userData.phone || "--"}
                </span>
              </div>
              <div className="container-fluid col-md-6"></div>
            </div>
            <div className="container-fluid col-sm-12">
              <div className="my-3 container-fluid row d-flex justify-content-between">
                <span className="my-3 fs-6 fw-bold col-10 my-3">
                  Address Information
                </span>
              </div>
              <div>
                <label className="text-dark Label">Address</label>
                <span className="text-dark">
                  &nbsp; : &nbsp; {userData.address || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">City</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.city || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">State</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.state || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Zip Code</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.zipCode || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.country || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CompanyShow;
