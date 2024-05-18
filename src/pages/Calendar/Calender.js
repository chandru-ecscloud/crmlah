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
  const ownerRole = "OWNER";

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAppointmentsByCompanyId/${companyId}`
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
  //   const { event } = eventDropInfo;

  //   const StartDate = new Date(event.start).toISOString().slice(0, 10);
  //   const startTime = new Date(event.start).toLocaleString("en-IN", {
  //     timeZone: "Asia/Kolkata",
  //     hour: "numeric",
  //     minute: "numeric",
  //     hour12: true,
  //   });
  //   const endTime = new Date(event.end).toLocaleString("en-IN", {
  //     timeZone: "Asia/Kolkata",
  //     hour: "numeric",
  //     minute: "numeric",
  //     hour12: true,
  //   });

  //   try {
  //     const response = await axios.get(
  //       `${API_URL}allAppointments/${event.id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       const payload = {
  //         ...response.data,
  //         appointmentStartDate: StartDate,
  //         appointmentStartTime: `${startTime} - ${endTime}`,
  //       };

  //       try {
  //         const updateResponse = await axios.put(
  //           `${API_URL}updateAppointment/${event.id}`,
  //           payload,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         if (updateResponse.status === 200) {
  //           toast.success(updateResponse.data.message);
  //           // Update event in the local state
  //           setEvents((prevEvents) =>
  //             prevEvents.map((e) =>
  //               e.id === event.id
  //                 ? {
  //                     ...e,
  //                     start: event.start,
  //                     end: event.end,
  //                   }
  //                 : e
  //             )
  //           );
  //         } else {
  //           toast.error("Appointment Update Unsuccessful.");
  //         }
  //       } catch (error) {
  //         toast.error("Failed to update appointment: " + error.message);
  //       }
  //     } else {
  //       toast.error("Failed to fetch appointment details.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;

    console.log("Event Start Time:", event.start)
    console.log("Event End Time:", event.end)
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const StartDate = formatDate(event.start);

    // const StartDate = new Date(event.start).toISOString().slice(0, 10);
    const startTime = new Date(event.start).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const endTime = new Date(event.end).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Update events state optimistically
    setEvents((prevEvents) =>
      prevEvents.map((e) =>
        e.id === event.id ? { ...e, start: event.start, end: event.end } : e
      )
    );

    try {
      const response = await axios.get(
        `${API_URL}allAppointments/${event.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const payload = {
          appointmentStartDate: StartDate,
          appointmentEndDate: StartDate,
          appointmentStartTime: `${startTime} - ${endTime}`,
        };
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
          } else {
            toast.error("Appointment Update Unsuccessful.");
            // Revert state if update fails (optional)
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
          // Revert state if update fails (optional)
          setEvents((prevEvents) =>
            prevEvents.map((e) =>
              e.id === event.id
                ? prevEvents.find((prev) => prev.id === event.id)
                : e
            )
          );
        }
      } else {
        toast.error("Failed to fetch appointment details.");
        // Revert state if fetching details fails (optional)
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
      // Revert state if fetching details fails (optional)
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id
            ? prevEvents.find((prev) => prev.id === event.id)
            : e
        )
      );
    }
  };

  const handleEventResize = async (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    const StartDate = new Date(event.start).toISOString().slice(0, 10);
    const startTime = new Date(event.start).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const endTime = new Date(event.end).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    try {
      const response = await axios(`${API_URL}allAppointments/${event.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const payload = {
          ...response.data,
          appointmentStartDate: StartDate,
          appointmentStartTime: `${startTime} - ${endTime}`,
        };
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
          } else {
            toast.error("Appointment Created Unsuccessful.");
          }
        } catch (error) {
          if (error.response?.status === 400) {
            toast.warning(error.response?.data.message);
          } else {
            toast.error(error.response?.data.message);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(
      `Event resized: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
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

  return (
    <div className="calendar">
      <div className="d-flex justify-content-evenly align-items-center py-2">
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
        <div className="px-2 d-flex">
          <div className="d-flex justify-content-evenly align-items-center">
            <span
              className="color-circle"
              style={{ backgroundColor: "#FFD1E3" }}
            ></span>
          </div>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle p-0 border-white ms-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
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
              className="btn dropdown-toggle p-0 border-white ms-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
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
              className="btn dropdown-toggle p-0 border-white ms-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
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
          end: "customMonth,customWeek,customWorkWeek,customDay,customAgenda,resourceTimeline",
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
            resources: true, // Show resources in the timeline
            slotDuration: "01:00", // Adjust slot duration as needed
          },
        }}
        select={(info) => {
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
        }}
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
