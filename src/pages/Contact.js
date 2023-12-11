import React from "react";
import {
  FaFacebook,
  FaPhoneAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter, FaLocationDot } from "react-icons/fa6";
import { IoIosMailUnread } from "react-icons/io";

function Contact() {
  return (
    <section style={{ marginTop: "105px" }}>
      <div className="container-fluid">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.805247120521!2d103.80915937007211!3d1.2911915589070788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1bd4049927cd%3A0x894079bd73a94fbc!2sECS%20Cloud%20Infotech%20Pte%20Ltd!5e0!3m2!1sen!2sin!4v1702029931509!5m2!1sen!2sin"
          width="100%"
          height="350"
          title="ECSCLOUDUNFOTECH"
          style={{ border: "0" }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="container my-5">
        <div className="row contactCard">
          <div className="col-lg-6 col-md-6 col-12 contactColumn p-5 d-flex flex-column justify-content-center">
            <div className="contactBackground">
              <p className="contactInformation">Contact Information</p>
              <p className="contactContent mb-5">
                Say something to start a live chat!
              </p>
              <span className="d-flex flex-column">
                <span className="contactText mb-3">
                  <FaPhoneAlt /> &nbsp;&nbsp;(+65) 88941306
                </span>
                <span className="contactText mb-3">
                  <IoIosMailUnread /> &nbsp;&nbsp;sales@ecscloudinfotech.com
                </span>
                <span className="contactText mb-5">
                  <FaLocationDot /> &nbsp;&nbsp;The Alexcier,237 Alexandra Road,
                  <br /> #04-10, Singapore-159929.
                </span>
              </span>
              <span className="d-flex">
                <FaInstagram className="contactIcon" />
                <FaFacebook className="contactIcon" />
                <FaXTwitter className="contactIcon" />
                <FaWhatsapp className="contactIcon" />
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 p-4">
            <form>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <label className="contactFields">First Name</label>
                  <input type="text" name="fname" id="fname"  className="form-control contactInput"/>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <label className="contactFields">Last Name</label>
                  <input type="text" name="lname" id="lname" className="form-control contactInput"/>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <label className="contactFields">Email</label>
                  <input type="email" name="email" id="email"  className="form-control contactInput"/>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-3">
                  <label className="contactFields">Phone Number</label>
                  <input type="tel" name="phone" id="phone" className="form-control contactInput"/>
                </div>
                <div className="col-12 mb-3">
                  <label className="contactFields">Select Subject</label>
                  <textarea name="subject" id="subject" className="form-control contactInput"></textarea>
                </div>
                <div className="col-12 mb-5">
                  <label className="contactFields">Message</label>
                  <textarea name="message" id="message" className="form-control contactInput"></textarea>
                </div>
                <span className="d-flex justify-content-end">
                <button className="btn btn-danger contactButton">Send Message</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
