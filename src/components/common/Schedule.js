import React from "react";
import CRM from "../../assets/heroImage.png";

const Schedule = () => {
  return (
    <section className="signIn">
      <div style={{ marginTop: "105px", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <h3 className="registerWord text-center">Reschedule Appointment</h3>
              <div className="container px-5">
              <form>
                <div className="my-4">
                    <label htmlFor="">Select new Date of Appointment</label>
                  <input type="date" name="" id="" className="form-control mt-1" />
                </div>
                <div className="mt-4 mb-5">
                    <label htmlFor="">Select new Time of Appointment</label>
                  <input type="time" name="" id="" className="form-control mt-1" />
                </div>
                <div className="d-flex justify-content-center mt-4 ">
                    <button className="btn btn-outline-secondary  rounded-pill mx-3 px-4" type="button">Cancel</button>
                    <button className="btn btn-primary rounded-pill   px-5" style={{background:"#385fe5"}} type="button">Reschedule</button>
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
