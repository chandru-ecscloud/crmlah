import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({});

const TimeSlotsEdit = ({ id, refreshData}) => {

  console.log("Time Slot ByID:",id);
  const role = sessionStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false);
  const companyId = sessionStorage.getItem("companyId");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      startTime:"",
      endTime:""
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const startTime = new Date(`1970-01-01T${data.startTime}`).toLocaleTimeString("en-IN", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const endTime = new Date(`1970-01-01T${data.endTime}`).toLocaleTimeString("en-IN", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const payload = {
        slotTime: `${startTime} - ${endTime}`,
        companyId : companyId,
      };
      console.log("Add Time Slot:", payload);
      try {
        const response = await axios.put(`${API_URL}updateTimeSlot/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          closeModal();
          refreshData();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error?.response?.data?.message);
      }
    },
  });

  const getTimeSlotDataId = async () => {
    try {
      const response = await axios(
        `${API_URL}allTimeSlot/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const slotTime = response.data.slotTime;
      const [startTime, endTime] = slotTime.split(" - ").map(time => {
        const [timePart, period] = time.split(" ");
        const [hours, minutes] = timePart.split(":");
        let adjustedHours = parseInt(hours, 10);
        if (period.toLowerCase() === "pm" && adjustedHours < 12) {
          adjustedHours += 12;
        } else if (period.toLowerCase() === "am" && adjustedHours === 12) {
          adjustedHours = 0;
        }
        return `${adjustedHours.toString().padStart(2, '0')}:${minutes}`;
      });
      formik.setValues({ startTime, endTime });
      console.log("Time Slot By Id:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getTimeSlotDataId();
  }, []);


  return (
    <div>
      <button
        onClick={openModal}
        className={`btn border-white shadow-none mx-2 ${role === "CMP_USER" && "disabled"}`}
        disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
      >
        <FaEdit/>
      </button>
      <Modal
        size="sm"
        show={isOpen}
        onHide={closeModal}
        dialogClassName="custom-modal"
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Header className="bg-light p-2">
          <Modal.Title id="example-modal-sizes-title-sm" className="fs-5">Edit Time Slot</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <section className="Quotesmodel">
            <div className="container-fluid">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Start Time</label>&nbsp;&nbsp;
                <input
                  className="form-control"
                  type="time"
                  name="startTime"
                  id="startTime"
                  {...formik.getFieldProps("startTime")}
                />
              </div>
              <div className="d-flex align-items-center justify-content-end sm-device my-2">
                <label>End Time</label>&nbsp;&nbsp;
                <input
                  className="form-control"
                  type="time"
                  name="endTime"
                  id="endTime"
                  {...formik.getFieldProps("endTime")}
                />
              </div>
              <div className="col-12 d-flex justify-content-end justify-content-end">
                <span>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </span>
                &nbsp;
                <span>
                  <button type="submit" className="btn btn-sm btn-primary">
                    Update
                  </button>
                </span>
              </div>
            </div>
          </section>
        </Modal.Body>
        </form>
        
      </Modal>
    </div>
  );
};

export default TimeSlotsEdit;
