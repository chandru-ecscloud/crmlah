import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";

const TableDeleteModel = ({ rows, onSuccess, handleBulkDelete,rowSelected }) => {
  const [show, setShow] = useState(false);
  const role = sessionStorage.getItem("role");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    try {
      // Trigger the delete API for multiple rows
      await handleBulkDelete(rows);
      onSuccess();
      handleClose();
      toast.success("Items deleted successfully.");
    } catch (error) {
      toast.error("Error deleting data: " + error.message);
    }
  };

  return (
    <>
      <button
        onClick={handleShow}
        disabled={role === "CMP_USER" || rowSelected}
        className="btn"
        style={{ width: "100%", border: "none" }}
      >
        Delete
      </button>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Delete</b>
          </Modal.Title>
        </Modal.Header>
        <hr style={{ margin: "0px" }} />
        <Modal.Body>Are you sure you want to delete selected items?</Modal.Body>
        <hr style={{ margin: "0px" }} />

        <Modal.Footer>
          <button className="btn btn-secondary btn-sm" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableDeleteModel;
