import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalFooter } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
import "../../styles/dummy.css";

const validationSchema = yup.object().shape({
  first_name: yup.string().required("*First Name is required"),
  last_name: yup.string().required("*Last Name is required"),
  phone: yup
    .string()
    .required("*Phone is required")
    .matches(/^[0-9]{10}$/, "*Phone Number must be 10 digits"),
  email: yup.string().email("*Invalid Email").required("*Email is required"),
});

const CreateTask = ({ tasks, setTasks, handelLeadFetch }) => {
  const [showModal, setShowModal] = useState(false);
  const companyId = sessionStorage.getItem("companyId");

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      country_code: "",
      email: "",
      description_info:"",

    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log(data);
      data.company_id=companyId
      try {
        const response = await axios.post(`${API_URL}newClient`, data, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201 || response.status ===200) {
          console.log(response.data);
          toast.success(response.data.message);
          setShowModal(false);
          handelLeadFetch();
          formik.resetForm()
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });
  // const [task, setTask] = useState({
  //   id: "",
  //   name: "",
  //   phone: "",
  //   email: "",
  //   amount: "",
  //   status: "New",
  // });
  // const handleClose = () => {
  //   setShowModal(false)
  //   setTask({
  //     id: "",
  //     name: "",
  //     phone: "",
  //     email: "",
  //     amount: "",
  //     status: "New",
  //   });
  // };
  const handleShow = () => setShowModal(true);

  {
    /*const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.length < 3)
      return toast.error("A task must have more than 3 characters");
    if (task.name.length > 100)
      return toast.warning("A task must not be more than 100 characters");

    const newTask = {
      id: uuidv4(),
      name: task.name,
      phone: task.phone,
      email: task.email,
      amount: task.amount,
      status: task.status,
    };

    const newList = Array.isArray(tasks) ? [...tasks, newTask] : [newTask];

    setTasks(newList);
    localStorage.setItem("tasks", JSON.stringify(newList));
    toast.success("Task Created");

    setTask({
      id: "",
      name: "",
      phone: "",
      email: "",
      amount: "",
      status: "New",
    });
   
    handleClose();
  };*/
  }

  return (
    <>
      <div className="d-flex justify-content-between align-content-center mb-3">
        <h4 className="fw-bold">Sales Pipeline</h4>
        <button className="btn btn-primary" onClick={handleShow}>
          Create Lead
        </button>
      </div>
      <div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="Calenderview">
            <Modal.Title className="fw-bold fs-5">Create Lead</Modal.Title>
          </Modal.Header>
          <form onSubmit={formik.handleSubmit}>
            <Modal.Body>
              <div className="row me-2">
                <div className="d-flex align-items-center justify-content-end mb-3 sm-device my-2">
                  <lable className="form-label ">First Name</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className={`form-size form-control w-75 ${
                      formik.touched.first_name && formik.errors.first_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("first_name")}
                    name="first_name"
                    id="first_name"
                  />
                </div>
                <div className="d-flex align-items-center justify-content-end mb-3 sm-device my-2">
                  <lable>Last Name</lable> &nbsp;&nbsp;
                  <input
                    type="text"
                    className={`form-size form-control w-75 ${
                      formik.touched.last_name && formik.errors.last_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("last_name")}
                    id="last_name"
                  />
                </div>
                <div className="d-flex align-items-center justify-content-end mb-3 sm-device my-2">
                  <lable>Phone</lable> &nbsp;&nbsp;
                  <div className="input-group" style={{ width: "75%" }}>
                    <div>
                      <select
                        className={`form-size form-control  ${
                          formik.touched.phone && formik.errors.phone
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("country_code")}
                        style={{
                          // width: "70px",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
                        }}
                      >
                        <option value="+65">+65</option>
                        <option value="+91">+91</option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      name="phone"
                      className={`form-size form-control w-75 ${
                        formik.touched.phone && formik.errors.phone
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("phone")}
                      id="phone"
                      aria-label="Text input with checkbox"
                    />
                  </div>
                </div>
              </div>
              <div className="row me-2">
                <div className="d-flex align-items-center justify-content-end mb-3 sm-device my-2">
                  <lable>Email</lable> &nbsp;&nbsp;
                  <input
                    type="email"
                    className={`form-size form-control w-75 ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("email")}
                    id="email"
                  />
                </div>
                <div className="d-flex align-items-center justify-content-end mb-3 sm-device my-2">
                  <label className="me-2">Enquiry</label>
                  <input
                    type="text"
                    name="description_info"
                    {...formik.getFieldProps("description_info")}
                    className="form-control w-75"
                  />
                </div>
              </div>
            </Modal.Body>
            <ModalFooter className="d-flex">
              <button
                className="btn btn-danger"
                type="button"
                onClick={()=>setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </>
  );
};
export default CreateTask;
