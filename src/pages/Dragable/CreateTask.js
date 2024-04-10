import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "New", // Set status to "New" by default
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.length < 3)
      return toast.error("A task must have more than 3 characters");
    if (task.name.length > 100)
      return toast.warning("A task must not be more than 100 characters");

    // Ensure tasks is initialized as an array
    const newList = Array.isArray(tasks) ? [...tasks, task] : [task];

    setTasks(newList);
    localStorage.setItem("tasks", JSON.stringify(newList));
    toast.success("Task Created");

    setTask({
      id: "",
      name: "",
      status: "New", // Set status to "New" for the next task creation
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task name"
          value={task.name}
          onChange={(e) =>
            setTask({ ...task, id: uuidv4(), name: e.target.value })
          }
        />
        <button className="btn btn-success" type="submit">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateTask;
