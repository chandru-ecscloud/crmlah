import React, { useEffect, useState } from "react";
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
      clientPhone: Yup.string().test("clientPhone-length", function (value) {
        const { clientCountryCode } = this.parent;
        if (value && /\s/.test(value)) {
          return this.createError({
            message: "Phone number should not contain spaces",
          });
        }
        if (clientCountryCode === "65") {
          if (!/^\d{8}$/.test(value)) {
            return this.createError({
              message: "Phone number must be exactly 8 digits",
            });
          }
        } else if (clientCountryCode === "91") {
          if (!/^\d{10}$/.test(value)) {
            return this.createError({
              message: "Phone number must be exactly 10 digits",
            });
          }
        }
        return true;
      }),
      clientEmail: Yup.string().email("*Invalid email format").notRequired(),
    })
  ),
  status: Yup.string().required("*Status is required"),
  date: Yup.string().required("*Date is required"),
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
      clientCountryCode: "",
    },
  ]);

  const userName = sessionStorage.getItem("user_name");

  const formik = useFormik({
    initialValues: {
      clientData: [
        {
          id: 1,
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          clientCountryCode: "",
        },
      ],
      status: "",
      note: "",
      date: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload = {
        accountActivity: {
          accountId: id,
          activityOwner: userName,
          status: data.status,
          note: data.note,
          date: data.date,
        },
        clientData: data.clientData,
      };
      console.log("Payload:", payload);
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
              clientCountryCode: "",
            },
          ]);
          handleClose();
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const handleShow = () => {
    setShow(true);
  };

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
        clientCountryCode: "",
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
  const currentData = new Date().toISOString().split("T")[0];

  useEffect(() => {
    formik.setFieldValue("date", currentData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button variant="danger" className="me-2" onClick={handleShow}>
        New Activity
      </Button>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
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
                  <div className="">
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

                    {/* <div className="form-group mt-2">
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
                    </div> */}

                    <div className="form-group mt-2">
                      <label>Phone</label>
                      <div className="input-group ms-1">
                        <div>
                          <select
                            {...formik.getFieldProps(
                              `clientData[${index}].clientCountryCode`
                            )}
                            id={`clientCountryCode${index}`}
                            name={`clientData[${index}].clientCountryCode`}
                            className={`form-size form-control ${
                              formik.touched.clientData &&
                              formik.touched.clientData[index]
                                ?.clientCountryCode &&
                              formik.errors.clientData &&
                              formik.errors.clientData[index]?.clientCountryCode
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{
                              borderTopRightRadius: "0px",
                              borderBottomRightRadius: "0px",
                            }}
                          >
                            <option></option>
                            <option value="65">+65</option>
                            <option value="91">+91</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          name={`clientData[${index}].clientPhone`}
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
              {rows.length < 10 && (
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
              )}
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
                <label htmlFor="status">Date</label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  {...formik.getFieldProps("date")}
                  className={`form-control ${
                    formik.touched.date && formik.errors.date
                      ? "is-invalid"
                      : ""
                  }`}
                ></input>
                {formik.touched.date && formik.errors.date ? (
                  <div className="invalid-feedback">{formik.errors.date}</div>
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
