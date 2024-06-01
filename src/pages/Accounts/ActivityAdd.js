import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LuUserPlus2 } from "react-icons/lu";
import "../../styles/custom.css";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../Config/URL";

const validationSchema = Yup.object({
  clientData: Yup.array().of(
    Yup.object().shape({
      clientPhone: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "*Phone number is not valid")
        .notRequired(),
      clientEmail: Yup.string().email("*Invalid email format").notRequired(),
    })
  ),
  status: Yup.string().required("*Status is required"),
  note: Yup.string().required("*Notes are required"),
});

const ActivityAdd = ({ id, fetchData }) => {
  const [show, setShow] = useState(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      clientCountryCode: "65",
    },
  ]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const userName = sessionStorage.getItem("user_name");

  const formik = useFormik({
    initialValues: {
      clientData: [
        {
          id: 1,
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          clientCountryCode: "65",
        },
      ],
      status: "",
      note: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload = {
        accountActivity: {
          accountId: id,
          activityOwner: userName,
          status: data.status,
          note: data.note,
        },
        clientData: data.clientData,
      };
      try {
        const response = await axios.post(
          `${API_URL}createAccountActivityWithClientData`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success("Activity Created Successfully.");
          fetchData();
          formik.resetForm();
          setRows([
            {
              id: 1,
              clientName: "",
              clientPhone: "",
              clientEmail: "",
              clientCountryCode: "65",
            },
          ]);
          handleClose();
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const addRow = () => {
    const newRow = { id: rows.length + 1 };
    setRows([...rows, newRow]);
    formik.setFieldValue("clientData", [
      ...formik.values.clientData,
      {
        id: newRow.id,
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        clientCountryCode: "65",
      },
    ]);
  };

  const removeLastRow = () => {
    if (rows.length > 1) {
      const updatedRows = rows.slice(0, -1);
      setRows(updatedRows);
      formik.setFieldValue("clientData", formik.values.clientData.slice(0, -1));
    }
  };

  return (
    <>
      <Button variant="danger" className="me-2" onClick={handleShow}>
        New Activity
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{ backgroundColor: "#0073fa" }}
        >
          <Modal.Title className="text-light">Add Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            {rows &&
              rows.map((row, index) => (
                <div key={row.id}>
                  <div className="d-flex justify-content-between">
                    <div className="form-group mt-2">
                      <label htmlFor={`clientName${index}`}>Name</label>
                      <input
                        type="text"
                        name={`clientName${index}`}
                        id={`clientName${index}`}
                        {...formik.getFieldProps(
                          `clientData[${index}].clientName`
                        )}
                        className={`form-control ${
                          formik.touched.clientData &&
                          formik.touched.clientData[index]?.clientName &&
                          formik.errors.clientData &&
                          formik.errors.clientData[index]?.clientName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.clientData &&
                        formik.touched.clientData[index]?.clientName &&
                        formik.errors.clientData &&
                        formik.errors.clientData[index]?.clientName && (
                          <div className="invalid-feedback">
                            {formik.errors.clientData[index]?.clientName}
                          </div>
                        )}
                    </div>
                    <div className="form-group mt-2">
                      <label htmlFor={`clientPhone${index}`}>Phone</label>
                      <input
                        type="text"
                        name={`clientPhone${index}`}
                        id={`clientPhone${index}`}
                        {...formik.getFieldProps(
                          `clientData[${index}].clientPhone`
                        )}
                        className={`form-control ${
                          formik.touched.clientData &&
                          formik.touched.clientData[index]?.clientPhone &&
                          formik.errors.clientData &&
                          formik.errors.clientData[index]?.clientPhone
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.clientData &&
                        formik.touched.clientData[index]?.clientPhone &&
                        formik.errors.clientData &&
                        formik.errors.clientData[index]?.clientPhone && (
                          <div className="invalid-feedback">
                            {formik.errors.clientData[index]?.clientPhone}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor={`clientEmail${index}`}>Email</label>
                    <input
                      type="clientEmail"
                      name={`clientEmail${index}`}
                      id={`clientEmail${index}`}
                      {...formik.getFieldProps(
                        `clientData[${index}].clientEmail`
                      )}
                      className={`form-control ${
                        formik.touched.clientData &&
                        formik.touched.clientData[index]?.clientEmail &&
                        formik.errors.clientData &&
                        formik.errors.clientData[index]?.clientEmail
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.clientData &&
                      formik.touched.clientData[index]?.clientEmail &&
                      formik.errors.clientData &&
                      formik.errors.clientData[index]?.clientEmail && (
                        <div className="invalid-feedback">
                          {formik.errors.clientData[index]?.clientEmail}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            <div className="my-2 me-2 text-end">
              <button
                onClick={addRow}
                type="button"
                className=" btn addrow d-inline-flex align-items-center fw-bold "
                style={{
                  cursor: "pointer",
                  color: "#4d5357",
                }}
              >
                <LuUserPlus2 size={20} className="mb-1" /> Add
              </button>

              {rows.length > 1 && (
                <button
                  className="btn mb-2 "
                  type="button"
                  onClick={removeLastRow}
                  style={{ fontSize: "15px", color: "#4d5357" }}
                >
                  <FaTrash />
                </button>
              )}
            </div>
            <div className="">
              <div className="form-group mt-2">
                <label htmlFor="status">Status</label>
                <select
                  type="text"
                  name="status"
                  id="status"
                  {...formik.getFieldProps("status")}
                  className={`form-select ${
                    formik.touched.status && formik.errors.status
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option></option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="DELIVERY">Delivery</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <div className="invalid-feedback">{formik.errors.status}</div>
                ) : null}
              </div>
              <div className="form-group mt-2">
                <label htmlFor="note">Notes</label>
                <textarea
                  type="text"
                  name="note"
                  id="note"
                  {...formik.getFieldProps("note")}
                  className={`form-control ${
                    formik.touched.note && formik.errors.note
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.note && formik.errors.note ? (
                  <div className="invalid-feedback">{formik.errors.note}</div>
                ) : null}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary my-2"
            type="submit"
            onClick={formik.handleSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivityAdd;
