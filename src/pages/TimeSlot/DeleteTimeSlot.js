import axios from "axios";
import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";

function DeleteTimeSlot({ path ,refreshData}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handelDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}${path}`);
      if (response.status === 201) {
        handleClose();
        toast.success(response.data.message);
        refreshData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting data:", error);
    }
  };

  return (
    <>
      <button className="btn btn-sm" onClick={handleShow}>
        <FaTrash />
      </button>

      <Modal
        size="sm"
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal"
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Header className="bg-light p-2">
          <Modal.Title className="fs-5">Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <button className="btn btn-sm btn-secondary" variant="secondary" onClick={handleClose}>
            Close
          </button >
          <button className="btn btn-sm btn-danger" variant="danger" onClick={handelDelete}>
            Delete
          </button >
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteTimeSlot;
