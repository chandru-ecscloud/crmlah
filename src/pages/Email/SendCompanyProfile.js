import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { API_URL } from "../../Config/URL";
import { useFormik } from "formik";
import * as yup from "yup";
const validationSchema = yup.object().shape({
  proposalName: yup.string().required("*Proposal Name is required"),
});
function SendCompanyProfile({ accountData, emails }) {
  const [show, setShow] = useState(false);
  const [proposalData, setProposalData] = useState([]);
  console.log(
    "companyProposalAttachments",
    proposalData.companyProposalAttachments
  );
  console.log("proposalName", proposalData);
  const userEmail = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  const [subject, setSubject] = useState("");
  const companyId = sessionStorage.getItem("companyId");
  const [loadIndicator, setLoadIndicator] = useState(false);
  const currentData = new Date().toISOString().split("T")[0];
  // const [htmlContent, setHtmlContent] = useState("");
  // const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);
  const handleCheck = async (event, formik) => {
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
        toast.success("Zoom link generated successfully");
      }
    } catch (e) {
      toast.error(`Error Generating Zoom Link: ${e.message}`);
    }
  };

  // console.log("leadData:", getEmail);

  const [base64PDFs, setBase64PDFs] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      const files = proposalData.flatMap(
        (proposal) => proposal.companyProposalAttachments
      );
      const base64Files = await Promise.all(
        files.map(async (filePath) => {
          try {
            const response = await fetch(filePath);
            const blob = await response.blob();
            const base64String = await blobToBase64(blob);
            return base64String;
          } catch (error) {
            console.error("Error loading PDF:", error);
            toast.error("Error loading PDF");
            return null;
          }
        })
      );
      setBase64PDFs(base64Files.filter(Boolean));
    };

    if (proposalData.length) {
      fetchPDFs();
    }
  }, [proposalData]);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formik = useFormik({
    initialValues: {
      subject: "",
      proposalName: "",
      files: [],
      htmlContent: "<h2>Hi</h2>",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const selectedProposal = proposalData.find(
          (proposal) => proposal.id === Number(values.proposalName)
        );

        // Convert base64 to Blob
        const formData = new FormData();
        emails.forEach((email) => {
          formData.append("to", email);
        });
        formData.append("from", userEmail);
        formData.append("subject", selectedProposal.subject);
        formData.append("htmlContent", values.htmlContent);
        formData.append("bodyContent ", values.proposalName);
        base64PDFs.slice(0, 2).forEach((base64, index) => {
          const fileData = base64toFile(base64, `file${index + 1}.pdf`);
          formData.append("fileList", fileData);
        });

        // Append additional files if needed
        values.files.forEach((file) => {
          formData.append("files", file);
        });
        setLoadIndicator(true);
        const response = await axios.post(`${API_URL}sendMailForCC`, formData, {
          // toMail: accountData.email,
          // fromMail: userEmail,
          // subject: values.subject,
          // htmlContent: generateInvoice(accountData.quotes),
          // file:values.files,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success("Mail sent successfully");
          handleHide();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email");
      } finally {
        setLoadIndicator(false); // Set loading indicator back to false after request completes
      }
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

  const base64toFile = (base64Data, fileName) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/pdf" });
    return new File([blob], fileName, { type: "application/pdf" });
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
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
                        <option value={data.id}>{data.proposalName}</option>
                      ))}
                  </select>
                  {formik.touched.proposalName &&
                    formik.errors.proposalName && (
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
                  <label className="form-label">
                    Generate Appointment Link
                  </label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      role="switch"
                      id="yes"
                      className={`form-check-input ${
                        formik.touched.generateLink &&
                        formik.errors.generateLink
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("generateLink")}
                      onChange={(event) => {
                        formik.handleChange(event);
                        handleCheck(event, formik);
                      }}
                    />
                  </div>
                  {formik.touched.generateLink &&
                    formik.errors.generateLink && (
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
                onClick={formik.handleSubmit}
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
      </form>
    </div>
  );
}

export default SendCompanyProfile;
