import React from 'react';
import CRM from "../../assets/heroImage.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import { useParams } from "react-router-dom";

export const CancelSchedule = () => {
    const id =useParams()
    console.log(id.id)
   const cancel = async () =>{
    try {
        const response = await axios.delete(`${API_URL}cancelAppointment/${id.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
   }
  return (
    <section className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <h3 className="registerWord text-center">
                Cancel Appointment
              </h3>
              <div className="container px-5 d-flex justify-content-center flex-column">
                <p className='my-4 ms-2'>!Are you sure you Want to cancel the appointment</p>
                
                <button
                      className="btn btn-primary rounded-pill   px-5"
                      style={{ background: "#385fe5" }}
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
    </section>
  )
}
