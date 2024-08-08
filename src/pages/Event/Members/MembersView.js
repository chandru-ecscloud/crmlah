import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function MembersView() {
  const navigate = useNavigate();

  const handelEdit = () => {
    navigate(`/members/edit`);
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
      </section>
    </>
  );
}

export default MembersView;
