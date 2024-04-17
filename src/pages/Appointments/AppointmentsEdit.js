import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  leadId: Yup.string().required("*Appointment for is required"),
  serviceId: Yup.string().required("*Service is required"),
  duration: Yup.string().required("*Duration is required"),
  appointmentName: Yup.string().required("*Appointment name is required"),
  appointmentStartDate: Yup.string().required(
    "*Appointment start date is required"
  ),
  appointmentStartTime: Yup.string().required(
    "*Appointment start Time is required"
  ),
  location: Yup.string().required("*Location is required"),
  member: Yup.string().required("*Member is required"),
  // minutes: Yup.string().required("*Minutes is required"),
  // time: Yup.string().required("*Time is required"),
  // hour: Yup.string().required("*Hour is required"),
  // none: Yup.string().required("*None is required"),
  street: Yup.string().required("*Street is required"),
  city: Yup.string().required("*City is required"),
  state: Yup.string().required("*State is required"),
  zipCode: Yup.string().required("*Zip code is required"),
  country: Yup.string().required("*Country is required"),
  additionalInformation: Yup.string().required("*Description is required"),
});

function AppointmentsCreate({name,id}) {
  const [lgShow, setLgShow] = useState(false);
  const [ServiceData, setServiceData] = useState([]);
  const [leadData, setleadData] = useState([]);
  const [apidata, setApiData] = useState([]);
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const userName=sessionStorage.getItem("user_name")
  const navigate = useNavigate();
 
  const formik = useFormik({
    initialValues: {
      companyId: companyId,
      leadId: "",
      serviceId: "",
      // email: "",
      // appointmentFor: "",
      // serviceName: "",
      appointmentStartDate: "",
      appointmentStartTime: "",
      duration: "",
      appointmentName: "",
      location: "",
      member: "",
      // minutes: "",
      // time: "",
      // hour: "",
      // none: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      additionalInformation: "",
    },
    validationSchema: validationSchema,
   
    onSubmit: async (data) => {
      const lead = leadData.find((user) => user.id == data.leadId);
      const service = ServiceData.find((user) => user.id == data.serviceId);
      
      data.appointmentFor = lead.name;
      data.email = lead.email;
      data.serviceName = service.serviceName;
      data.appointmentOwner=userName;
      data.reminder=2
      console.log(data)

      try {
        const response = await axios.put(`${API_URL}updateAppointment/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200 ) {
          toast.success(response.data.message);
          setLgShow(false)
        } else {
          toast.error("Appointment Created Unsuccessful.");
        }
      } catch (error) {
        if(error.response?.status === 400){
          toast.warning(error.response?.data.message);
        }else{
          toast.error(error.response?.data.message);
        }
        
      }
    },
  });
  // console.log("apidata.country",apidata.country)

  const findDataById = async () => {
    try {
      const response = await axios(`${API_URL}allAppointments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      formik.setValues(response.data);
      // console.log("response.data", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
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
      console.error("Error fetching data:",error);
    } finally {
      // setLoading(false);
    }
  };


  const fetchLeadData = async () => {
    try {
      const response = await axios(`${API_URL}getLeadBasicDetails/${companyId}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data)
      setleadData(response.data);
      console.log("userid", leadData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
    fetchLeadData();
    findDataById();
  }, []);

  return (
    <>
      <Button
        className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER"}
        onClick={() => setLgShow(true)}
      >
        {name}
      </Button>
      <Modal
        size="xl"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {name}
          </Modal.Title>
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
                        onClick={() => setLgShow(false)}
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
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Appointment </lable> &nbsp;&nbsp;
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
                    {formik.touched.leadId && formik.errors.leadId && (
                      <p className="text-danger text-end">
                        {formik.errors.leadId}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
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
                        {ServiceData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.serviceName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formik.touched.serviceId && formik.errors.serviceId && (
                      <p className="text-danger text-end">
                        {formik.errors.serviceId}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Date</lable> &nbsp;&nbsp;
                      <input
                        type="date"
                        // className="form-size form-control"
                        name="appointmentStartDate"
                        id="appointmentStartDate"
                        {...formik.getFieldProps("appointmentStartDate")}
                        className={`form-size form-control   ${
                          formik.touched.appointmentStartDate &&
                          formik.errors.appointmentStartDate
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    {formik.touched.appointmentStartDate &&
                      formik.errors.appointmentStartDate && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentStartDate}
                        </p>
                      )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12  mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Start Time</lable> &nbsp;&nbsp;
                      <input
                        type="time"
                        //className="form-size form-control"
                        name="appointmentStartTime"
                        id="appointmentStartTime"
                        {...formik.getFieldProps("appointmentStartTime")}
                        className={`form-size form-control   ${
                          formik.touched.appointmentStartTime &&
                          formik.errors.appointmentStartTime
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </div>
                    {formik.touched.appointmentStartTime &&
                      formik.errors.appointmentStartTime && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentStartTime}
                        </p>
                      )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12  mb-3">
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
                    {formik.touched.duration && formik.errors.duration && (
                      <p className="text-danger text-end">
                        {formik.errors.duration}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <lable>Name</lable> &nbsp;&nbsp;
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
                    {formik.touched.appointmentName &&
                      formik.errors.appointmentName && (
                        <p className="text-danger text-end">
                          {formik.errors.appointmentName}
                        </p>
                      )}
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
                    {formik.touched.location && formik.errors.location && (
                      <p className="text-danger text-end">
                        {formik.errors.location}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
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
                    {formik.touched.member && formik.errors.member && (
                      <p className="text-danger text-end">
                        {formik.errors.member}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="container-fluid my-5">
                <h4>
                  <b>Reminder</b>
                </h4>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="minutes">Minutes</label>&nbsp;&nbsp;
                      <select
                        id="minutes"
                        //className="form-size form-select"
                        name="minutes"
                        {...formik.getFieldProps("minutes")}
                        className={`form-size form-select   ${
                          formik.touched.minutes && formik.errors.minutes
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="15 minutes before">
                          15 minutes before
                        </option>
                        <option value="30 minutes before">
                          30 minutes before
                        </option>
                        <option value="45 minutes before">
                          45 minutes before
                        </option>
                        <option value="50 minutes before">
                          50 minutes before
                        </option>
                      </select>
                    </div>
                    {formik.touched.minutes && formik.errors.minutes && (
                      <p className="text-danger text-end">
                        {formik.errors.minutes}
                      </p>
                    )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="days">Days</label>&nbsp;&nbsp;
                      <select
                        id="time"
                        //className="form-size form-select"
                        name="time"
                        {...formik.getFieldProps("time")}
                        className={`form-size form-select   ${
                          formik.touched.time && formik.errors.time
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="At time of appointment">
                          At time of appointment
                        </option>
                        <option value="option 1">1 day before</option>
                        <option value="option 2">2 day before</option>
                        <option value="option 3">3 day before</option>
                      </select>
                    </div>
                    {formik.touched.time && formik.errors.time && (
                      <p className="text-danger text-end">
                        {formik.errors.time}
                      </p>
                    )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="hours">Hours</label>&nbsp;&nbsp;
                      <select
                        id="hour"
                        //className="form-size form-select"
                        name="hour"
                        {...formik.getFieldProps("hour")}
                        className={`form-size form-select   ${
                          formik.touched.hour && formik.errors.hour
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value=""></option>
                        <option value="1 hour before">1 hour before</option>
                        <option value="2 hour before">2 hour before</option>
                        <option value="3 hour before">3 hour before</option>
                        <option value="4 hour before">4 hour before</option>
                      </select>
                    </div>
                    {formik.touched.hour && formik.errors.hour && (
                      <p className="text-danger text-end">
                        {formik.errors.hour}
                      </p>
                    )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-end sm-device">
                      <label htmlFor="none">Not Neccessary</label>&nbsp;&nbsp;
                      <select
                        id="none"
                        // className="form-size form-select"
                        name="none"
                        {...formik.getFieldProps("none")}
                        className={`form-size form-select   ${
                          formik.touched.none && formik.errors.none
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option></option>
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </select>
                    </div>
                    {formik.touched.none && formik.errors.none && (
                      <p className="text-danger text-end">
                        {formik.errors.none}
                      </p>
                    )}
                  </div>
                </div>
              </div> */}

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
                    {formik.touched.street && formik.errors.street && (
                      <p className="text-danger text-end">
                        {formik.errors.street}
                      </p>
                    )}
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
                    {formik.touched.city && formik.errors.city && (
                      <p className="text-danger text-end">
                        {formik.errors.city}
                      </p>
                    )}
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
                    {formik.touched.state && formik.errors.state && (
                      <p className="text-danger text-end">
                        {formik.errors.state}
                      </p>
                    )}
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
                    {formik.touched.zipCode && formik.errors.zipCode && (
                      <p className="text-danger text-end">
                        {formik.errors.zipCode}
                      </p>
                    )}
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
                    {formik.touched.country && formik.errors.country && (
                      <p className="text-danger text-end">
                        {formik.errors.country}
                      </p>
                    )}
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
                      <input
                        type="text"
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
                    {formik.touched.additionalInformation &&
                      formik.errors.additionalInformation && (
                        <p className="text-danger text-end">
                          {formik.errors.additionalInformation}
                        </p>
                      )}
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

export default AppointmentsCreate;
