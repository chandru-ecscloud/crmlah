import React, { useState } from "react";
// import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
// import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";
import UseScrollToError from "../UseScrollToError";

function ProposalCreate() {
  // const owner = sessionStorage.getItem("user_name");
  // const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  // const [accountOption, setAccountOption] = useState([]);
  // const [dealOption, setDealOption] = useState([]);
  // const [contactOption, setContactOption] = useState([]);
  // const token = sessionStorage.getItem("token");
  // const [userImage, setUserImage] = useState(User);
  // const [sameAsShipping, setSameAsShipping] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [fileError, setFileError] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const validationSchema = yup.object().shape({
    proposal_name: yup.string().required("*Proposal name is required"),
    proposalType: yup.string().required("*Proposal Type is required"),
    subject: yup.string().required("*Subject is required"),
    // description: yup.string().required("*Description is required"),
    mailBody: yup.string().required("*Mail Body is required"),
    files: yup
      .mixed()
      .test("fileSize", "*File size is too large, maximum 20 MB", (files) => {
        if (!files) return true;
        let isValid = true;
        files.forEach((file) => {
          if (file.size > MAX_FILE_SIZE) {
            isValid = false;
          }
        });
        return isValid;
      }),
  });

  const formik = useFormik({
    initialValues: {
      proposal_name: "",
      proposalType: "",
      subject: "",
      description: "",
      mailBody: "",
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log("Deals Datas:", data);

      const formData = new FormData();
      formData.append("companyId", companyId);
      formData.append("proposalName ", data.proposal_name);
      formData.append("description ", data.description);
      formData.append("proposalType ", data.proposalType);
      formData.append("subject ", data.subject);
      formData.append("mailBody  ", data.mailBody);
      // formData.append("files ", data.files)
      data.files.forEach((file) => {
        formData.append("files", file);
      });
      setLoadIndicator(true);
      try {
        const response = await axios.post(
          `${API_URL}createCompanyProposalWithAttachments`,
          formData,
          {
            // headers: {
            //   "Content-Type": "application/json",
            // },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          formik.resetForm();
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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    setFileSize(totalSize);

    const fileSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

    if (totalSize > MAX_FILE_SIZE) {
      // setFileError("File size is 25 MB; the maximum file size that can be uploaded is 20 MB.");
      setFileError(`File is ${fileSizeInMB} MB; max allowed is 20 MB.`);
      setIsSaveDisabled(true);
      formik.setFieldValue("files", []);
    } else {
      setFileSize(totalSize);
      setFileError("");
      setIsSaveDisabled(false);
      formik.setFieldValue("files", files);
    }
  };
  UseScrollToError(formik)

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Proposal</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/user/proposal"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSaveDisabled}
                >
                  {loadIndicator && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                  )}
                  Save
                </button>
              </span>
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
                    formik.touched.proposal_name && formik.errors.proposal_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("proposal_name")}
                  id="proposal_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.proposal_name &&
                    formik.errors.proposal_name && (
                      <p className="text-danger">
                        {formik.errors.proposal_name}
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
                  <option value=""></option>
                  <option value="Company Profile">Company Profile</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.proposalType &&
                    formik.errors.proposalType && (
                      <p className="text-danger">
                        {formik.errors.proposalType}
                      </p>
                    )}
                </div>
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
              <div className="d-flex align-items-center justify-content-end attactUi">
                <label>Attachment</label>&nbsp;&nbsp;
                <div className="input-group ">
                  <input
                    className={`form-size form-control custom-file-input ${
                      formik.touched.files && formik.errors.files
                        ? "is-invalid"
                        : ""
                    }`}
                    type="file"
                    multiple
                    accept="image/*, video/*, application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {fileError && <div className="text-danger">{fileError}</div>}
                  {/* <div className="text-secondary">
                    Total size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
                  </div> */}
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
              <div className="row sm-device">
                <div className="col-3"></div>
                <div className="col-9 sm-device">
                  {formik.touched.mailBody && formik.errors.mailBody && (
                    <p className="text-danger">{formik.errors.mailBody}</p>
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

export default ProposalCreate;
