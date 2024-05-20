/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  FaPhoneAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter, FaLocationDot } from "react-icons/fa6";
import { IoIosMailUnread, IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Footer() {
  return (
    <div className="container-fluid " style={{ backgroundColor: "#f7ffff" }}>
      <div className="p-3">
        <div className="row">
          {/* <div>
            <span className="d-flex justify-content-center gap-3 my-3">
              <RiInstagramFill size={30} />
              <FaFacebookF size={30} />
              <FaLinkedinIn size={30} />
              <IoLogoWhatsapp size={30} />
              <FaYoutube size={30} />
            </span>
          </div> */}

          <div className="col-lg-3 col-md-3 col-12 mb-3 d-flex flex-column justify-content-center">
            <h6 className=" mt-3 fw-bold">ECS Cloud Infotech</h6>
            <span className="d-flex flex-column my-2 ">
              <span className="footerContent mb-2 ">
                <FaPhoneAlt /> &nbsp;&nbsp;(+65) 88941306
              </span>
              <span className="footerContent mb-2 ">
                <IoIosMailUnread /> &nbsp;&nbsp;sales@ecscloudinfotech.com
              </span>
              <span className="footerContent mb-2 ">
                <FaLocationDot /> &nbsp;&nbsp;The Alexcier, 237 Alexandra Road,
                #04-10, Singapore-159929.
              </span>
            </span>
            {/* <span className="d-flex">
            <FaInstagram className="footerIcon" />
            <FaFacebook className="footerIcon" />
            <FaXTwitter className="footerIcon" />
            <FaWhatsapp className="footerIcon" />
          </span> */}
          </div>

          <div className="col-lg-3 col-md-3 col-12 mb-3 d-flex flex-column justify-content-center">
            <h6 className=" mt-3 fw-bold ">CloudECS Infotech</h6>
            <span className="d-flex flex-column my-2 ">
              <span className="footerContent mb-2">
                <FaPhoneAlt /> &nbsp;&nbsp;(+91) 9361365818
              </span>
              <span className="footerContent mb-2 ">
                <IoIosMailUnread /> &nbsp;&nbsp;sales@ecscloudinfotech.com
              </span>
              <span className="footerContent">
                <FaLocationDot /> &nbsp;&nbsp;766,Shakthi Towers,Tower-2,6th
                floor,Anna Salai,Chennai,India-600002
              </span>
            </span>
          </div>

          <div className="col-lg-3 col-md-3 col-12">
            <div className="text-center">
              <h6 className=" mt-3 fw-bold">Pages</h6>
              <span className="my-2">
                <Link className="nav-link footerContent mt-2 " to="/about">
                  About
                </Link>
                <Link className="nav-link footerContent mt-2 " to="/feature">
                  Feature
                </Link>
                <Link className="nav-link footerContent mt-2 " to="/contact">
                  Contact
                </Link>
              </span>
            </div>
          </div>

          <div className="col-lg-3 col-md-3 col-12">
            <div>
              <h6 className="mt-3 fw-bold">Others</h6>
              <span className="d-flex flex-column my-2 ">
                <a
                  target="_blank"
                  className="nav-link footerContent mt-2 "
                  href="https://crmlah.com/privacypolicy/index.html"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
                <span className="footerContent mb-2 ">Terms & Conditions</span>
                <span className="footerContent mb-2 ">Support</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <div
        className="d-flex flex-column align-items-center py-3"
        // style={{ backgroundColor: "rgba(61, 99, 234, 0.90)", color: "#fff" }}
      >
        <span className="">
          2024 © Copyright ECS Cloud Infotech. All Rights Reserved.{" "}
        </span>
      </div>
    </div>
  );
}

export default Footer;
