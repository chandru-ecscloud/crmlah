import React from "react";
import AppointmentsCreate from "./AppointmentsModel";
import { FaSquare } from "react-icons/fa";

function Calender() {
  return (
    <>
      <div className="container-fluid p-4">
        <table
          class="table table-bordered calender-table rounded text-center shadow-lg p-3  bg-white rounded"
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
            <tr className="table-info">
              <th className="p-4">Time</th>
              <th className="p-4">Rita</th>
              <th className="p-4">Merlin</th>
              <th className="p-4">Liam</th>
              <th className="p-4">John</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3" style={{ background: "#fff3cd" }}>
                <b>9-10 AM</b>
              </td>
              <td className="p-3">
                <button
                  className="py-2"
                  style={{
                    width: "80%",
                    height: "100%",
                    background: "#f2eafe",
                    border: "none",
                    borderLeft: "5px solid #bd28e3",
                    borderRadius: "5px",
                    color: "black",
                  }}
                >
                  <b>09:30 AM to 10:30 AM</b> <br />
                  <span>1. Men Hairstyle- 1 hr</span>&nbsp;&nbsp;
                </button>
              </td>
              <td className="p-3">
                <AppointmentsCreate />
              </td>
              <td className="p-3">
                <AppointmentsCreate />
              </td>
              <td className="p-3">
                <AppointmentsCreate />
              </td>
            </tr>
            <tr>
              <td className="p-3" style={{ background: "#fff3cd" }}>
                <b>10-11 PM</b>
              </td>
              <td className="p-3">
                <button
                  className="py-2"
                  style={{
                    width: "80%",
                    height: "100%",
                    background: "#fff9e7",
                    border: "none",
                    borderLeft: "5px solid #fecc3f",
                    borderRadius: "5px",
                    color: "black",
                  }}
                >
                  <b>11:00 AM to 00:1 PM</b> <br />
                  <span className="text-start">1. Women Hairstyle- 1 hr</span>
                  <br />
                  <span>+2 services</span>&nbsp;&nbsp;
                </button>
              </td>
              <td className="p-3">
                <button
                  className="py-2"
                  style={{
                    width: "80%",
                    height: "100%",
                    background: "#ffebf0",
                    border: "none",
                    borderLeft: "5px solid #ff4373",
                    borderRadius: "5px",
                    color: "black",
                  }}
                >
                  <b>11:00 PM to 12:30 AM</b> <br />
                  <span className="text-start">1. Women Hairstyle- 1 hr</span>
                  <br />
                  <span>+2 services</span>&nbsp;&nbsp;
                </button>
              </td>
              <td className="p-3">
                <AppointmentsCreate />
              </td>
              <td className="p-3">
                <AppointmentsCreate />
              </td>
            </tr>
            <tr>
              <td className="p-4" style={{ background: "#fff3cd" }}>
                <b>11-12 PM</b>
              </td>
              <td className="p-4">
                <AppointmentsCreate />
              </td>
              <td className="p-4">
                <AppointmentsCreate />
              </td>
              <td className="p-4">
                <AppointmentsCreate />
              </td>
              <td className="p-4">
                <button
                  className="py-2"
                  style={{
                    width: "80%",
                    height: "100%",
                    background: "#e2e5fd",
                    border: "none",
                    borderLeft: "5px solid gray",
                    borderRadius: "5px",
                    color: "black",
                  }}
                >
                  <b>11 AM to 12 PM</b> <br />
                  <span className="text-start">1. Men Hairstyle- 1 hr</span>
                  &nbsp;&nbsp;
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-2" style={{ background: "#fff3cd" }}>
                <b>12-1 PM</b>
              </td>
              <td className="p-2">
                <AppointmentsCreate />
              </td>
              <td className="p-2">
                <AppointmentsCreate />
              </td>
              <td className="p-2">
                <button
                  className="py-2"
                  style={{
                    width: "80%",
                    height: "100%",
                    background: "#f0ffea",
                    border: "none",
                    borderLeft: "5px solid #52d066",
                    borderRadius: "5px",
                    color: "black",
                  }}
                >
                  <b>12:00 AM to 2 PM</b> <br />
                  <span className="text-start">1. Women Hairstyle- 1 hr</span>
                  <br />
                  <span>+2 services</span>&nbsp;&nbsp;
                </button>
              </td>
              <td className="p-2">
                <AppointmentsCreate />
              </td>
            </tr>
            <tr>
              <td className="p-4" style={{ background: "#fff3cd" }}>
                <b>1-2 PM</b>
              </td>
              <td className="p-4">
                <AppointmentsCreate />
              </td>
              <td className="p-4">
                <button
                  className="py-2"
                  style={{
                    width: "80%",
                    height: "100%",
                    background: "#e2e5fd",
                    border: "none",
                    borderLeft: "5px solid #7d97ff",
                    borderRadius: "5px",
                    color: "black",
                  }}
                >
                  <b>2 PM to 3 PM</b> <br />
                  <span className="text-start">1. Women Hairstyle- 1 hr</span>
                  &nbsp;&nbsp;
                </button>
              </td>
              <td className="p-4">
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
