/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useEffect, useState } from "react";
import "../../../src/styles/custom.css";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";

const TrialNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  console.log("Show Notification", showNotification);
  const [daysLeft, setDaysLeft] = useState(0);
  const closeNotification = () => {
    setShowNotification(false);
  };

  const companyId = sessionStorage.getItem("companyId");

  useEffect(() => {
    const handelTrailEnd = async () => {
      try {
        const response = await axios.get(`${API_URL}trialEndDate/${companyId}`);
        if (response.status === 200) {
          console.log(response.data.trial);
          if (response.data.trial === true) {
            setShowNotification(true);
            setDaysLeft(response.data.daysRemaining);
          }
        }
      } catch (error) {
        toast.error("Error fetching trial data");
      }
    };
    handelTrailEnd();
  }, [companyId]);

  return (
    showNotification && (
      <div className="notification-bar d-flex">
        <marquee>
          *Attention: Your trial version expires in {daysLeft} days! Upgrade to
          the ECSCRM plan now to enjoy uninterrupted service and ensure
          continuous access to all our tools and support. Don’t delay secure
          your upgrade today!
        </marquee>
        <button className="btn upgradebutton">Upgrade Plan</button>
        <button className="close-button" onClick={closeNotification}>
          ×
        </button>
      </div>
    )
  );
};

export default TrialNotification;
