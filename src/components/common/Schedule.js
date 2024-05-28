import React, { useEffect, useState } from "react";
import CRM from "../../assets/heroImage.png";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
const validationSchema = Yup.object().shape({
  appointmentStartDate: Yup.string().required(
    "*Appointment start date is required"
  ),
  // appointmentStartTime: Yup.string().required(
  //   "*Appointment start Time is required"
  // ),
});
const Schedule = () => {
  const id =useParams()
  console.log(id.id)
  const [appointmentStartTime, setAppointmentStartTime] = useState([]);
  console.log("appoinment Time", appointmentStartTime)

  const formik = useFormik({
    initialValues: {
      appointmentStartDate: "",
      appointmentStartTime: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data, { resetForm }) => {
      console.log(data);
      let selectedTimeSlot = "";
      appointmentStartTime.forEach((time) => {
        if (parseInt(data.timeSlotId) === time.id) {
          selectedTimeSlot = time.slotTime || "--";
        }
      });
      data.appointmentStartTime = selectedTimeSlot;
      try {
        const response = await axios.put(`${API_URL}reschedule/${id.id}`, data, {
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

      resetForm();
    },
  });
  const fetchAppointmentTime = async () => {
    try {
      const response = await axios.get(
        `https://crmlah.com/ecscrm/api/getTodayAvailableSlotsByCompanyId/${2}?date=${formik.values.appointmentStartDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAppointmentStartTime(response.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   formik.setFieldValue("appointmentStartDate", new Date().toISOString().split('T')[0])
  // }, [])

  useEffect(() => {
    fetchAppointmentTime();
  }, [formik.values.appointmentStartDate]);
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
                Reschedule Appointment
              </h3>
              <div className="container px-5">
                <form onSubmit={formik.handleSubmit}>
              
                      <div className="my-4">
                      <label htmlFor="">Select new Date of Appointment</label>

                        <input
                          type="date"
                          name="appointmentStartDate"
                          id="appointmentStartDate"
                          {...formik.getFieldProps("appointmentStartDate")}
                          className={`form-size form-control   ${formik.touched.appointmentStartDate &&
                            formik.errors.appointmentStartDate
                            ? "is-invalid"
                            : ""
                            }`}
                        />
                      </div>
                      {formik.touched.appointmentStartDate &&
                        formik.errors.appointmentStartDate && (
                          <p className="text-danger">
                            {formik.errors.appointmentStartDate}
                          </p>
                        )}
                    
                    
                      <div className="mt-4 mb-5">
                      <label htmlFor="">Select new Time of Appointment</label>

                        <select
                          type="text"
                          name="timeSlotId"
                          className="form-select form-size"
                          {...formik.getFieldProps("timeSlotId")}
                          id="timeSlotId"
                        >
                          <option value="">Select a start time</option>
                          {appointmentStartTime.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              disabled={option.allocated}
                            >
                              {option.slotTime} {option.allocated ? "" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formik.touched.timeSlotId &&
                        formik.errors.timeSlotId && (
                          <p className="text-danger">
                            {formik.errors.timeSlotId}
                          </p>
                        )}
                

                  <div className="d-flex justify-content-center mt-4 ">
                    <button
                      className="btn btn-outline-secondary  rounded-pill mx-3 px-4"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary rounded-pill   px-5"
                      style={{ background: "#385fe5" }}
                      type="submit"
                    >
                      Reschedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
