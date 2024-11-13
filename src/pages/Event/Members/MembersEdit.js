import React, { useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../../Config/URL";
import UseScrollToError from "../../UseScrollToError";

const validationSchema = yup.object().shape({
  companyName: yup.string().required("*Company Name is Required"),
  firstName: yup.string().required("*First Name is Required"),
  lastName: yup.string().required("*Last Name is Required"),
  eventMemberStatus: yup.string().required("*Status is Required"),
  businessEmail: yup
    .string()
    .email("Invalid email")
    .required("*Email is required"),
  phone: yup.string().required("*Phone is Required"),
});

function MembersEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("eventId");
  const formik = useFormik({
    initialValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      businessEmail: "",
      eventMemberStatus: "",
      phone: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Event Data:", data);
      const payload = {
        companyName: data.companyName,
        firstName: data.firstName,
        lastName: data.lastName,
        businessEmail: data.businessEmail,
        phone: data.phone,
        message: data.message,
        eventMemberStatus:data.eventMemberStatus
        // eventManagementId:1
      };
      try {
        const response = await axios.put(
          `${API_URL}updateEventMembers/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(`/members/${eventId}`);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`${API_URL}getAllEventMembersById/${id}`);
        formik.setValues(response.data);
      } catch (error) {
        toast.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);
  UseScrollToError(formik)

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Event Members</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={`/members/${eventId}`}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Update
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="container my-5">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyName && formik.errors.companyName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("companyName")}
                  name="companyName"
                  id="companyName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-danger">{formik.errors.companyName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>First Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.firstName && formik.errors.firstName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("firstName")}
                  name="firstName"
                  id="firstName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-danger">{formik.errors.firstName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Last Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.lastName && formik.errors.lastName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("lastName")}
                  name="lastName"
                  id="lastName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-danger">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Status</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select  ${
                    formik.touched.eventMemberStatus &&
                    formik.errors.eventMemberStatus
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("eventMemberStatus")}
                  name="eventMemberStatus"
                  id="eventMemberStatus"
                >
                  <option value=""></option>
                  <option value="NEW">New</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.eventMemberStatus &&
                    formik.errors.eventMemberStatus && (
                      <p className="text-danger">
                        {formik.errors.eventMemberStatus}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Bussiness Email</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="email"
                  className={`form-size form-control  ${
                    formik.touched.businessEmail && formik.errors.businessEmail
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("businessEmail")}
                  name="businessEmail"
                  id="businessEmail"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.businessEmail &&
                    formik.errors.businessEmail && (
                      <p className="text-danger">
                        {formik.errors.businessEmail}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Phone</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.phone && formik.errors.phone
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("phone")}
                  name="phone"
                  id="phone"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-danger">{formik.errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Message</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <textarea
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.message && formik.errors.message
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("message")}
                  name="message"
                  id="message"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.message && formik.errors.message && (
                    <p className="text-danger">{formik.errors.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default MembersEdit;
