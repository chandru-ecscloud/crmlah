import React, { useEffect, useState } from "react";
import { Tooltip, Zoom, responsiveFontSizes } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../Config/URL";
function ChangeRoleShow() {
  const { id } = useParams();
  console.log("id:",id);
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const [changeRoleData, setChangeRoleData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${API_URL}allUserRegistrations/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("Lead Show :",response.data);
        setChangeRoleData(response.data);
        console.log("Adpi Data:",response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  return (
    <>
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="container p-2 border-secondary bg-light rounded shadow-sm">
            <div className="d-flex align-items-center justify-content-between my-3">
              <div>
                <Tooltip TransitionComponent={Zoom} title="Back">
                  <button
                    className="btn fs-5 border-secondary btn-light px-2"
                    onClick={() => navigate("/changeRole")}
                  >
                    <IoArrowBack className="mx-1"/>
                  </button>
                </Tooltip>
              </div>
              <div>
              <Tooltip TransitionComponent={Zoom} title="Edit">
                <button
                  className="btn fs-5 border-warning btn-warning px-2"
                  onClick={() => navigate(`/changerole/edit/${id}`)}
                >
                  <FaEdit className="mx-1"/>
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
                      <b className="mx-2">:</b>{changeRoleData.userName || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row  mb-2">
                  <div className="col-6  ">
                    <p className="fw-medium">Company ID</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      <b className="mx-2">:</b>{changeRoleData.companyId || "--"}
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
                      <b className="mx-2">:</b>{changeRoleData.email || "--"}
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
                      <b className="mx-2">:</b>{changeRoleData.phone || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mt-4">
                <div className="row  mb-2">
                  <div className="col-6  ">
                    <p className="fw-medium">Address</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      <b className="mx-2">:</b>{changeRoleData.address || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row  mb-2">
                  <div className="col-6  ">
                    <p className="fw-medium"></p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
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
                      <b className="mx-2">:</b>{changeRoleData.state || "--"}
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
                      <b className="mx-2">:</b>{changeRoleData.city || "--"}
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
                      <b className="mx-2">:</b>{changeRoleData.country || "--"}
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
                      <b className="mx-2">:</b>{changeRoleData.zipCode || "--"}
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
                      <b className="mx-2">:</b>{changeRoleData.role || "--"}
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

export default ChangeRoleShow;
