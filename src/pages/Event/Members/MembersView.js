import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../Config/URL";
import { toast } from "react-toastify";

function MembersView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`${API_URL}getAllEventMembersById/${id}`);
        setData(response.data);
      } catch (error) {
        toast.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);
  const handelEdit = () => {
    navigate(`/members/edit/${id}`);
  };

  return (
    <>
      {/* {/ header section /} */}
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
                    onClick={() => navigate("/members")}
                  >
                    <IoArrowBack className="back_arrow" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>

        <div className="col-9 mt-1" id="buttons-container">
          <Link to="/members">
            {" "}
            <button className={`btn btn-primary`}>Members</button>
          </Link>
          <button className={`btn btn-warning ms-3`} onClick={handelEdit}>
            Edit
          </button>
        </div>
      </section>
      <section
        className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center"
        style={{ minHeight: "75vh" }}
      >
        <div
          className="container-fluid col-md-10 m-0 "
          id="userDetails-container"
        >
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3"> Members View</span>
            </div>

            <div className="container-fluid row">
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark ">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{data.companyName}
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">First Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{data.firstName}
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Last Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{data.lastName}
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Status</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{data.eventMemberStatus}
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label"> Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{data.businessEmail}
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">&nbsp; : &nbsp;{data.phone}</span>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <label className="text-dark Label">Message</label>
                <span className="text-dark">&nbsp; : &nbsp;{data.message}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MembersView;
