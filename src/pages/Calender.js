import React from "react";
import AppointmentsCreate from "./AppointmentsModel";
import CalenderBookingModel from "./CalenderBookingModel";
import { FaSquare } from "react-icons/fa";

function Calender() {
  const completed = {
    width: "80%",
    height: "100%",
    background: "#f2eafe",
    border: "none",
    borderLeft: "5px solid #bd28e3",
    borderRadius: "15px",
    color: "black",
  };
  const arrived = {
    width: "80%",
    height: "100%",
    background: "#fff9e7",
    border: "none",
    borderLeft: "5px solid #fecc3f",
    borderRadius: "15px",
    color: "black",
  };
  const started = {
    width: "80%",
    height: "100%",
    background: "#f0ffea",
    border: "none",
    borderLeft: "5px solid #52d066",
    borderRadius: "15px",
    color: "black",
  };
  const notShow = {
    width: "80%",
    height: "100%",
    background: "#ffebf0",
    border: "none",
    borderLeft: "5px solid #ff4373",
    borderRadius: "15px",
    color: "black",
  };
  const newstye = {
    width: "80%",
    height: "100%",
    background: "#e2e5fd",
    border: "none",
    borderLeft: "5px solid #7d97ff",
    borderRadius: "15px",
    color: "black",
  };

  return (
    <>
      <div className="container-fluid p-4">
        <table
          class="table table-bordered rounded text-center shadow-lg p-3  bg-white rounded"
          style={{
            borderRadius: "15px",
            height: "25rem",
          }}
        >
          <thead className="rounded">
            <tr>
              <td colSpan="5">
                <div className="row d-flex justify-content-evently mt-2">
                  <div className="col-1"></div>
                  <div className="col-2">
                    <span style={{ color: "#d4dbff" }}>
                      <FaSquare />
                    </span>
                    &nbsp; &nbsp;
                    <span>
                      <b>New</b>
                    </span>
                  </div>
                  <div className="col-2">
                    <span style={{ color: "#fecc3f" }}>
                      <FaSquare />
                    </span>
                    &nbsp; &nbsp;
                    <span>
                      <b>Arrived</b>
                    </span>
                  </div>
                  <div className="col-2">
                    <span style={{ color: "#52d066" }}>
                      <FaSquare />
                    </span>
                    &nbsp; &nbsp;
                    <span>
                      <b>Started</b>
                    </span>
                  </div>
                  <div className="col-2">
                    <span style={{ color: "#ff456f" }}>
                      <FaSquare />
                    </span>
                    &nbsp; &nbsp;
                    <span>
                      <b>Not Show</b>
                    </span>
                  </div>
                  <div className="col-2">
                    <span style={{ color: "#bd28e3" }}>
                      <FaSquare />
                    </span>
                    &nbsp; &nbsp;
                    <span>
                      <b>Completed</b>
                    </span>
                  </div>
                  <div className="col-1"></div>
                </div>
              </td>
            </tr>
            <tr>
              <th className="p-4" style={{ background: "#a6c3c7" }}>
                Time
              </th>
              <th className="p-4" style={{ background: "#a6c3c7" }}>
                Rita
              </th>
              <th className="p-4" style={{ background: "#a6c3c7" }}>
                Merlin
              </th>
              <th className="p-4" style={{ background: "#a6c3c7" }}>
                Liam
              </th>
              <th className="p-4" style={{ background: "#a6c3c7" }}>
                John
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3" style={{ background: "#cdd0c9" }}>
                9-10 AM
              </td>
              <td className="p-3">
                <CalenderBookingModel
                  style={completed}
                  name={
                    <>
                      <b>09:30 AM to 10:30 AM</b> <br />
                      <span>1. Men Hairstyle- 1 hr</span>
                    </>
                  }
                />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
            </tr>
            <tr>
              <td className="p-3" style={{ background: "#cdd0c9" }}>
                10-11 PM
              </td>
              <td className="p-3">
                <CalenderBookingModel
                  style={arrived}
                  name={
                    <>
                      <b>11:00 AM to 00:1 PM</b> <br />
                      <span className="text-start">
                        1. Women Hairstyle- 1 hr
                      </span>
                      <br />
                      <span>+2 services</span>
                    </>
                  }
                />
              </td>
              <td className="p-3">
                <CalenderBookingModel
                  style={notShow}
                  name={
                    <>
                      <b>11:00 PM to 12:30 AM</b> <br />
                      <span className="text-start">
                        1. Women Hairstyle- 1 hr
                      </span>
                      <br />
                      <span>+2 services</span>&nbsp;&nbsp;
                    </>
                  }
                />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
            </tr>
            <tr>
              <td className="p-4" style={{ background: "#cdd0c9" }}>
                11-12 PM
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td className="p-4">
                <CalenderBookingModel
                  style={newstye}
                  name={
                    <>
                      <b>11 AM to 12 PM</b> <br />
                      <span className="text-start">1. Men Hairstyle- 1 hr</span>
                      &nbsp;&nbsp;
                    </>
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="p-2" style={{ background: "#cdd0c9" }}>
                12-1 PM
              </td>
              <td className="p-2">
                <AppointmentsCreate />
              </td>
              <td className="p-2">
                <AppointmentsCreate />
              </td>
              <td className="p-2">
                <CalenderBookingModel
                  style={started}
                  name={
                    <>
                      <b>12:00 AM to 2 PM</b> <br />
                      <span className="text-start">
                        1. Women Hairstyle- 1 hr
                      </span>
                      <br />
                      <span>+2 services</span>&nbsp;&nbsp;
                    </>
                  }
                />
              </td>
              <td className="p-2">
                <AppointmentsCreate />
              </td>
            </tr>
            <tr>
              <td className="p-4" style={{ background: "#cdd0c9" }}>
                1-2 PM
              </td>
              <td>
                <AppointmentsCreate />
              </td>
              <td className="p-4">
                <CalenderBookingModel
                  style={newstye}
                  name={
                    <>
                      <b>2 PM to 3 PM</b> <br />
                      <span className="text-start">
                        1. Women Hairstyle- 1 hr
                      </span>
                      &nbsp;&nbsp;
                    </>
                  }
                />
              </td>
              <td>
                <AppointmentsCreate />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Calender;
