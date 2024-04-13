import React, { useEffect, useState } from "react";
import { Tooltip, Zoom, responsiveFontSizes } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../Config/URL";

function UserShow() {

  const navigate = useNavigate();

  return (
    <>
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="container p-2 border-secondary bg-light rounded shadow-sm">
          <div className="d-flex align-items-center justify-content-between my-3">
            <div>
              <Tooltip TransitionComponent={Zoom} title="Back">
                <button
                  className="btn fs-5 border-secondary btn-light px-2"
                  onClick={() => navigate("/users")}
                >
                  <IoArrowBack className="mx-1" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip TransitionComponent={Zoom} title="Edit">
                <button
                  className="btn fs-5 border-warning btn-warning px-2"
                  onClick={() => navigate(`/users/edit`)}
                >
                  <FaEdit className="mx-1" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="row mt-5 p-3">
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">User Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: HARISHRAGAVENDHAR B</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Company Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: ecs</b>

                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: harishragav110@gmail.com</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Role</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: Admin</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Password</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: Harish@123</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Confirm Password</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: Harish@123</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Phone</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: +91 6385921329</b>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12 "> </div>
          </div>
          <div className="row mt-3 p-3">
            <div className="col-md-6 col-12 ">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Address</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: 1/234, north street, pinnathur</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">City</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: Thiruvarur</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">State</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: Tamil Nadu</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Zip Code</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: 614706</b>

                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Country</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    <b className="mx-2">: india</b>

                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default UserShow;
