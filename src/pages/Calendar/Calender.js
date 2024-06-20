import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline"; // Import the resource timeline plugin
import { Modal, Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import axios from "axios";
import CalenderAdd from "./CalenderAdd";
import CalenderShow from "./CalenderShow";

function Calendar() {
  const [data, setData] = useState([]);
  const [appointmentRoles, setAppointmentRole] = useState([]);
  // console.log("appointmentRoles:", appointmentRoles);
  const [companyUser, setCompanyUser] = useState([]);
  // console.log("companyUser:", companyUser);
  const [events, setEvents] = useState([]);
  const companyId = sessionStorage.getItem("companyId");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedId, setSelectedId] = useState();
  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");
  const appointmentRole = sessionStorage.getItem("appointmentRole");
  // console.log(role)

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAppointmentDetailsByUserId/${userId}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  const fetchRoleBasedAppointment = async (appointmentBasedRole) => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAppointmentsByCompanyIdAndAppointmentRole/${companyId}?roleType=${appointmentBasedRole}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  const fetchAppointmentByUserId = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAppointmentInfoByUserId/${id}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  const fetchAppoitmentData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAppointmentWithKeyRolesByCompanyId/${companyId}`
      );
      setAppointmentRole(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  const AppointmentWithOutKeyRolesByCompanyId = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAppointmentWithOutKeyRolesByCompanyId/${companyId}`
      );
      const transformedData = response.data.map((item) => ({
        id: item.id,
        title: item.name,
        role: item.appointmentRoleType,
      }));
      setCompanyUser(transformedData);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAppoitmentData();
    AppointmentWithOutKeyRolesByCompanyId();
  }, []);

  useEffect(() => {
    const formattedEvents = data.map((item) => {
      const [startTime, endTime] = item.appointmentStartTime.split(" - ");
      const startDateTime = new Date(
        `${item.appointmentStartDate}T${startTime}`
      );
      const endDateTime = new Date(`${item.appointmentStartDate}T${endTime}`);

      return {
        id: item.id,
        title: `${item.appointmentName} - ${item.appointmentFor}`,
        start: startDateTime,
        end: endDateTime,
        allDay: false,
        role: item.appointmentRoleType,
        email: item.email,
        resourceId: item.userId, // Assume that the data includes an employeeId field
      };
    });

    setEvents(formattedEvents);
  }, [data]);

  const handleEventAdd = (eventAddInfo) => {
    const { event } = eventAddInfo;
    const newEventWithId = { ...event, id: uuidv4() };
    setEvents([...events, newEventWithId]);
    console.log(
      `Added event: ID - ${newEventWithId.id}, Title - ${newEventWithId.title}, Start - ${newEventWithId.start}, End - ${newEventWithId.end}`
    );
  };

  const handleEventUpdate = (eventUpdateInfo) => {
    const { event } = eventUpdateInfo;
    const updatedEvent = { ...event, id: event.id };
    console.log(
      `Updated event: ID - ${updatedEvent.id}, Title - ${updatedEvent.title}, Start - ${updatedEvent.start}, End - ${updatedEvent.end}`
    );
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleEventDelete = (eventDeleteInfo) => {
    const { event } = eventDeleteInfo;
    const filteredEvents = events.filter((e) => e.id !== event.id);
    setEvents(filteredEvents);
    console.log(
      `Deleted event: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
  };

  const handleEventClick = (eventClickInfo) => {
    setSelectedEvent(eventClickInfo.event);
    const { event } = eventClickInfo;
    const filteredEvents = events.filter((e) => e.id !== event.id);
    setSelectedId(event.id);

    setEvents(filteredEvents);
    console.log(
      `View event: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
    setShowViewModal(true);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const filteredEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvents(filteredEvents);
      try {
        const response = await axios.delete(
          `${API_URL}deleteAppointment/${selectedEvent.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          setSelectedEvent(null);
          setShowDeleteModal(false);
          fetchData();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  // const handleEventDrop = async (eventDropInfo) => {
  //   const { event, newResource } = eventDropInfo;
  //   if (!event.end) {
  //     event.setEnd(new Date(event.start.getTime() + 60 * 60 * 1000)); // Default 1 hour duration
  //   }
  //   console.log("event>=", event);
  //   const convertTo12Hour = (timeString) => {
  //     const [hour, minute] = timeString.split(":");
  //     let hour12 = hour % 12 || 12; // Convert hour from 24-hour to 12-hour format
  //     hour12 = String(hour12).padStart(2, "0"); // Pad single-digit hours with leading zero
  //     const period = hour < 12 ? "AM" : "PM";
  //     return `${hour12}:${minute} ${period}`;
  //   };

  //   const startDateTime = event.startStr;
  //   const endDateTime = event.endStr;

  //   const startDate = startDateTime.substring(0, 10);
  //   const endDate = endDateTime.substring(0, 10);

  //   const startTime24 = startDateTime.substring(11, 19);
  //   const endTime24 = endDateTime.substring(11, 19);

  //   const startTime12 = convertTo12Hour(startTime24);
  //   const endTime12 = convertTo12Hour(endTime24);

  //   const currentDate = new Date();
  //   currentDate.setHours(0, 0, 0, 0);

  //   const newStart = new Date(event.start);
  //   newStart.setHours(0, 0, 0, 0);

  //   if (newStart < currentDate) {
  //     toast.warning('Cannot drop the event in the past.');
  //     eventDropInfo.revert();
  //     return;
  //   }
  //   const email = event.extendedProps.email || null;
  //   try {
  //     let payload = {
  //       appointmentStartDate: startDate,
  //       appointmentEndDate: endDate,
  //       appointmentStartTime: `${startTime12} - ${endTime12}`,
  //       appointmentstatus: "RESCHEDULED",
  //       email:email
  //     };

  //     if (newResource) {
  //       const updaterole = newResource._resource.extendedProps.role || null;
  //       const updateroleId = newResource.id;
  //       // if (updaterole !== "GENERAL") {
  //       payload.appointmentRoleType = updaterole;
  //       payload.userId = updateroleId;
  //       // }
  //     }

  //     console.log("Payload is", payload);
  //     try {
  //       const updateResponse = await axios.put(
  //         `${API_URL}updateAppointment/${event.id}`,
  //         payload,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (updateResponse.status === 200) {
  //         toast.success(updateResponse.data.message);
  //         fetchData();
  //       } else {
  //         toast.error("Appointment Update Unsuccessful.");
  //         // Revert state if update fails (optional)
  //         setEvents((prevEvents) =>
  //           prevEvents.map((e) =>
  //             e.id === event.id
  //               ? prevEvents.find((prev) => prev.id === event.id)
  //               : e
  //           )
  //         );
  //       }
  //     } catch (error) {
  //       toast.error("Failed to update appointment: " + error.message);
  //       // Revert state if update fails (optional)
  //       setEvents((prevEvents) =>
  //         prevEvents.map((e) =>
  //           e.id === event.id
  //             ? prevEvents.find((prev) => prev.id === event.id)
  //             : e
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const handleEventDrop = async (eventDropInfo) => {
    const { event, newResource } = eventDropInfo;
    if (!event.end) {
      event.setEnd(new Date(event.start.getTime() + 60 * 60 * 1000)); // Default 1 hour duration
    }
    console.log("event>=", event);

    const convertTo12Hour = (timeString) => {
      const [hour, minute] = timeString.split(":");
      let hour12 = hour % 12 || 12; // Convert hour from 24-hour to 12-hour format
      hour12 = String(hour12).padStart(2, "0"); // Pad single-digit hours with leading zero
      const period = hour < 12 ? "AM" : "PM";
      return `${hour12}:${minute} ${period}`;
    };

    const startDateTime = event.startStr;
    const endDateTime = event.endStr;

    const startDate = startDateTime.substring(0, 10);
    const endDate = endDateTime.substring(0, 10);

    const startTime24 = startDateTime.substring(11, 19);
    const endTime24 = endDateTime.substring(11, 19);

    const startTime12 = convertTo12Hour(startTime24);
    const endTime12 = convertTo12Hour(endTime24);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const newStart = new Date(event.start);
    newStart.setHours(0, 0, 0, 0);

    if (newStart < currentDate) {
      toast.warning("Cannot drop the event in the past.");
      eventDropInfo.revert();
      return;
    }

    const email = event.extendedProps.email || "";
    const appointmentOwner = event.extendedProps.owner || "Your Company"; // Adjust accordingly
    const appointmentName = event.extendedProps.name || "Appointment"; // Adjust accordingly

    try {
      let payload = {
        appointmentStartDate: startDate,
        appointmentEndDate: endDate,
        appointmentStartTime: `${startTime12} - ${endTime12}`,
        appointmentstatus: "RESCHEDULED",
        email: email,
      };

      if (newResource) {
        const updaterole = newResource._resource.extendedProps.role || null;
        const updateroleId = newResource.id;
        payload.appointmentRoleType = updaterole;
        payload.userId = updateroleId;
      }

      console.log("Payload is", payload);

      try {
        const updateResponse = await axios.put(
          `${API_URL}updateAppointment/${event.id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (updateResponse.status === 200) {
          toast.success(updateResponse.data.message);
          fetchData();

          // Sending email after successful update
          const mailContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Appointment Confirmation</title>
              <style>
                body {
                  background-color: #ddd;
                }
                .invoice-box {
                  font-size: 12px;
                  max-width: 600px;
                  background-color: #fff;
                  margin: auto;
                  padding: 30px;
                  border-bottom: 3px solid #0059ff;
                  line-height: 24px;
                  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                  color: #555;
                  min-height: 85vh;
                }
                .invoice-box table {
                  width: 100%;
                  line-height: inherit;
                  text-align: left;
                }
                .invoice-box table td {
                  padding: 5px;
                  vertical-align: top;
                }
                .invoice-box table td.third {
                  text-align: right;
                }
                .invoice-box table tr.heading td {
                  background: #eee;
                  border-bottom: 1px solid #ddd;
                  font-weight: bold;
                }
                .invoice-box table tr.item td {
                  border-bottom: 1px solid #eee;
                }
                .invoice-box table tr.item.last td {
                  border-bottom: none;
                }
                .invoice-box table tr.total td:nth-child(2) {
                  border-top: 2px solid #eee;
                  font-weight: bold;
                }
                .invoice {
                  padding: 1rem;
                }
                #scan {
                  float: right;
                }
                #scan img {
                  max-width: 100%;
                  height: auto;
                }
                @media print {
                  .invoice-box {
                    border: 0;
                  }
                }
              </style>
            </head>
            <body>
              <div class="invoice-box">
                <table>
                  <tr class="top">
                    <td colspan="2">
                      <table>
                        <tr>
                          <td class="title">
                            <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png" style="width: 75%; max-width: 180px" alt="Logo" />
                          </td>
                          <td class="third">
                            <b>Date:</b> ${new Date().toLocaleDateString()}<br />
                            The Alexcier, 237 Alexandra Road,<br />
                            #04-10, Singapore-159929.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <div class="invoice">
                  <h1 style="color: black;">Hi, ${appointmentOwner}</h1>
                  <p style="margin: 2rem 0 0;">
                    You've Scheduled An Appointment With ${appointmentOwner} for ${appointmentName} On ${startDate} at ${startTime12} - ${endTime12}
                    <br />(Asia/Singapore).
                  </p>
                  <h3 style="margin-bottom: 0;">Location details:</h3>
                  <h4 style="margin:0;">${
                    event.extendedProps.location || ""
                  }</h4>
                  <p style="margin: 1.5rem 0px 2rem 0px;"
                  >You Can Still <span><a href="https://crmlah.com/reschedule/index.html?id=${
                    event.id
                  }">Reschedule or Cancel</a> Your Appointment</p>     
                  <hr />
                  <p style="margin: 2rem 0 0;">See You Soon,</p>
                  <h4 style="margin: 0;">${appointmentOwner}</h4>
                  <p style="margin: 0;">ECS Cloud</p>
                  <p style="margin: 0 0 2rem 0;">Powered by ECS</p>
                  <hr />
                </div>
              </div>
            </body>
            </html>`;

          try {
            await axios.post(`${API_URL}sendMail`, {
              fromMail: email,
              toMail: email,
              subject: `Appointment Confirmation - ${appointmentName}`,
              htmlContent: mailContent,
            });
            toast.success("Email sent successfully.");
          } catch (emailError) {
            toast.error("Failed to send email: " + emailError.message);
          }
        } else {
          toast.error("Appointment Update Unsuccessful.");
          setEvents((prevEvents) =>
            prevEvents.map((e) =>
              e.id === event.id
                ? prevEvents.find((prev) => prev.id === event.id)
                : e
            )
          );
        }
      } catch (error) {
        toast.error("Failed to update appointment: " + error.message);
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === event.id
              ? prevEvents.find((prev) => prev.id === event.id)
              : e
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEventResize = async (eventResizeInfo) => {
    const { event } = eventResizeInfo;

    const convertTo12Hour = (timeString) => {
      const [hour, minute] = timeString.split(":");
      let hour12 = hour % 12 || 12; // Convert hour from 24-hour to 12-hour format
      hour12 = String(hour12).padStart(2, "0"); // Pad single-digit hours with leading zero
      const period = hour < 12 ? "AM" : "PM";
      return `${hour12}:${minute} ${period}`;
    };

    const startDateTime = event.startStr;
    const endDateTime = event.endStr;

    const startDate = startDateTime.substring(0, 10);
    const endDate = endDateTime.substring(0, 10);

    const startTime24 = startDateTime.substring(11, 19);
    const endTime24 = endDateTime.substring(11, 19);

    const startTime12 = convertTo12Hour(startTime24);
    const endTime12 = convertTo12Hour(endTime24);

    const email = event.extendedProps.email || "";
    const appointmentOwner = event.extendedProps.owner || "Your Company"; // Adjust accordingly
    const appointmentName = event.extendedProps.name || "Appointment"; // Adjust accordingly

    try {
      const payload = {
        appointmentStartDate: startDate,
        appointmentEndDate: endDate,
        appointmentStartTime: `${startTime12} - ${endTime12}`,
        appointmentstatus: "RESCHEDULED",
        email: email,
      };

      // console.log("Event Resize Payload is", payload);
      try {
        const response = await axios.put(
          `${API_URL}updateAppointment/${event.id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchData();
          // Sending email after successful update
          const mailContent = `
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <title>Appointment Confirmation</title>
         <style>
           body {
             background-color: #ddd;
           }
           .invoice-box {
             font-size: 12px;
             max-width: 600px;
             background-color: #fff;
             margin: auto;
             padding: 30px;
             border-bottom: 3px solid #0059ff;
             line-height: 24px;
             font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
             color: #555;
             min-height: 85vh;
           }
           .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
           }
           .invoice-box table td {
             padding: 5px;
             vertical-align: top;
           }
           .invoice-box table td.third {
             text-align: right;
           }
           .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
           }
           .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
           }
           .invoice-box table tr.item.last td {
             border-bottom: none;
           }
           .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
           }
           .invoice {
             padding: 1rem;
           }
           #scan {
             float: right;
           }
           #scan img {
             max-width: 100%;
             height: auto;
           }
           @media print {
             .invoice-box {
               border: 0;
             }
           }
         </style>
       </head>
       <body>
         <div class="invoice-box">
           <table>
             <tr class="top">
               <td colspan="2">
                 <table>
                   <tr>
                     <td class="title">
                       <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png" style="width: 75%; max-width: 180px" alt="Logo" />
                     </td>
                     <td class="third">
                       <b>Date:</b> ${new Date().toLocaleDateString()}<br />
                       The Alexcier, 237 Alexandra Road,<br />
                       #04-10, Singapore-159929.
                     </td>
                   </tr>
                 </table>
               </td>
             </tr>
           </table>
           <div class="invoice">
             <h1 style="color: black;">Hi, ${appointmentOwner}</h1>
             <p style="margin: 2rem 0 0;">
               You've Rescheduled An Appointment With ${appointmentOwner} for ${appointmentName} On ${startDate} at ${startTime12} - ${endTime12}
               <br />(Asia/Singapore).
             </p>
             <h3 style="margin-bottom: 0;">Location details:</h3>
             <h4 style="margin:0;">${event.extendedProps.location || ""}</h4>
             <p style="margin: 1.5rem 0px 2rem 0px;"
             >You Can Still <span><a href="https://crmlah.com/reschedule/index.html?id=${
               event.id
             }">Reschedule or Cancel</a> Your Appointment</p>     
             <hr />
             <p style="margin: 2rem 0 0;">See You Soon,</p>
             <h4 style="margin: 0;">${appointmentOwner}</h4>
             <p style="margin: 0;">ECS Cloud</p>
             <p style="margin: 0 0 2rem 0;">Powered by ECS</p>
             <hr />
           </div>
         </div>
       </body>
       </html>`;

          try {
            await axios.post(`${API_URL}sendMail`, {
              fromMail: email,
              toMail: email,
              subject: `Appointment Rescheduled - ${appointmentName}`,
              htmlContent: mailContent,
            });
            toast.success("Email sent successfully.");
          } catch (emailError) {
            toast.error("Failed to send email: " + emailError.message);
          }
        } else {
          toast.error("Appointment Rescheduling Unsuccessful.");
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.warning(error.response?.data.message);
        } else {
          toast.error(error.response?.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const role = event.extendedProps.role;

    let backgroundColor;
    let borderLeft;

    if (role === "OWNER") {
      backgroundColor = "#BFF6C3";
      borderLeft = "4px solid #40A578";
    } else if (role === "SALES_MANAGER") {
      backgroundColor = "#FFD1E3";
      borderLeft = "4px solid #9F0D7F";
    } else if (role === "SALES_EXECUTIVE") {
      backgroundColor = "#FFDDCC";
      borderLeft = "4px solid #C51605";
    } else if (role === "FREELANCERS") {
      backgroundColor = "#FFE79B";
      borderLeft = "4px solid #E7B10A";
    } else {
      backgroundColor = "#F8F4E1";
      borderLeft = "4px solid #AF8F6F";
    }
    return (
      <div
        className="fc-v-event"
        style={{
          backgroundColor,
          borderLeft,
          height: "100%",
          padding: "5px",
          borderRadius: "5px",
          color: "black",
        }}
      >
        <span>{event.title}</span>
      </div>
    );
  };

  const handleDateSelect = (info) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(info.start);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate >= currentDate) {
      const resourceId = info.resource ? info.resource.id : null;
      const role =
        info.resource && info.resource.extendedProps
          ? info.resource.extendedProps.role
          : null;
      setNewEvent({
        title: "",
        start: info.start,
        end: info.end,
        allDay: info.allDay,
        resourceId: resourceId,
        role: role,
      });
      setShowModal(true);
    } else {
      toast.warning("Cannot select a past date for events.");
    }
  };

  return (
    <div className="calendar">
      {!(
        appointmentRole === "SALES_EXECUTIVE" ||
        appointmentRole === "GENERAL" ||
        appointmentRole === "FREELANCERS"
      ) && (
        <div className="d-flex justify-content-evenly align-items-center py-2">
          <div className="px-2 d-flex">
            <button
              onClick={() => fetchData()}
              className="btn btn-white shadow-none border-white"
            >
              All
            </button>
          </div>
          {appointmentRole !== "SALES_MANAGER" && (
            <div className="px-2 d-flex">
              <div className="d-flex justify-content-evenly align-items-center">
                <span
                  className="color-circle"
                  style={{ backgroundColor: "#BFF6C3" }}
                ></span>
              </div>
              <button
                onClick={() => fetchRoleBasedAppointment("OWNER")}
                className="btn btn-white shadow-none border-white"
              >
                Owner
              </button>
            </div>
          )}
          <div className="px-2 d-flex">
            <div className="d-flex justify-content-evenly align-items-center">
              <span
                className="color-circle"
                style={{ backgroundColor: "#FFD1E3" }}
              ></span>
            </div>
            <div className="dropdown">
              <button
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className="btn dropdown-toggle p-0 border-white ms-2"
              >
                Sales Manager
              </button>
              <ul className="dropdown-menu usersCalendor">
                <li
                  className="dropdown-item"
                  onClick={() => fetchRoleBasedAppointment("SALES_MANAGER")}
                >
                  All
                </li>
                {appointmentRoles?.SALES_MANAGER?.map((role) => (
                  <li
                    key={role.id}
                    className="dropdown-item"
                    onClick={() => fetchAppointmentByUserId(role.id)}
                  >
                    {role.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="px-2 d-flex">
            <div className="d-flex justify-content-evenly align-items-center">
              <span
                className="color-circle"
                style={{ backgroundColor: "#FFDDCC" }}
              ></span>
            </div>
            <div className="dropdown">
              <button
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className="btn dropdown-toggle p-0 border-white ms-2"
              >
                Sales Executive
              </button>
              <ul className="dropdown-menu usersCalendor">
                <li
                  className="dropdown-item"
                  onClick={() => fetchRoleBasedAppointment("SALES_EXECUTIVE")}
                >
                  All
                </li>
                {appointmentRoles?.SALES_EXECUTIVE?.map((role) => (
                  <li
                    key={role.id}
                    className="dropdown-item"
                    onClick={() => fetchAppointmentByUserId(role.id)}
                  >
                    {role.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="px-2 d-flex">
            <div className="d-flex justify-content-evenly align-items-center">
              <span
                className="color-circle"
                style={{ backgroundColor: "#FFE79B" }}
              ></span>
            </div>
            <div className="dropdown">
              <button
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                className="btn dropdown-toggle p-0 border-white ms-2"
              >
                Freelancers
              </button>
              <ul className="dropdown-menu usersCalendor">
                <li
                  className="dropdown-item"
                  onClick={() => fetchRoleBasedAppointment("FREELANCERS")}
                >
                  All
                </li>
                {appointmentRoles?.FREELANCERS?.map((role) => (
                  <li
                    key={role.id}
                    className="dropdown-item"
                    onClick={() => fetchAppointmentByUserId(role.id)}
                  >
                    {role.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="px-2 d-flex">
            <div className="d-flex justify-content-evenly align-items-center">
              <span
                className="color-circle"
                style={{ backgroundColor: "#F8F4E1" }}
              ></span>
            </div>
            <button
              onClick={() => fetchRoleBasedAppointment("GENERAL")}
              className="btn btn-white shadow-none border-white"
            >
              General
            </button>
          </div>
        </div>
      )}

      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          resourceTimelinePlugin,
        ]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today,prev,next",
          center: "title",
          end: `${
            appointmentRole === "OWNER"
              ? "customMonth,customWeek,customWorkWeek,customDay,customAgenda,resourceTimeline"
              : "customMonth,customWeek,customWorkWeek,customDay,customAgenda"
          }`,
        }}
        height={"90vh"}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        resources={companyUser}
        views={{
          customWorkWeek: {
            type: "timeGridWeek",
            duration: { weeks: 1 },
            buttonText: "Work Week",
            hiddenDays: [0, 6],
          },
          customAgenda: {
            type: "listWeek",
            buttonText: "Agenda",
          },
          customDay: {
            type: "timeGridDay",
            buttonText: "Day",
          },
          customWeek: {
            type: "timeGridWeek",
            buttonText: "Week",
          },
          customMonth: {
            type: "dayGridMonth",
            buttonText: "Month",
          },
          resourceTimeline: {
            type: "resourceTimeline",
            buttonText: "Timeline",
            resources: true,
            slotDuration: "01:00",
          },
        }}
        // select={(info) => {
        //   const resourceId = info.resource ? info.resource.id : null;
        //   const role =
        //     info.resource && info.resource.extendedProps
        //       ? info.resource.extendedProps.role
        //       : null;
        //   setNewEvent({
        //     title: "",
        //     start: info.start,
        //     end: info.end,
        //     allDay: info.allDay,
        //     resourceId: resourceId,
        //     role: role,
        //   });
        //   setShowModal(true);
        // }}
        select={handleDateSelect}
        eventAdd={handleEventAdd}
        eventClick={handleEventClick}
        eventChange={handleEventUpdate}
        eventRemove={handleEventDelete}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventContent={renderEventContent}
      />

      {/* Add Event Modal */}
      <CalenderAdd
        showModal={showModal}
        getData={fetchData}
        setShowModal={setShowModal}
        name={"Create Appointment"}
        eventData={newEvent}
      />

      <CalenderShow
        id={selectedId}
        showViewModal={showViewModal}
        showEditModal={showEditModal}
        setShowViewModal={setShowViewModal}
        setShowEditModal={setShowEditModal}
        setShowDeleteModal={setShowDeleteModal}
        getData={fetchData}
      />

      {/* Delete Event Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Delete</b>
          </Modal.Title>
        </Modal.Header>
        <hr style={{ margin: "0px" }} />
        <Modal.Body>
          <b className="text-secondary">Are you sure you want to delete?</b>
        </Modal.Body>
        <hr style={{ margin: "0px" }} />
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
