// Topbar.js

import React from "react";
import { FaPhoneAlt, FaFacebook, FaInstagram, FaWhatsapp  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "../../styles/custom.css";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="mobileSection">
        <FaPhoneAlt className="icon" />
        <span style={{ marginLeft: "5px" }}> (+65) 88941306</span>
      </div>

      <div className="socialIcons">
        <FaInstagram className="icon" />
        <FaFacebook className="icon" />
        <FaXTwitter className="icon" />
        <FaWhatsapp className="icon" />
      </div>
    </div>
  );
};

export default Topbar;
