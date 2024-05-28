import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IoMdTrash } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaSearchPlus } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import {
  MdOutlineLeaderboard,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { GiChampions } from "react-icons/gi";
import { IoMdMailOpen } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../Config/URL";

// import Women from "../../assets/women 1.jpg";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import CreateTask from "./CreateTask";

const ListTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [qualifiedTasks, setQualifiedTasks] = useState([]);
  const [propositionTasks, setPropositionTasks] = useState([]);
  const [wonTasks, setWonTasks] = useState([]);
  const [hoveredSection, setHoveredSection] = useState(null);
  const companyId = sessionStorage.getItem("companyId");
  const [search, setSearch] = useState({
    New: "",
    Qualified: "",
    Proposition: "",
    Won: "",
  });
  //  console.log("tasks",tasks)

  const handleSearchChange = (e, status, clear = false) => {
    setSearch({ ...search, [status]: clear ? "" : e.target.value });
  };

  const filteredTasks = (tasks, status) => {
    return tasks.filter(
      (task) =>
        task.name.toLowerCase().startsWith(search[status].toLowerCase()) ||
        task.email.toLowerCase().startsWith(search[status].toLowerCase())
    );
  };

  const fetchLeadData = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${API_URL}allClientsByCompanyId/${companyId}`
      );
      if (response.status === 200) {
        const newTask = response.data.map((client) => ({
          id: client.id,
          name: client.first_name,
          phone: client.phone,
          email: client.email,
          status: "New",
          data: client,
        }));
        setNewTasks(newTask);
        // console.log("newTask",newTask)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchContactData = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${API_URL}allContactsByCompanyId/${companyId}`
      );
      if (response.status === 200) {
        // console.log("apicontact",response.data)

        const newTask = response.data.map((client, i) => ({
          id: client.id,
          name: client.firstName,
          phone: client.phone,
          email: client.email,
          status: "Qualified",
          data: client,
        }));
        setQualifiedTasks(newTask);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAcconutData = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${API_URL}allAccountsByCompanyId/${companyId}`
      );
      if (response.status === 200) {
        // console.log("apiAccount",response.data)
        const newTask = response.data.map((client) => ({
          id: client.id,
          name: client.accountName,
          phone: client.phone,
          email: client.email,
          status: "Proposition",
          data: client,
        }));
        setPropositionTasks(newTask);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDealData = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${API_URL}allDealsByCompanyId/${companyId}`
      );
      if (response.status === 200) {
        // console.log("apideal",response.data)
        const newTasks = response.data.map((client) => ({
          id: client.id,
          name: client.accountName,
          phone: client.phone,
          email: client.email,
          status: "Won",
          data: client,
        }));
        setWonTasks(newTasks);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchLeadData();
    fetchContactData();
    fetchAcconutData();
    fetchDealData();
  }, []);
  // useEffect(() => {
  //   if (tasks) {
  //     const fNewTasks = tasks.filter((task) => task.status === "New");
  //     const fQualifiedTasks = tasks.filter(
  //       (task) => task.status === "Qualified"
  //     );
  //     const fPropositionTasks = tasks.filter(
  //       (task) => task.status === "Proposition"
  //     );
  //     const fWonTasks = tasks.filter((task) => task.status === "Won");
  //     setNewTasks(fNewTasks);
  //     setQualifiedTasks(fQualifiedTasks);
  //     setPropositionTasks(fPropositionTasks);
  //     setWonTasks(fWonTasks);
  //   }
  // }, [tasks]);

  const statuses = ["New", "Qualified", "Proposition", "Won"];

  return (
    <div className="container-fluid">
      <CreateTask
        tasks={tasks}
        setTasks={setTasks}
        handelLeadFetch={fetchLeadData}
      />
      <div className="row row-container">
        {statuses.map((status, index) => (
          <Section
            key={index}
            status={status}
            tasks={tasks}
            fetchLeadData={fetchLeadData}
            fetchContactData={fetchContactData}
            fetchAcconutData={fetchAcconutData}
            fetchDealData={fetchDealData}
            setTasks={setTasks}
            newTasks={newTasks}
            qualifiedTasks={qualifiedTasks}
            propositionTasks={propositionTasks}
            wonTasks={wonTasks}
            isHovered={hoveredSection === status}
            setHoveredSection={setHoveredSection}
            search={search}
            filteredTasks={filteredTasks}
            handleSearchChange={handleSearchChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ListTasks;

const Section = ({
  status,
  tasks,
  setTasks,
  newTasks,
  fetchLeadData,
  fetchContactData,
  fetchAcconutData,
  fetchDealData,
  qualifiedTasks,
  propositionTasks,
  wonTasks,
  isHovered,
  setHoveredSection,
  search,
  filteredTasks,
  handleSearchChange,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => {
      addItemToSection(
        item.id,
        item.status,
        status,
        newTasks,
        qualifiedTasks,
        propositionTasks
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      const hoveredSection = monitor.getItemType();
      setHoveredSection(hoveredSection);
    },
    canDrop: (item) => {
      const dropAllowed =
        item.status === status ||
        (item.status === "New" && status === "Qualified") ||
        (item.status === "Qualified" && status === "Proposition") ||
        (item.status === "Proposition" && status === "Won");
      //  ||
      // (item.status === "Won" && status === "Proposition")
      return dropAllowed;
    },
  }));

  let text = "New Lead";
  // let bgContainer = "#dacffa";
  let tasksToMap = newTasks;

  if (status === "Qualified") {
    text = "Qualified Contacts";
    // bgContainer = "#fdffed";
    tasksToMap = qualifiedTasks;
  } else if (status === "Proposition") {
    text = "Proposition(accounts)";
    // bgContainer = "#dee7ff";
    tasksToMap = propositionTasks;
  } else if (status === "Won") {
    text = "Won Deals";
    // bgContainer = "#deffe3";
    tasksToMap = wonTasks;
  }

  const addItemToSection = async (id, itemStatus, status) => {
    // console.log( id,"id")
    // console.log( itemStatus,"itemStatus")
    // console.log( status,"status")

    if (itemStatus === "New" && status === "Qualified") {
      try {
        const response = await axios.post(
          `${API_URL}leadToContactConvert/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          toast.success(response.data.message);
          fetchLeadData();
          fetchContactData();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
    if (itemStatus === "Qualified" && status === "Proposition") {
      try {
        const response = await axios.post(
          `${API_URL}contactToAccountConvert/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          toast.success(response.data.message);
          fetchContactData();
          fetchAcconutData();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
    if (itemStatus === "Proposition" && status === "Won") {
      try {
        const response = await axios.post(
          `${API_URL}accountToDealConvert/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          toast.success(response.data.message);
          fetchAcconutData();
          fetchDealData();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
  };

  const borderColor = canDrop ? "#34a6ba" : isOver ? "#e23344" : "transparent";
  const border =
    isOver && canDrop
      ? `2px solid ${borderColor}`
      : isOver && !canDrop
      ? "2px solid #e23344 "
      : "none";

  return (
    <div className={`col-md-3`} ref={drop}>
      <Header
        text={text}
        count={tasksToMap.length}
        // bgContainer={bgContainer}
        status={status}
        search={search}
        handleSearchChange={handleSearchChange}
      />
      <div
        className={`pt-2`}
        style={{
          height: "85vh",
          overflow: "auto",
          backgroundColor:
            isOver && canDrop ? "#cfefff" : isOver && !canDrop ? "#f79f8d" : "",
          border: border,
          scrollbarWidth: "none",
          scrollbarColor: "rgba(0,0,0,0.2) rgba(0,0,0,0.1)",
        }}
      >
        {filteredTasks(tasksToMap, status).map((task, index) => (
          <Task key={index} task={task} 
          tasks={tasks}
              setTasks={setTasks}
              fetchLeadData={fetchLeadData}
              fetchContactData={fetchContactData}
              fetchAcconutData={fetchAcconutData}
              fetchDealData={fetchDealData}
              />
        ))}
      </div>
    </div>
  );
};

const Header = ({
  text,
  count,
  bgContainer,
  status,
  search,
  handleSearchChange,
}) => {
  let icons;
  // let progressBarColor;
  switch (text) {
    case "New Lead":
      icons = <FaPlus />;
      break;
    case "Qualified Contacts":
      icons = <MdOutlineLeaderboard />;
      break;
    case "Won Deals":
      icons = <GiChampions />;
      break;
    case "Proposition(accounts)":
      icons = <MdOutlineAccountBalanceWallet />;
      break;
    default:
      icons = null;
  }

  // const percentage = count * 1; // Increase by 10% for each task
  const totalCount = 100; // For example, replace 100 with your total count
  const Count = count; // Replace 25 with your count

  const percentage = (Count / totalCount) * 100;
  const progressBarColor =
    percentage < 25
      ? "bg-danger"
      : percentage < 50
      ? "bg-warning"
      : percentage < 75
      ? "bg-info"
      : "bg-success";

  return (
    <div
      className={` d-flex align-items-center justify-content-between rounded-md text-sm text-dark `}
      style={{ backgroundColor: bgContainer }}
    >
      <span className={`badge text-dark dragable-heading-count mt-2 `}>
        <Dropdown drop="right">
          <Dropdown.Toggle variant="none" id="dropdown-basic">
            <FaSearchPlus />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="px-2"
            style={{ minWidth: "20%", background: "#e3e3e3" }}
          >
            <input
              type="search"
              placeholder={`Search ${status}`}
              value={search[status]}
              onChange={(e) => handleSearchChange(e, status)}
              className="form-control form-control-sm p-0"
            />
          </Dropdown.Menu>
        </Dropdown>
      </span>
      <p className="dragable-heading-text" style={{ width: "60%" }}>
        {icons} {text}
        <div
          class="progress"
          role="progressbar"
          aria-label="Success example"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className={`progress-bar ${progressBarColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </p>
      <span className={`badge text-dark ms-2 dragable-heading-count mt-2 `}>
        <FaPlus />
        &nbsp;
        <span className="fw-bold ">{count}</span>
      </span>
    </div>
  );
};

const Task = ({
  task,
  fetchLeadData,
  fetchContactData,
  fetchAcconutData,
  fetchDealData,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleRemove = async (id, status) => {
    let apiEndpoint = "";
    let fetchFunction = null;

    switch (status) {
      case "New":
        apiEndpoint = "deleteMultipleClientData";
        fetchFunction = fetchLeadData;
        break;
      case "Qualified":
        apiEndpoint = "deleteMultipleContactData";
        fetchFunction = fetchContactData;
        break;
      case "Proposition":
        apiEndpoint = "deleteMultipleAccountData";
        fetchFunction = fetchAcconutData;
        break;
      case "Won":
        apiEndpoint = "deleteMultipleDealData";
        fetchFunction = fetchDealData;
        break;
      default:
        return;
    }

    try {
      const response = await axios.post(
        `${API_URL}${apiEndpoint}`,
        [task.data],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message, {
          icon: <CiCircleRemove color="green" size={20} />,
        });
        if (fetchFunction) fetchFunction();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  let badgeColor;
  let badgeText;

  switch (task.status) {
    case "New":
      badgeColor = "text-bg-info";
      badgeText = "New";
      break;
    case "Qualified":
      badgeColor = "text-bg-warning";
      badgeText = "Qualified";
      break;
    case "Proposition":
      badgeColor = "text-bg-primary";
      badgeText = "Proposition";
      break;
    case "Won":
      badgeColor = "text-bg-success";
      badgeText = "Won";
      break;
    default:
      badgeColor = "";
      badgeText = "";
  }

  return (
    <div
      ref={drag}
      style={{
        border: "1px solid #dcdcdc",
        backgroundColor: "#fff",
        opacity: isDragging ? 1 : 1,
      }}
      className={`color p-3 pb-1 d-flex flex-column mx-2 cursor-grab`}
    >
      <span>
        <p className="dragable-content-text">
          <FaUserTie />
          &nbsp;&nbsp;&nbsp;{task.name}
        </p>
        <p className="dragable-content-amount">
          <IoMdMailOpen /> &nbsp; {task.email}
        </p>
        <p className="dragable-content-amount">
          <FaPhoneAlt /> &nbsp; {task.phone}
        </p>
      </span>
      <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
        <span
          className={`badge rounded-pill ${badgeColor} mb-2`}
          style={{ paddingTop: "6px !important" }}
        >
          {badgeText}
        </span>
        <br />
        <button
          className="btn btn-outline-danger px-2 py-1"
          data-bs-toggle="modal"
          data-bs-target={`#deleteModal-${task.id}`}
          style={{
            border: "none",
          }}
        >
          <IoMdTrash />
        </button>
      </div>

      <div
        className="modal fade"
        id={`deleteModal-${task.id}`}
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold" id="deleteModalLabel">
                Delete Confirmation
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <hr />
            <div className="modal-body p-1 px-3">
              Are you sure you want to delete this item?
            </div>
            <hr />
            <div className="modal-footer p-1">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemove(task.id, task.status)}
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
