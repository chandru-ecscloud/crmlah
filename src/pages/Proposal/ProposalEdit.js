import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  // email: yup
  //   .string()
  //   .email("*Enter valid email")
  //   .required("*Email is required"),
  proposalName: yup.string().required("*Proposal name is required"),
  proposalType: yup.string().required("*Proposal Type is required"),
  subject: yup.string().required("*Subject is required"),
  // description: yup.string().required("*Description is required"),
  // files: yup.string().required("*Attachment is required"),
});

function ProposalEdit() {
  const { id } = useParams();
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [userImage, setUserImage] = useState(User);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      proposalName: "",
      proposalType: "",
      subject: "",
      description: "",
      mailBody: "",
      files: "",
    },
    // validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Deals Datas:", data);
      const formData = new FormData();
      formData.append("companyId", companyId);
      formData.append("proposalName ", data.proposalName);
      formData.append("description ", data.description);
      formData.append("proposalType ", data.proposalType);
      formData.append("subject ", data.subject);
      formData.append("mailBody  ", data.mailBody);
      // formData.append("files ", data.files)
      data.files?.forEach((file) => {
        formData.append("files", file);
      });
      setLoadIndicator(true);
      try {
        const response = await axios.put(
          `${API_URL}updateCompanyProposalWithAttachments/${id}`,
          formData,
          {
            // headers: {
            //   "Content-Type": "application/json",
            // },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/user/proposal");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllCompanyProposalById/${id}`,
        {
          // headers: {
          //   "Content-Type": "application/json",
          // },
        }
      );

      if (response.status === 200) {
        formik.setValues(response.data);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Proposal</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/user/proposal"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <button className="btn btn-primary" type="submit">
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </button>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Proposal Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Proposal Name</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control ${
                    formik.touched.proposalName && formik.errors.proposalName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("proposalName")}
                  id="proposalName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.proposalName &&
                    formik.errors.proposalName && (
                      <p className="text-danger">
                        {formik.errors.proposalName}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Proposal Type</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select `}
                  {...formik.getFieldProps("proposalType")}
                  id="proposalType"
                >
                  <option value="Company Profile" selected>
                    Company Profile
                  </option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Subject</label>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control ${
                    formik.touched.subject && formik.errors.subject
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subject")}
                  id="subject"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.subject && formik.errors.subject && (
                    <p className="text-danger">{formik.errors.subject}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device attactUi">
                <label>Attachment</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <div className="input-group">
                  <input
                    className={`form-control custom-file-input ${
                      formik.touched.files && formik.errors.files
                        ? "is-invalid"
                        : ""
                    }`}
                    type="file"
                    multiple
                    accept="image/*, video/*, application/pdf"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "files",
                        Array.from(event.target.files)
                      )
                    }
                  />
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.files && formik.errors.files && (
                    <div className="text-danger">{formik.errors.files}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 mb-3 mt-2">
              <div className="d-flex align-items-start justify-content-end">
                <label>Mail Body</label>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("mailBody")}
                  name="mailBody"
                  id="mailBody"
                  style={{ minWidth: "81%" }}
                />
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
            <div className="col-12 mb-3 ">
              <div className="d-flex align-items-start justify-content-center sm-device">
                <label>Description</label> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description")}
                  name="description"
                  id="description"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ProposalEdit;
