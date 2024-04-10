import React, { useEffect, useState } from "react";
import { Tooltip, Zoom } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import axios from "axios";
import { toast } from "react-toastify";
function ChangeRoleEdit() {
  const { id } = useParams();
  console.log("ID:", id);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const [formData, setFormData] = useState({
    userName: "",
    companyId: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allUserRegistrations/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data);
        console.log("Api data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}updateUserRegister/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/changerole");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <>
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="container p-2 border-secondary bg-light rounded shadow-sm">
          <div className="row d-flex align-items-center justify-content-between my-3">
            <div className="col-6">
              <Tooltip TransitionComponent={Zoom} title="Back">
                <button
                  className="btn fs-5 border-secondary btn-light px-2"
                  onClick={() => navigate("/changeRole")}
                >
                  <IoArrowBack className="mx-1" />
                </button>
              </Tooltip>
            </div>
            <div className="col-6"></div>
          </div>
          <div className="row mt-5 p-3">
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6">
                  <p className="fw-medium">User Name</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="userName"
                    id="userName"
                    value={formData.userName || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Company ID</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="companyId"
                    id="companyId"
                    value={formData.companyId || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Email</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="email"
                    id="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Phone</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="phone"
                    id="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 mt-5">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Address</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="address"
                    id="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12 mt-5">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">State</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="state"
                    id="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">City</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="city"
                    id="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Country</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="country"
                    id="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Zip Code</p>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control p-1"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mb-2">
                <div className="col-6">
                  <lable>Role</lable> &nbsp;&nbsp;
                </div>

                <div className="col-6">
                  <select
                    name="role"
                    value={formData.role || ""}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option
                      value="CRM_ADMIN"
                      selected={formData.role === "CRM_ADMIN"}
                    >
                      Crmlah Admin
                    </option>
                    <option
                      value="CMP_OWNER"
                      selected={formData.role === "CMP_OWNER"}
                    >
                      Company Owner
                    </option>
                    <option
                      value="CMP_ADMIN"
                      selected={formData.role === "CMP_ADMIN"}
                    >
                      Company Admin
                    </option>
                    <option
                      value="CMP_USER"
                      selected={formData.role === "CMP_USER"}
                    >
                      Company User
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-end justify-content-end align-self-end my-2 h-100">
            <Link>
              <button className="btn btn-primary" onClick={handleFormSubmit}>
                Update
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChangeRoleEdit;
