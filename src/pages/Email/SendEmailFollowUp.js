import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend, IoIosSend } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import user from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import { useFormik } from "formik";
import * as yup from "yup";

// const role = sessionStorage.getItem("role");

const validationSchema = yup.object().shape({
  subject: yup.string().required("*Subject"),
  body: yup.string().required("*Main Body"),
  // files: yup.array()
  //     .min(1, "Attacment is Must")
  //     .required("Attacment is Must"),
});

function SendEmailFollowUp({ toEmail, leadId }) {
  // console.log("To Mail:",toEmail);

  const [show, setShow] = useState(false);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const formik = useFormik({
    initialValues: {
      subject: "",
      body: "",
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("To Mail:", toEmail);
      console.log("From Mail:", userEmail);
      console.log("Subject:", values.subject);
      console.log("Main Body:", values.body);
      console.log("Files:", values.files);
      setLoadIndicator(true);

      try {
        const formData = new FormData();
        formData.append("to", toEmail);
        formData.append("from", userEmail);
        formData.append("subject", values.subject);
        formData.append("body", values.body);
        formData.append("leadId", leadId);
        // formData.append("leadName","sakthivel");
        values.files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await axios.post(
          `${API_URL}sendMailWithAttachmentForClientFollowup`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              //Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          handleHide();
          setLoadIndicator(false);
        } else {
          toast.error(response.data.message);
          setLoadIndicator(false);
        }
      } catch (error) {
        console.error(error);
        setLoadIndicator(false);
      }
    },
  });

  const handleShow = () => setShow(true);
  const handleHide = () => {
    formik.resetForm();
    setSelectedFile(null);
    setShow(false);
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  // };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("files", [...formik.values.files, ...files]);
  };

  // const sendEmail = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("toMail", "chandru08112000@gmail.com");
  //     formData.append("fromMail", userEmail);
  //     formData.append("subject", subject);
  //     formData.append("body", mainBody);
  //     formData.append("attachment", selectedFile);

  //     const response = await axios.post(
  //       `${API_URL}sendMailWithAttachment`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data", // Set the content type
  //           //Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success(response.data.message);
  //       toast.success("Mail Send Successfully");
  //       handleHide();
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="mailtip">
      <Button
        className="fs-4 btn bg-primary bg-gradient mx-2 text-white shadow-none rounded-5"
        onClick={handleShow}
        style={{ padding: "2px 8px" }}
      >
        <IoIosSend className="mb-1" />
      </Button>
      <Offcanvas
        show={show}
        onHide={handleHide}
        className="emailHeader"
        placement="end"
      >
        <Offcanvas.Header>
          New Message &nbsp;&nbsp;&nbsp;&nbsp;{" "}
          <button
            onClick={handleHide}
            className="btn border-dark fw-bold"
            style={{ color: "#fff", fontSize: "20px" }}
          >
            x
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={formik.handleSubmit}>
            <div
              className="d-flex align-items-center pb-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <img className="img-fluid" src={user} width={40} alt="user" />
              <p style={{ marginBottom: "0px" }}>
                {userName || "--"} ( {userEmail || "--"} )
              </p>
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <p style={{ marginBottom: "0px" }}>
                <b style={{ color: "#424242" }}>To :</b>
              </p>
              <p style={{ marginBottom: "0px" }}>{toEmail}</p>
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <input
                type="text"
                name="subject"
                id="subject"
                placeholder="Subject"
                // onChange={(e) => setSubject(e.target.value)}
                style={{ border: "none" }}
                className={`form-control  ${
                  formik.touched.subject && formik.errors.subject
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("subject")}
              />
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <textarea
                name="body"
                placeholder="Mail Body"
                // onChange={(e) => setMainBody(e.target.value)}
                style={{ height: "250px", border: "none" }}
                className={`form-control  ${
                  formik.touched.body && formik.errors.body ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("body")}
              ></textarea>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span
                style={{ minHeight: "80px", gap: "10px" }}
                className="d-flex align-items-center"
              >
                <span>
                  <label
                    htmlFor="file-input"
                    className="btn btn-outline-primary"
                  >
                    <GrAttachment />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    multiple
                    accept=".jpg, .jpeg, .png, .gif, .pdf, .txt"
                  />
                  {formik.values.files.length > 0 ? (
                    <span>
                      &nbsp;{formik.values.files.length} files selected
                    </span>
                  ) : (
                    <span className="text-danger">
                      &nbsp;
                      <MdErrorOutline className="text-danger" />
                      &nbsp;{formik.errors.files}
                    </span>
                  )}
                </span>
              </span>
              <span className="d-flex" style={{ gap: "10px" }}>
                <button className="btn btn-primary" type="submit">
                  {loadIndicator && (
                    <span
                      class="spinner-border spinner-border-sm me-3"
                      aria-hidden="true"
                    ></span>
                  )}
                  &nbsp;<span role="status">Send</span>
                  <IoMdSend className="ms-2 mb-1" />
                </button>
              </span>
            </div>
            {selectedFile && (
              <p className="mt-2" style={{ marginBottom: "0px" }}>
                File selected: {selectedFile.name}
              </p>
            )}
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendEmailFollowUp;
