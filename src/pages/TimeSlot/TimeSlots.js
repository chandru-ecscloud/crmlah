import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import TimeSlotsAdd from "../TimeSlot/TimeSlotsAdd";
import TimeSlotsEdit from "./TimeSlotsEdit";
import { Delete } from "@mui/icons-material";
import DeleteTimeSlot from "./DeleteTimeSlot";

const TimeSlots = () => {
  const [timeSlot, setTimeSlot] = useState([]);
  const role = sessionStorage.getItem("role");
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const companyId = sessionStorage.getItem("companyId");

  const openMainModal = () => {
    setIsMainModalOpen(true);
  };

  const closeMainModal = () => {
    setIsMainModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    closeMainModal(); // Close the main modal when opening the add modal
  };

  const handleTimeSlotAdded = () => {
    getTimeSlotData();
  };


  const getTimeSlotData = async () => {
    try {
      const slotdate = new Date().toISOString().split("T")[0];
      const response = await axios(
        `${API_URL}getTodayAvailableSlotsByCompanyId/${companyId}?date=${slotdate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeSlot(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getTimeSlotData();
  }, []);

  return (
    <div>
      <button
        onClick={openMainModal}
        className={`btn btn-danger mx-2 ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
      >
        Time Slot
      </button>
      <Modal
        size="lg"
        show={isMainModalOpen}
        onHide={closeMainModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton closeVariant="white" className="Calenderview">
          <Modal.Title id="example-modal-sizes-title-lg">Time Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="Quotesmodel">
            <div className="container-fluid">
              <div
                className="table-responsive mb-3"
                style={{ maxHeight: "23rem", overflowY: "auto" }}
              >
                <table className="table">
                  <thead>
                    <tr
                      style={{ position: "sticky", top: 0, zIndex: 1 }}
                      className="text-center table-warning"
                    >
                      <th scope="col">S.NO</th>
                      <th scope="col">Slot Time</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlot.map((item, index) => (
                      <tr key={item.id} className="text-center">
                        <td>{index + 1}</td>
                        <td>{item.slotTime}</td>
                        <td className="d-flex justify-content-center">
                          <TimeSlotsEdit id={item.id} refreshData={handleTimeSlotAdded}/>
                          <DeleteTimeSlot refreshData={handleTimeSlotAdded}
                            path={`deleteTimeSlot/${item.id}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <span>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={closeMainModal}
                  >
                    Cancel
                  </button>
                </span>
                &nbsp;
                <span>
                  <TimeSlotsAdd
                   refreshData={handleTimeSlotAdded}
                  />
                </span>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TimeSlots;
