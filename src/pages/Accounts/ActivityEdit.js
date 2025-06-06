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
import { MdEdit } from "react-icons/md";
import UseScrollToError from "../UseScrollToError";

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
  note: Yup.string().required("*Notes are required"),
});

const ActivityEdit = ({ id, fetchData, accountId }) => {
  // console.log("Account ID :",accountId);
  // console.log("Activity ID :",id);
  const [show, setShow] = useState(false);
  const [rows, setRows] = useState([{}]);
  const currentData = new Date().toISOString().split("T")[0];

  const userName = sessionStorage.getItem("user_name");

  const formik = useFormik({
    initialValues: {
      status: "",
      note: "",
      date: "",
      clientData: [
        {
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          clientCountryCode: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const payload = {
        accountActivity: {
          accountId: accountId,
          activityOwner: userName,
          status: data.status,
          note: data.note,
          date: data.date,
        },
        clientDataModels: data.clientData.map((item) => ({
          id: item.id,
          clientName: item.clientName,
          clientEmail: item.clientEmail,
          clientCountryCode: item.clientCountryCode,
          clientPhone: item.clientPhone,
        })),
      };
      try {
        const response = await axios.put(
          `${API_URL}updateAccountActivityWithClientData/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success("Activity Update Successfully.");
          fetchData();
          handleClose();
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const handleClose = () => {
    setShow(false);
    // formik.resetForm();
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

  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAccountActivityById/${id}`
      );
      formik.setValues(response.data);
      setRows(response.data.clientData);
    } catch (error) {
      console.log(`Error fetching data: ${error.message}`);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  UseScrollToError(formik)

  return (
    <>
      <button className="btn text-primary" onClick={handleShow}>
        <MdEdit />
      </button>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{ backgroundColor: "#0073fa" }}
        >
          <Modal.Title className="text-light">Edit Activity</Modal.Title>
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
                <label htmlFor="status">Date</label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  max={currentData}
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

export default ActivityEdit;
