import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IoMdTrash } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import {
  MdOutlineLeaderboard,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { GiChampions } from "react-icons/gi";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoMdMailOpen } from "react-icons/io";

// import Women from "../../assets/women 1.jpg";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";

const ListTasks = ({ tasks, setTasks }) => {
  const [newTasks, setNewTasks] = useState([]);
  const [qualifiedTasks, setQualifiedTasks] = useState([]);
  const [propositionTasks, setPropositionTasks] = useState([]);
  const [wonTasks, setWonTasks] = useState([]);
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    if (tasks) {
      const fNewTasks = tasks.filter((task) => task.status === "New");
      const fQualifiedTasks = tasks.filter(
        (task) => task.status === "Qualified"
      );
      const fPropositionTasks = tasks.filter(
        (task) => task.status === "Proposition"
      );
      const fWonTasks = tasks.filter((task) => task.status === "Won");
      setNewTasks(fNewTasks);
      setQualifiedTasks(fQualifiedTasks);
      setPropositionTasks(fPropositionTasks);
      setWonTasks(fWonTasks);
    }
  }, [tasks]);

  const statuses = ["New", "Qualified", "Proposition", "Won"];

  return (
    <div className="container-fluid">
      <div className="row row-container">
        {statuses.map((status, index) => (
          <Section
            key={index}
            status={status}
            tasks={tasks}
            setTasks={setTasks}
            newTasks={newTasks}
            qualifiedTasks={qualifiedTasks}
            propositionTasks={propositionTasks}
            wonTasks={wonTasks}
            isHovered={hoveredSection === status}
            setHoveredSection={setHoveredSection}
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
  qualifiedTasks,
  propositionTasks,
  wonTasks,
  isHovered,
  setHoveredSection,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: (item, monitor) => {
      const hoveredSection = monitor.getItemType();
      setHoveredSection(hoveredSection);
    },
  }));

  let text = "New Lead";
  let bgContainer = "#ffcfcf";
  let tasksToMap = newTasks;

  if (status === "Qualified") {
    text = "Qualified Contacts";
    bgContainer = "#fdffed";
    tasksToMap = qualifiedTasks;
  } else if (status === "Proposition") {
    text = "Proposition(accounts)";
    bgContainer = "#dee7ff";
    tasksToMap = propositionTasks;
  } else if (status === "Won") {
    text = "Won Deals";
    bgContainer = "#deffe3";
    tasksToMap = wonTasks;
  }

  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(mTasks));
      toast.info("Task status changed");
      return mTasks;
    });
  };

  return (
    <div className={`col-md-3`} ref={drop}>
      <Header text={text} count={tasksToMap.length} bgContainer={bgContainer} />
      <div
        className={` pt-3`}
        style={{
          height: "85vh",
          overflow: "auto",
          backgroundColor: isOver ? "#cfefff" : bgContainer,
          border: isOver ? "2px solid #34a6ba" : "none",
        }}
      >
        {tasksToMap.length > 0 &&
          tasksToMap.map((task) => (
            <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
          ))}
      </div>
    </div>
  );
};

const Header = ({ text, count, bgContainer }) => {
  let icons;
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

  return (
    <div
      className={`p-3 d-flex align-items-center justify-content-between rounded-md text-sm text-dark `}
      style={{ backgroundColor: bgContainer }}
    >
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
          <div class={`progress-bar bg-success`} style={{ width: "50%" }}></div>
        </div>
      </p>
      <span className={`badge text-dark ms-2 dragable-heading-count`}>
        <FaPlus />
        &nbsp;
        {count}
      </span>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = (id) => {
    const fTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(fTasks));
    setTasks(fTasks);
    toast("Task removed", { icon: <CiCircleRemove color="red" size={20} /> });
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
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`color p-3 d-flex align-items-center justify-content-between mx-1 cursor-grab`}
    >
      <span>
        <p className="dragable-content-text" style={{ marginBottom: "0px" }}>
          {task.name}
        </p>
        <p className="dragable-content-amount">
          <BsCurrencyDollar className="phone-icons" /> &nbsp; 2000
        </p>
        <p className="dragable-content-amount">
          <FaPhoneAlt className="phone-icons" /> &nbsp; 9941286931
        </p>
        <p className="dragable-content-amount">
          <IoMdMailOpen className="phone-icons" /> &nbsp; chandru@gmail.com
        </p>
      </span>
      <span className="d-flex flex-column align-items-center">
        <span className={`badge rounded-pill ${badgeColor} mb-2`}>
          {badgeText}
        </span>
        <br />
        <button
          className="btn btn-outline-danger px-2 py-1 "
          onClick={() => handleRemove(task.id)}
          style={{
            border: "none",
          }}
        >
          <IoMdTrash />
        </button>
      </span>
    </div>
  );
};
