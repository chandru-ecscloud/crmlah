import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { API_URL } from "../../Config/URL";
import { useFormik } from "formik";
import * as yup from "yup";
import mailContent from "./MailContent";

const validationSchema = yup.object().shape({
  proposalName: yup.string().required("*Proposal Name is required"),
});

function SendCompanyProfile({ accountData, emails, tablereset }) {
  const [show, setShow] = useState(false);
  const [proposalData, setProposalData] = useState([]);
  const [selectedProposalData, setSelectedProposalData] = useState({});
  const userEmail = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  const [generateLink, setGenerateLink] = useState(null);
  const companyId = sessionStorage.getItem("companyId");
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [base64PDFs, setBase64PDFs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}getAllCompanyProposalByCompanyId/${companyId}`
        );
        setProposalData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [companyId]);

  useEffect(() => {
    const fetchPDFs = async () => {
      const files = selectedProposalData.companyProposalAttachments.flatMap(
        (proposal) => proposal.multipleAttachments
      );

      console.log("Files ", files);

      const base64Files = await Promise.all(
        files.map(async (filePath) => {
          try {
            const response = await fetch(filePath);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const fileBlob = await response.blob();
            const contentType = response.headers.get("content-type");
            return {
              fileBlob,
              name: extractFileNameFromPath(filePath),
              type: contentType,
            };
          } catch (error) {
            console.error("Error loading file:", error);
            // toast.error("Error loading file");
            return null;
          }
        })
      );

      setBase64PDFs(base64Files.filter((file) => file !== null));
    };

    if (selectedProposalData.companyProposalAttachments?.length) {
      fetchPDFs();
    }
  }, [selectedProposalData]);

  const extractFileNameFromPath = (filePath) => {
    const pathParts = filePath.split("/");
    return pathParts[pathParts.length - 1];
  };

  const handleCheck = async (event) => {
    const { checked } = event.target;
    if (!checked) return;

    try {
      const linkResponse = await axios.post(
        `${API_URL}GenerateSingaporeZoomMeetingLink`,
        {
          meetingTitle: "leads",
          startDate: "2024-02-21",
          startTime: "10:00",
          duration: 30,
        }
      );
      if (linkResponse.status === 200) {
        setGenerateLink(linkResponse.data.message);
        // toast.success("Zoom link generated successfully");
      }
    } catch (e) {
      toast.error(`Error Generating Zoom Link: ${e.message}`);
    }
  };

  const formik = useFormik({
    initialValues: {
      subject: "",
      proposalName: "",
      files: [],
      htmlContent: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      for (const email of emails || []) {
        try {
          const formData = new FormData();
          formData.append("to", email.email);
          formData.append("from", userEmail);
          formData.append("subject", selectedProposalData.subject);
          formData.append("bodyContent", selectedProposalData.subject);

          const result = await mailContent(
            email.first_name,
            generateLink,
            selectedProposalData.mailBody
          );
          formData.append("htmlContent", result);

          values.files.forEach((file) => {
            formData.append("files", file);
          });

          base64PDFs.forEach(({ fileBlob, name, type }) => {
            formData.append("basicFiles", new File([fileBlob], name, { type }));
          });

          setLoadIndicator(true);

          const response = await axios.post(
            `${API_URL}sendMailWithHtmlContentAndAttachment`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status !== 201 && response.status !== 200) {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error sending email:", error);
          toast.error("Failed to send email");
        } finally {
          setLoadIndicator(false);
        }
      }

      setGenerateLink(null);
      toast.success("Mails sent successfully");
      formik.resetForm();
      setBase64PDFs([]);
      tablereset();
      handleHide();
    },
  });

  const handleShow = () => setShow(true);

  const handleHide = () => {
    setShow(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("files", [...formik.values.files, ...files]);
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const fetchSelectedProposalData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllCompanyProposalById/${formik.values.proposalName}`
      );
      setSelectedProposalData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (formik.values.proposalName) {
      fetchSelectedProposalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.proposalName]);

  return (
    <div>
      <p className="" onClick={handleShow} disabled={role === "CMP_USER"}>
        Proposal
      </p>
      <Modal
        show={show}
        onHide={handleHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header
            closeButton
            closeVariant="white"
            className="Calenderview"
          >
            <Modal.Title>Send Proposal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="mb-2">
                <label className="form-label">Proposal Name</label>
                <select
                  {...formik.getFieldProps("proposalName")}
                  className={`form-select ${
                    formik.touched.proposalName && formik.errors.proposalName
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                >
                  <option></option>
                  {proposalData &&
                    proposalData.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.proposalName}
                      </option>
                    ))}
                </select>
                {formik.touched.proposalName && formik.errors.proposalName && (
                  <div className="invalid-feedback">
                    {formik.errors.proposalName}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <label className="form-label">Attachments</label>
                <div className="input-group mb-3">
                  <input
                    type="file"
                    multiple
                    className={`form-control ${
                      formik.touched.files && formik.errors.files
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={handleFileChange}
                  />
                  {formik.touched.files && formik.errors.files && (
                    <div className="invalid-feedback">
                      {formik.errors.files}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label">Generate Appointment Link</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    role="switch"
                    id="yes"
                    className={`form-check-input ${
                      formik.touched.generateLink && formik.errors.generateLink
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("generateLink")}
                    onChange={(event) => {
                      formik.handleChange(event);
                      handleCheck(event);
                    }}
                  />
                </div>
                {formik.touched.generateLink && formik.errors.generateLink && (
                  <div className="invalid-feedback">
                    {formik.errors.generateLink}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="mt-5">
            <Button className="btn btn-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={loadIndicator}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default SendCompanyProfile;
