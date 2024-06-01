import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LuUserPlus2 } from "react-icons/lu";
import "../styles/custom.css";
import { FaTrash } from "react-icons/fa";

const validationSchema = Yup.object({
  clientData: Yup.array().of(
    Yup.object().shape({
      phone: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "*Phone number is not valid")
        .notRequired(),
      email: Yup.string().email("*Invalid email format").notRequired(),
    })
  ),
  // phone: Yup.string()
  //   .matches(
  //     /^\+?[1-9]\d{1,14}$/,
  //     "*Phone number is not valid"
  //   )
  //   .notRequired(),
  // email: Yup.string()
  //   .email("*Invalid email format")
  //   .notRequired(),
  status: Yup.string().required("*Status is required"),
  notes: Yup.string().required("*Notes are required"),
});

const ActivityAdd = ({id}) => {
  const [show, setShow] = useState(false);
  const [rows, setRows] = useState([{ id: 1 }]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const userName=sessionStorage.getItem("user_name")

  const formik = useFormik({
    initialValues: {
      clientData: [{id: 1, name: "", phone: "", email: "" }],
      //   phone: "",
      //   email: "",
      status: "",
      notes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async(data) => {
      // Handle form submission
      data.id=id;
      data.userName = userName;
      console.log(data);
    //   try {
    //     const response = await axios.post(`${API_URL}createAccountActivityWithClientData`,data, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     if (response.status === 201) {
    //       toast.success("Appointment Created Successfully.");
          
    //     }
    //   } catch (error) {
    //     toast.error("Failed: " + error.message);
    //   }
    //   formik.resetForm()
    //   setRows({})
    },
  });

  const addRow = () => {
    const newRow = { id: rows.length + 1 };
    setRows([...rows, newRow]);
    formik.setFieldValue("clientData", [
      ...formik.values.clientData,
      { id: newRow.id, name: "", phone: "", email: "" },
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
      <Button variant="primary" onClick={handleShow}>
        Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          closeVariant="white "
          style={{ backgroundColor: "#0073fa" }}
        >
          <Modal.Title className="text-light">Activity Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            {rows&&rows.map((row, index) => (
              <div key={row.id}>
                <div className="d-flex justify-content-between">
                  <div className="form-group mt-2">
                    <label htmlFor={`name${index}`}>Name</label>
                    <input
                      type="text"
                      name={`name${index}`}
                      id={`name${index}`}
                      {...formik.getFieldProps(`clientData[${index}].name`)}
                      className={`form-control ${
                        formik.touched.clientData &&
                        formik.touched.clientData[index]?.name &&
                        formik.errors.clientData &&
                        formik.errors.clientData[index]?.name
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.clientData &&
                      formik.touched.clientData[index]?.name &&
                      formik.errors.clientData &&
                      formik.errors.clientData[index]?.name && (
                        <div className="invalid-feedback">
                          {formik.errors.clientData[index]?.name}
                        </div>
                      )}
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor={`phone${index}`}>Phone</label>
                    <input
                      type="text"
                      name={`phone${index}`}
                      id={`phone${index}`}
                      {...formik.getFieldProps(`clientData[${index}].phone`)}
                      className={`form-control ${
                        formik.touched.clientData &&
                        formik.touched.clientData[index]?.phone &&
                        formik.errors.clientData &&
                        formik.errors.clientData[index]?.phone
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.clientData &&
                      formik.touched.clientData[index]?.phone &&
                      formik.errors.clientData &&
                      formik.errors.clientData[index]?.phone && (
                        <div className="invalid-feedback">
                          {formik.errors.clientData[index]?.phone}
                        </div>
                      )}
                  </div>
                </div>
                <div className="form-group mt-2">
                  <label htmlFor={`email${index}`}>Email</label>
                  <input
                    type="email"
                    name={`email${index}`}
                    id={`email${index}`}
                    {...formik.getFieldProps(`clientData[${index}].email`)}
                    className={`form-control ${
                      formik.touched.clientData &&
                      formik.touched.clientData[index]?.email &&
                      formik.errors.clientData &&
                      formik.errors.clientData[index]?.email
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.clientData &&
                    formik.touched.clientData[index]?.email &&
                    formik.errors.clientData &&
                    formik.errors.clientData[index]?.email && (
                      <div className="invalid-feedback">
                        {formik.errors.clientData[index]?.email}
                      </div>
                    )}
                </div>
              </div>
            ))}
            <div className="my-2 me-2 text-end">
              <button
                onClick={addRow} type="button"
                className=" btn addrow d-inline-flex align-items-center fw-bold "
                style={{
                  cursor: "pointer",
                  color: "#4d5357", 
                }}
              >
                <LuUserPlus2 size={20} className="mb-1" /> Add
              </button>
              
              {rows.length > 1 && <button className="btn mb-2 " type="button" onClick={removeLastRow} 
              style={{ fontSize: '15px',color: "#4d5357" }}><FaTrash /></button>}
            
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
                  <option value=""></option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <div className="invalid-feedback">{formik.errors.status}</div>
                ) : null}
              </div>
              <div className="form-group mt-2">
                <label htmlFor="notes">Notes</label>
                <textarea
                  type="text"
                  name="notes"
                  id="notes"
                  {...formik.getFieldProps("notes")}
                  className={`form-control ${
                    formik.touched.notes && formik.errors.notes
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.notes && formik.errors.notes ? (
                  <div className="invalid-feedback">{formik.errors.notes}</div>
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
