import React from "react";
import CRM from "../../assets/heroImage.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import { useParams } from "react-router-dom";
import he from 'he';

export const CancelSchedule = () => {
  const id = useParams();
  // console.log(id.id);

  const cancel = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}cancelAppointment/${id.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // console.log(response.data.appointmentId)
        toast.success(response.data.message);
      } else {
        toast.error("Appointment Cancel Unsuccessful.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.warning(error.response?.data.message);
      } else {
        toast.error(error.response?.data.message);
      }
    }
  };
  return (
    <section className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center ">
              <div className="container card shadow-lg p-3 bg-body rounded border-0 mb-3">
                <h3 className="text-center text-danger my-3" style={{ fontFamily: "Nunito Sans, sans-serif"}}>
                  Cancel Appointment
                </h3>
                <div className="d-flex justify-content-center flex-column align-items-center p-2 mb-3">
                  <p className="my-4 mx-5  text-center">
                    ! Are you sure you Want to cancel the Appointment
                  </p>

                  <button
                    className="btn btn-danger rounded-pill px-5 py-2"
                    // style={{width: "53%" }}
                    type="button"
                    onClick={cancel}
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
