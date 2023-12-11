import React from "react";
import "../../styles/custom.css";
import {
  FaFacebook,
  FaPhoneAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter, FaLocationDot } from "react-icons/fa6";
import { IoIosMailUnread } from "react-icons/io";

function Footer() {
  return (
    <section>
      <div className="d-flex flex-column align-items-center py-2 footerSection">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3 d-flex flex-column justify-content-center">
              <p className="footerHeading mt-3">ECS Cloud Infotech</p>
              <span className="d-flex flex-column">
                <span className="footerContent">
                  <FaPhoneAlt /> &nbsp;&nbsp;(+65) 88941306
                </span>
                <span className="footerContent">
                  <IoIosMailUnread /> &nbsp;&nbsp;sales@ecscloudinfotech.com
                </span>
                <span className="footerContent">
                  <FaLocationDot /> &nbsp;&nbsp;The Alexcier, 237 Alexandra
                  Road, #04-10, Singapore-159929.
                </span>
              </span>
              <span className="d-flex">
                <FaInstagram className="footerIcon" />
                <FaFacebook className="footerIcon" />
                <FaXTwitter className="footerIcon" />
                <FaWhatsapp className="footerIcon" />
              </span>
            </div>

            {/* <div className="col-lg-4 col-md-4 col-12 mb-3 d-flex flex-column justify-content-center">
              <p className="footerHeading mt-3">CloudECS Infotech</p>
              <span className="d-flex flex-column">
                <span className="footerContent">
                  <FaPhoneAlt /> &nbsp;&nbsp;(+91) 9361365818
                </span>
                <span className="footerContent">
                  <IoIosMailUnread /> &nbsp;&nbsp;sales@ecscloudinfotech.com
                </span>
                <span className="footerContent">
                  <FaLocationDot /> &nbsp;&nbsp;766,Sakthi Tower, Tower-2,6th
                  Floor, Anna Salai,Chennai, India-600002.
                </span>
              </span>
              <span className="d-flex">
                <FaInstagram className="footerIcon" />
                <FaFacebook className="footerIcon" />
                <FaXTwitter className="footerIcon" />
                <FaWhatsapp className="footerIcon" />
              </span>
            </div> */}

            <div className="col-lg-3 col-md-3 col-12">
              <p className="footerHeading mt-3">Get Involved</p>
              <span className="d-flex flex-column">
                <span className="footerContent">Product</span>
                <span className="footerContent">Contact Us</span>
              </span>
            </div>

            <div className="col-lg-3 col-md-3 col-12">
              <p className="footerHeading mt-3">Utility</p>
              <span className="d-flex flex-column">
                <span className="footerContent">Style Guide</span>
                <span className="footerContent">Licences</span>
                <span className="footerContent">Password</span>
                <span className="footerContent">404 Page</span>
                <span className="footerContent">Changelog</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-column align-items-center py-3"
        style={{ backgroundColor: "rgba(61, 99, 234, 0.90)", color: "#fff" }}
      >
        <span className="footerCopyrights">copyrignts @ CRMLah </span>
      </div>
    </section>
  );
}

export default Footer;
