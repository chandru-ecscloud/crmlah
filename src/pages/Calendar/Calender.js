import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import axios from "axios";
import CalenderEdit from "./CalenderEdit";
import CalenderAdd from "./CalenderAdd";
import { MdDelete } from "react-icons/md";
import CalenderShow from "./CalenderShow";

function Calendar() {
  const [data, setData] = useState([]);
  console.log("data:", data);
  const [events, setEvents] = useState([]);
  const companyId = sessionStorage.getItem("companyId");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedId, setSelectedId] = useState();

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Transform data into FullCalendar event format
    const formattedEvents = data.map((item) => {
      const [startTime, endTime] = item.appointmentStartTime.split(" - ");

      const startDateTime = new Date(
        `${item.appointmentStartDate}T${startTime}`
      );

      const endDateTime = new Date(`${item.appointmentStartDate}T${endTime}`);

      return {
        id: item.id,
        title: `${item.appointmentName} - ${item.appointmentFor}`, // Concatenate appointmentName and title
        start: startDateTime,
        end: endDateTime,
        allDay: false,
        role: item.appointmentRoleType,
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

  // const handleEventClick = (eventClickInfo) => {
  //   setSelectedEvent(eventClickInfo.event);
  //   setShowViewModal(true);
  // };

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

  // console.log("selectid", selectedId);
  // const handleModalSave = () => {
  //   if (newEvent && newEvent.title) {
  //     const eventToAdd = {
  //       ...newEvent,
  //       id: uuidv4(),
  //       start: newEvent.start.toISOString(), // Convert to ISO string
  //       end: newEvent.end.toISOString(), // Convert to ISO string
  //     };
  //     setEvents([...events, eventToAdd]);
  //     setShowModal(false);
  //     setNewEvent(null);
  //     console.log(
  //       `Added event: ID - ${eventToAdd.id}, Title - ${eventToAdd.title}, Start - ${eventToAdd.start}, End - ${eventToAdd.end}`
  //     );
  //   }
  // };

  // const handleEditModalSave = () => {
  //   if (selectedEvent && selectedEvent.title) {
  //     const updatedEvents = events.map((event) =>
  //       event.id === selectedEvent.id
  //         ? { ...event, title: selectedEvent.title }
  //         : event
  //     );
  //     setEvents(updatedEvents);
  //     setShowEditModal(false);
  //     setSelectedEvent(null);
  //     console.log(
  //       `Updated event: ID - ${selectedEvent.id}, Title - ${selectedEvent.title}, Start - ${selectedEvent.start}, End - ${selectedEvent.end}`
  //     );
  //   }
  // };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const filteredEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvents(filteredEvents);
      try {
        const response = await axios.delete(
          `${API_URL}cancelAppointment/${selectedEvent.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
      setSelectedEvent(null);
      setShowDeleteModal(false);
      fetchData();
      setShowViewModal(false);
      console.log(
        `Deleted event: ID - ${selectedEvent.id}, Title - ${selectedEvent.title}, Start - ${selectedEvent.start}, End - ${selectedEvent.end}`
      );
    }
  };

  const handleEditClick = () => {
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowViewModal(false);
    setShowDeleteModal(true);
  };

  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
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
          //Authorization: `Bearer ${token}`,
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
            // getData();
            toast.success(response.data.message);
            // handleClose();
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
      // console.log("response.data", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(
      `Event dropped: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
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
          //Authorization: `Bearer ${token}`,
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
            // getData();
            toast.success(response.data.message);
            // handleClose();
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
      // console.log("response.data", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(
      `Event resized: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
  };
  const renderEventContent = (eventInfo) => {
    console.log("object", eventInfo);
    return (
      <>
        <strong>{eventInfo.timeText}</strong>
        <span>{eventInfo.event.title}</span>
      </>
    );
  };
  return (
    <div className="calender">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today,prev,next",
          center: "title",
          end: "customMonth,customWeek,customWorkWeek,customDay,customAgenda",
        }}
        height={"90vh"}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
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
        }}
        select={(info) => {
          console.log("Whole Info", info);
          setNewEvent({
            title: "",
            start: info.start, // Use startStr instead of start
            end: info.end, // Use endStr instead of end
            allDay: info.allDay,
          });
          setShowModal(true);
        }}
        eventAdd={handleEventAdd}
        eventClick={handleEventClick}
        eventChange={handleEventUpdate}
        eventRemove={handleEventDelete}
        eventDrop={handleEventDrop} // Handle event drop
        eventResize={handleEventResize} // Attach event resize callback
        eventContent={(eventInfo) => {
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
            backgroundColor = "transparent";
          }

          return (
            <>
              <div
              className="fc-v-event"
                style={{
                  backgroundColor,
                  borderLeft,
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                {event.title}
              </div>
            </>
          );
        }}
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
        setShowViewModal={setShowViewModal}
      />

      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Add Title"
            value={newEvent ? newEvent.title : ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={handleModalSave}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal> */}

      {/* View Event Modal */}
      {/* <Modal
        show={showViewModal}
        size="lg"
        onHide={() => setShowViewModal(false)}
        centered
        scrollable
      >
        <Modal.Header className="Calenderview">
          <div className="">
            <b>
              <h5 className="modal-title">View Event Details</h5>
            </b>
          </div>
          <span className="calenderEdit-icon">
            <CalenderEdit id={selectedId} />
            <button className="btn" onClick={() => setShowDeleteModal(true)}> <MdDelete size={23}/></button>
          </span>
          <span>
         
          </span>

          <button className="btn close" onClick={() => setShowViewModal(false)}>
            <span className="text-light fs-4">X</span>
          </button>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="row">
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* Edit Event Modal */}

      {/* <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Event Title"
            value={selectedEvent ? selectedEvent.title : ""}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, title: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleEditModalSave}
          >
            Update
          </button>
        </Modal.Footer>
      </Modal> */}

      {/* Delete Event Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={handleDeleteEvent}
          >
            Yes
          </button>
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
