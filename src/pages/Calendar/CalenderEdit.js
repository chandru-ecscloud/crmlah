import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";

const validationSchema = Yup.object().shape({
  // leadId: Yup.string().required("*Appointment for is required"),
  // serviceId: Yup.string().required("*Service is required"),
  // duration: Yup.string().required("*Duration is required"),
  appointmentName: Yup.string().required("*Name is required"),
  // appointmentStartDate: Yup.date().required("*Start date is required"),
  // timeSlotId: Yup.string().required("*Start Time is required"),
  phoneNumber: Yup.string()
    .required("*Phone Number is required")
    .matches(/^[0-9]{8,10}$/, "*Phone Number must be 8 to 10 digits"),
  // location: Yup.string().required("*Location is required"),
  // // member: Yup.string().required("*Member is required"),
  // street: Yup.string().required("*Street is required"),
  // city: Yup.string().required("*City is required"),
  // state: Yup.string().required("*State is required"),
  // zipCode: Yup.string()
  //   .matches(/^\d+$/, "Must be only digits")
  //   .required("*Zip code is required"),
  // country: Yup.string().required("*Country is required"),
  // additionalInformation: Yup.string().required("*Description is required"),
  // appointmentMode: Yup.string().required("*Appointment Mode is required"),
});

function CalenderEdit({ id, setShowViewModal,getData }) {
  const companyId = sessionStorage.getItem("companyId");
  const [showEditModal, setShowEditModal] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [leadData, setleadData] = useState([]);
  // const formattedTimeRange = data.appointmentStartTime
  //   ? data.appointmentStartTime
  //       .split(" - ")
  //       .map((time) =>
  //         new Date(`2024-05-20T${time}:00`).toLocaleString("en-US", {
  //           hour: "numeric",
  //           minute: "numeric",
  //           hour12: true,
  //         })
  //       )
  //       .join(" - ")
  //   : "";

  // console.log("Formatted time range:", formattedTimeRange);
  // const role = sessionStorage.getItem("role");
  const formik = useFormik({
    initialValues: {
      companyId: companyId,
      leadId: "",
      // serviceId: "",
      appointmentStartDate: "",
      timeSlotId: "",
      duration: "",
      appointmentName: "",
      phoneNumber: "",
      location: "",
      member: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      additionalInformation: "",
      appointmentMode: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (data) => {
      console.log("calenderData", data);

      // data.appointmentStartTime = formattedTimeRange;
      const payload = {
        companyId: data.companyId,
        leadId: data.leadId,
        // serviceId: data.serviceId,
        appointmentName: data.appointmentName,
        duration: data.duration,
        phoneNumber: data.phoneNumber,
        location: data.location,
        member: data.member,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        additionalInformation: data.additionalInformation,
        appointmentMode: data.appointmentMode,
      };

      try {
        const response = await axios.put(
          `${API_URL}updateAppointment/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          getData()
          toast.success(response.data.message);
          handleClose();
          formik.resetForm();
        } else {
          toast.error("Appointment Created Unsuccessful.");
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.warning(error.response?.data.message);
        } else {
          toast.error(error.response?.data.message);
        }
      }
    },
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}allAppointments/${id}`);
      formik.setValues({ ...response.data });
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  const fetchLeadData = async () => {
    try {
      const response = await axios(
        `${API_URL}getLeadBasicDetails/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setleadData(response.data);
      console.log("userid", leadData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchServiceData = async () => {
    try {
      const response = await axios(`${API_URL}getAllIdAndServiceName`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setServiceData(response.data);
      // console.log("idAndName", ServiceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchServiceData();
    fetchLeadData();
  }, []);

  const handleClose = () => {
    setShowEditModal(false);
    setShowViewModal(false);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
    // setShowViewModal(false);
  };

  return (
    <>
      <button className="btn" type="button" onClick={handleEditClick}>
        <MdEdit size={20} style={{ color: "white" }} />
      </button>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="xl"
      >
        <Modal.Header className="Calenderview" closeVariant="white" closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="createLead">
            <form onSubmit={formik.handleSubmit}>
              <div className="container-fluid">
                <div className="row mt-3">
                  <div className="col-12 d-flex justify-content-end justify-content-end">
                    <span>
                      <button
                        className="btn btn-danger"
                        onClick={handleClose}
                        type="button"
                      >
                        Cancel
                      </button>
                    </span>
                    &nbsp;
                    <span>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={formik.handleSubmit}
                      >
                        Update
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
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Appointment</lable>{" "}
                      <span className=" text-danger">*</span>
                      <select
                        name="leadId"
                        className={`form-select form-size ${
                          formik.touched.leadId && formik.errors.leadId
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("leadId")}
                      >
                        <option value=" "></option>
                        {leadData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.leadId && formik.errors.leadId && (
                          <p className="text-danger ">{formik.errors.leadId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Service Name</lable> &nbsp;&nbsp;
                      <select
                        type="text"
                        name="serviceId"
                        id="serviceId"
                        {...formik.getFieldProps("serviceId")}
                        className={`form-size form-select ${
                          formik.touched.serviceId && formik.errors.serviceId
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        {serviceData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.serviceName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.serviceId &&
                          formik.errors.serviceId && (
                            <p className="text-danger ">
                              {formik.errors.serviceId}
                            </p>
                          )}
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                        <div className="d-flex align-items-center justify-content-end sm-device">
                          <lable>Start Date</lable> &nbsp;&nbsp;
                          <input
                            type="date"
                            // className="form-size form-control"
                            name="appointmentStartDate"
                            id="appointmentStartDate"
                            {...formik.getFieldProps("appointmentStartDate")}
                            className={`form-size form-control   ${formik.touched.appointmentStartDate &&
                                formik.errors.appointmentStartDate
                                ? "is-invalid"
                                : ""
                              }`}
                          />
                        </div>
                        <div className="row sm-device">
                          <div className="col-5"></div>
                          <div className="col-6 sm-device">
                            {formik.touched.appointmentStartDate &&
                              formik.errors.appointmentStartDate && (
                                <p className="text-danger ">
                                  {formik.errors.appointmentStartDate}
                                </p>
                              )}
                          </div>
                        </div>
    
                      </div>
    
                      <div className="col-lg-6 col-md-6 col-12  mb-3">
                        <div className="d-flex align-items-center justify-content-end sm-device">
                          <lable>Start Time</lable> &nbsp;&nbsp;
                          <select
                            type="text"
                            name="timeSlotId"
                            className="form-select form-size"
                            {...formik.getFieldProps("timeSlotId")}
                            id="timeSlotId"
                          >
                            <option value="">Select a start time</option>
                            {appointmentTime.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                disabled={option.allocated}
                              >
                                {option.slotTime} {option.allocated ? "" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="row sm-device">
                          <div className="col-5"></div>
                          <div className="col-6 sm-device">
                            {formik.touched.appointmentStartTime &&
                              formik.errors.appointmentStartTime && (
                                <p className="text-danger ">
                                  {formik.errors.appointmentStartTime}
                                </p>
                              )}
                          </div>
                        </div>
    
                      </div> */}
                  {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="duration">Duration</label>&nbsp;&nbsp;
                      <select
                        id="duration"
                        //className="form-size form-select"
                        name="duration"
                        {...formik.getFieldProps("duration")}
                        className={`form-size form-select   ${
                          formik.touched.duration && formik.errors.duration
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="1 Hour">1 Hour</option>
                        <option value="3 Hour">3 Hour</option>
                        <option value="5 Hour">5 Hour</option>
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.duration && formik.errors.duration && (
                          <p className="text-danger ">
                            {formik.errors.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </div> */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Appointment Name</lable>
                      <span className=" text-danger">*</span>
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="appointmentName"
                        id="appointmentName"
                        {...formik.getFieldProps("appointmentName")}
                        className={`form-size form-control   ${
                          formik.touched.appointmentName &&
                          formik.errors.appointmentName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentName &&
                          formik.errors.appointmentName && (
                            <p className="text-danger ">
                              {formik.errors.appointmentName}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Pnone Number</lable>{" "}
                      <span className=" text-danger">*</span>
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="phoneNumber"
                        id="phoneNumber"
                        {...formik.getFieldProps("phoneNumber")}
                        className={`form-size form-control   ${
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.phoneNumber &&
                          formik.errors.phoneNumber && (
                            <p className="text-danger">
                              {formik.errors.phoneNumber}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Location</label>&nbsp;&nbsp;
                      <select
                        id="location"
                        //className="form-size form-select"
                        name="location"
                        {...formik.getFieldProps("location")}
                        className={`form-size form-select   ${
                          formik.touched.location && formik.errors.location
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="Client Address">Client Address</option>
                        <option value="Billing Address">Billing Address</option>
                        <option value="Client Address & Billing Address">
                          Client Address & Billing Address
                        </option>
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.location && formik.errors.location && (
                          <p className="text-danger ">
                            {formik.errors.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Member</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="member"
                        id="member"
                        {...formik.getFieldProps("member")}
                        className={`form-size form-control   ${
                          formik.touched.member && formik.errors.member
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.member && formik.errors.member && (
                          <p className="text-danger ">{formik.errors.member}</p>
                        )}
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="leadowner">Appointment Mode</label>
                      <span className=" text-danger">*</span>
                      <select
                        id="appointmentMode"
                        //className="form-size form-select"
                        name="appointmentMode"
                        {...formik.getFieldProps("appointmentMode")}
                        className={`form-size form-select   ${
                          formik.touched.appointmentMode &&
                          formik.errors.appointmentMode
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="ONLINE">ONLINE</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.appointmentMode &&
                          formik.errors.appointmentMode && (
                            <p className="text-danger">
                              {formik.errors.appointmentMode}
                            </p>
                          )}
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="container-fluid my-5">
                <h4>
                  <b>Address Information</b>
                </h4>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Street</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="street"
                        id="street"
                        // value={formData.street || ""}
                        {...formik.getFieldProps("street")}
                        className={`form-size form-control   ${
                          formik.touched.street && formik.errors.street
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.street && formik.errors.street && (
                          <p className="text-danger ">{formik.errors.street}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>City</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="city"
                        id="city"
                        //value={formData.city || ""}
                        {...formik.getFieldProps("city")}
                        className={`form-size form-control   ${
                          formik.touched.city && formik.errors.city
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.city && formik.errors.city && (
                          <p className="text-danger ">{formik.errors.city}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>State</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="state"
                        id="state"
                        // value={formData.state || ""}
                        {...formik.getFieldProps("state")}
                        className={`form-size form-control   ${
                          formik.touched.state && formik.errors.state
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.state && formik.errors.state && (
                          <p className="text-danger ">{formik.errors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Zip Code</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        //className="form-size form-control"
                        name="zipCode"
                        id="zipCode"
                        // value={formData.zipCode || ""}
                        {...formik.getFieldProps("zipCode")}
                        className={`form-size form-control   ${
                          formik.touched.zipCode && formik.errors.zipCode
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.zipCode && formik.errors.zipCode && (
                          <p className="text-danger ">
                            {formik.errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Country</lable> &nbsp;&nbsp;
                      <input
                        type="text"
                        // className="form-size form-control"
                        name="country"
                        id="country"
                        // value={formData.country || ""}
                        {...formik.getFieldProps("country")}
                        className={`form-size form-control   ${
                          formik.touched.country && formik.errors.country
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.country && formik.errors.country && (
                          <p className="text-danger ">
                            {formik.errors.country}
                          </p>
                        )}
                      </div>
                    </div>
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
                  <div className="col-8 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Description</lable> &nbsp;&nbsp;
                      <textarea
                        type="text"
                        rows={5}
                        style={{ width: "70%" }}
                        // className="form-control"
                        name="additionalInformation"
                        //value={formData.additionalInformation || ""}
                        id="additionalInformation"
                        {...formik.getFieldProps("additionalInformation")}
                        className={`form-control  ${
                          formik.touched.additionalInformation &&
                          formik.errors.additionalInformation
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="row sm-device">
                      <div className="col-5"></div>
                      <div className="col-6 sm-device">
                        {formik.touched.additionalInformation &&
                          formik.errors.additionalInformation && (
                            <p className="text-danger ">
                              {formik.errors.additionalInformation}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CalenderEdit;
