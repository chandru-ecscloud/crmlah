import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IoMdTrash } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { FaPhoneAlt } from "react-icons/fa";
import {
  MdOutlineLeaderboard,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { GiChampions } from "react-icons/gi";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoMdMailOpen } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../Config/URL";

// import Women from "../../assets/women 1.jpg";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import CreateTask from "./CreateTask";

const ListTasks = ({ }) => {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [qualifiedTasks, setQualifiedTasks] = useState([]);
  const [propositionTasks, setPropositionTasks] = useState([]);
  const [wonTasks, setWonTasks] = useState([]);
  const [hoveredSection, setHoveredSection] = useState(null);
  const companyId =sessionStorage.getItem("companyId")

//  console.log("tasks",tasks)

 const fetchLeadData = async () => {
  try {
    // setLoading(true);
    const response = await axios.get(
      `${API_URL}allClientsByCompanyId/${companyId}`
    );
    if (response.status === 200) {
      const newTask = response.data.map(client => ({
         id: client.id,
          name: client.first_name,
          phone: client.phone,
          email: client.email,
          status: "New",
          data:client,
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
    if(response.status ===200){
      // console.log("apicontact",response.data)
      
      const newTask = response.data.map((client,i )=> ({
        id: client.id,
        name: client.firstName,
        phone: client.phone,
        email: client.email,
        status: "Qualified",
        data:client
      }));
      setQualifiedTasks(newTask) 
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
    if(response.status ===200){
      // console.log("apiAccount",response.data)
      const newTask = response.data.map(client => ({
        id: client.id,
        name: client.accountName,
        phone: client.phone,
        email: client.email,
        status: "Proposition",
        data:client
      }));
      setPropositionTasks(newTask)
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
    if(response.status ===200){
      // console.log("apideal",response.data)
      const newTasks = response.data.map(client => ({
        id: client.id,
        name: client.accountName,
        phone: client.phone,
        email: client.email,
        status: "Won",
        data:client
      }));
      setWonTasks(newTasks)
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
      <CreateTask tasks={tasks} setTasks={setTasks} handelLeadFetch={fetchLeadData}/>
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
}) => {
  const [{ isOver,canDrop }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => {addItemToSection(item.id,item.status, status, newTasks,qualifiedTasks,propositionTasks);},
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      const hoveredSection = monitor.getItemType();
      setHoveredSection(hoveredSection);
    },
    canDrop: (item) => {
      const dropAllowed = (
        item.status === status ||
        (item.status === "New" && status === "Qualified") ||
        (item.status === "Qualified" && status === "Proposition") ||
        (item.status === "Proposition" && status === "Won")
        //  ||
        // (item.status === "Won" && status === "Proposition")
      );
      return dropAllowed;
    }
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

  const addItemToSection = async(id,itemStatus,status,) => {
    // console.log( id,"id")
    // console.log( itemStatus,"itemStatus")
    // console.log( status,"status")

    if(itemStatus ==="New" && status==="Qualified" ){
      try {
        const response = await axios.post(`${API_URL}leadToContactConvert/${id}`,{
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
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
    if(itemStatus==="Qualified" && status==="Proposition" ){
      try {
        const response = await axios.post(`${API_URL}contactToAccountConvert/${id}`,{
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
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
    if(itemStatus==="Proposition"&&status==="Won" ){
      try {
        const response = await axios.post(`${API_URL}accountToDealConvert/${id}`,{
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
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
  const border = isOver && canDrop ? `2px solid ${borderColor}` :isOver && !canDrop? "2px solid #e23344 " :"none";
  
  return (
    <div className={`col-md-3`} ref={drop}>
      <Header text={text} count={tasksToMap.length} 
      // bgContainer={bgContainer} 
      />
      <div
        className={`pt-2`}
        style={{
          height: "85vh",
          overflow: "auto",
          backgroundColor: isOver && canDrop ? "#cfefff" : isOver && !canDrop? "#f79f8d" : "",
          border: border,
          scrollbarWidth: "none",
          scrollbarColor: "rgba(0,0,0,0.2) rgba(0,0,0,0.1)",
        }}
      >
        {tasksToMap.length > 0 &&
          tasksToMap.map((task) => (
            <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} fetchLeadData={fetchLeadData}
            fetchContactData={fetchContactData}
            fetchAcconutData={fetchAcconutData}
            fetchDealData={fetchDealData}/>
          ))}
      </div>
    </div>
  );
};

const Header = ({ text, count, bgContainer, }) => {
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
    percentage < 25 ? "bg-danger" : percentage < 50 ? "bg-warning" : percentage < 75 ? "bg-info" : "bg-success";

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
          {/* <div class={`progress-bar bg-success`} style={{ width: "50%" }}></div> */}
          <div
            className={`progress-bar ${progressBarColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </p>
      <span className={`badge text-dark ms-2 dragable-heading-count mt-2 `} >
        <FaPlus />
        &nbsp;
        <span className="fw-bold ">{count}</span>
      </span>
    </div>
  );
};

const Task = ({ task, newTasks, fetchLeadData ,fetchContactData,fetchAcconutData,fetchDealData}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  // console.log("object",task)
  const handleRemove = async(id,status) => {
   if(status ==="New"){
      try {
        const response = await axios.post(
          `${API_URL}deleteMultipleClientData`,[task.data],
          {
            headers: {
              "Content-Type": "application/json",
              // //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast(response.data.message, { icon: <CiCircleRemove color="red" size={20} /> });
          fetchLeadData();
          // toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
    if(status ==="Qualified"){
      try {
        const response = await axios.post(
          `${API_URL}deleteMultipleContactData`,[task.data],
          {
            headers: {
              "Content-Type": "application/json",
              // //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast(response.data.message, { icon: <CiCircleRemove color="red" size={20} /> });
          fetchContactData();
          // toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
    if(status ==="Proposition"){
      try {
        const response = await axios.post(
          `${API_URL}deleteMultipleAccountData`,[task.data],
          {
            headers: {
              "Content-Type": "application/json",
              // //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast(response.data.message, { icon: <CiCircleRemove color="red" size={20} /> });
          fetchAcconutData();
          // toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
    if(status ==="Won"){
      try {
        const response = await axios.post(
          `${API_URL}deleteMultipleDealData`,[task.data],
          {
            headers: {
              "Content-Type": "application/json",
              // //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast(response.data.message, { icon: <CiCircleRemove color="red" size={20} /> });
          fetchDealData();
          // toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
    // toast("Task removed", { icon: <CiCircleRemove color="red" size={20} /> });
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
      className={`color p-3 pb-1 d-flex flex-column  mx-2 cursor-grab `}
    >
      <span>
        <p className="dragable-content-text">
          <FaUserTie/>&nbsp;&nbsp;&nbsp;{task.name}
        </p>
        <p className="dragable-content-amount">
          <IoMdMailOpen/> &nbsp; {task.email}
        </p>
        <p className="dragable-content-amount">
          <FaPhoneAlt/> &nbsp; {task.phone}
        </p>
        {/* <p className="dragable-content-amount">
          <BsCurrencyDollar/> &nbsp; {task.amount}
        </p> */}
      </span>
      <div className="d-flex justify-content-between pt-2 pb-1 mt-2">
        <span className={`badge rounded-pill ${badgeColor} mb-2 `} style={{paddingTop: "6px !important"}} >
          {badgeText}
        </span>
        <br />
        <button
          className="btn btn-outline-danger px-2 py-1 "
          onClick={() => handleRemove(task.id,task.status)}
          style={{
            border: "none",
          }}
        >
          <IoMdTrash />
        </button>
      </div>
    </div>
  );
};
