import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

function CalenderBookingModel({ name, style }) {
  const [lgShow, setLgShow] = useState(false);

  return (
    <div>
      <button style={style} onClick={() => setLgShow(true)}>
        {name}
      </button>
      <Modal show={lgShow} onHide={() => setLgShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div>
              <lable>
                <b>Client Name</b>
              </lable>
              <br />
              <input type="text" className="form-control" />
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-primary">Submit</button>&nbsp;
              <button className="btn btn-danger">Cancel</button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CalenderBookingModel;
