import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalFooter } from "react-bootstrap";

const CreateTask = ({ tasks, setTasks }) => {
  const [showModal, setShowModal] = useState(false);

  const [task, setTask] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    amount: "",
    status: "New",
  });
  const handleClose = () => {
    setShowModal(false)
    setTask({
      id: "",
      name: "",
      phone: "",
      email: "",
      amount: "",
      status: "New",
    });
  };
  const handleShow = () => setShowModal(true);

  const handleSubmit = (e) => {
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
  };

  return (
    <>
      <div className="d-flex justify-content-between align-content-center mb-3">
        <h4 className="fw-bold">
          Sales Reports
        </h4>
        <button className="btn btn-primary" onClick={handleShow}>
          Create Lead
        </button>
      </div>
      <div>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-5">Create Lead</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="d-flex align-items-center justify-content-start mb-3 sm-device my-2">
                  <label style={{width:"20%"}} className="me-4">Lead Name</label>
                  <input
                    type="text"
                    name="name"
                    style={{width:"70%"}}
                    className="form-control"
                    value={task.name}
                    onChange={(e) => setTask({ ...task, name: e.target.value })}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-start mb-3 sm-device my-2">
                  <label style={{width:"20%"}} className="me-4">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    style={{width:"70%"}}
                    className="form-control"
                    value={task.phone}
                    onChange={(e) =>
                      setTask({ ...task, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="d-flex align-items-center justify-content-start mb-3 sm-device my-2">
                  <label style={{width:"20%"}} className="me-4">Email</label>
                  <input
                    type="email"
                    name="email"
                    style={{width:"70%"}}
                    className="form-control"
                    value={task.email}
                    onChange={(e) =>
                      setTask({ ...task, email: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex align-items-center justify-content-start mb-3 sm-device my-2">
                  <label style={{width:"20%"}} className="me-4">Amount</label>
                  <input
                    type="text"
                    name="amount"
                    style={{width:"70%"}}
                    className="form-control"
                    value={task.amount}
                    onChange={(e) =>
                      setTask({ ...task, amount: e.target.value })
                    }
                  />
                </div>
              </div>
            </Modal.Body>
            <ModalFooter className="d-flex justify-content-between align-items-center">
              <button className="btn btn-secondary" type="button"
              onClick={handleClose}>
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
