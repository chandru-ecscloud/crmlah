import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";

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
    <div className="container">
      <div className="row">
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

  let text = "New";
  let bg = "bg-danger";
  let tasksToMap = newTasks;

  if (status === "Qualified") {
    text = "Qualified";
    bg = "bg-warning";
    tasksToMap = qualifiedTasks;
  } else if (status === "Proposition") {
    text = "Proposition";
    bg = "bg-success";
    tasksToMap = propositionTasks;
  } else if (status === "Won") {
    text = "Won";
    bg = "bg-primary";
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
    <div
      className={`col-md-3 p-3 ${isHovered ? "bg-slate-200" : ""}`}
      ref={drop}
    >
      <Header text={text} bg={bg} count={tasksToMap.length} />
      <div className="bg-light mt-3 " style={{ minHeight: "80vh" }}>
        {tasksToMap.length > 0 &&
          tasksToMap.map((task) => (
            <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
          ))}
      </div>
    </div>
  );
};

const Header = ({ text, count, bg }) => {
  return (
    <div className={`p-3 rounded-md text-uppercase text-sm text-white ${bg}`}>
      {text}
      <span className="badge bg-light text-dark ms-2">{count}</span>
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

  return (
    <div
      ref={drag}
      className={`p-3 mt-3 shadow ${
        isDragging ? "opacity-25" : ""
      } cursor-grab`}
    >
      <p>{task.name}</p>
      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleRemove(task.id)}
      >
        <IoIosRemoveCircleOutline />
      </button>
    </div>
  );
};
