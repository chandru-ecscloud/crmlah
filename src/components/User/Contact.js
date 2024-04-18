import React from "react";
import { BiLogoGmail } from "react-icons/bi";
import { MdOutlineGpsFixed } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

function Contact() {
  return (
    <section>
      <div
        className=" container-fluid p-4"
        style={{ backgroundColor: "#ECFAFE" }}
      >
        <div className="row contactCard">
          <div className="col-lg-6 col-md-6 col-12 contactColumn p-5 d-flex flex-column ">
            <div className="">
              <h2 className=" pt-3 mb-4">
                <b>Let's</b> <b className="text-primary">Talk!</b>{" "}
              </h2>
              <p className="mb-4">
                We love hearing from you! Whether you have a question, feedback,
                or just want to chat about your ideas, feel free to reach out.
                <span className=" text-primary ">
                  &nbsp;Here’s how you can contact us:
                </span>
              </p>
              <span className="d-flex flex-column">
                <span className=" mb-4">
                  <span
                    className=""
                    style={{
                      backgroundColor: "#ffff",
                      padding: "4px 6px",
                      borderRadius: "15px",
                    }}
                  >
                    <BiLogoGmail className="mb-1 text-primary " />
                  </span>
                  &nbsp;&nbsp;info@ecscloudinfotech.com
                </span>
                <span className=" mb-4 ">
                  <span
                    className=""
                    style={{
                      backgroundColor: "#ffff",
                      padding: "4px 6px",
                      borderRadius: "15px",
                    }}
                  >
                    <FaPhoneAlt className="mb-1 text-primary" />
                  </span>
                  &nbsp;&nbsp;(+65) 88941306
                </span>

                <span className=" mb-4">
                  <span
                    className=""
                    style={{
                      backgroundColor: "#ffff",
                      padding: "4px 6px",
                      borderRadius: "15px",
                    }}
                  >
                    <MdOutlineGpsFixed className="mb-1 text-primary" />
                  </span>
                  &nbsp;&nbsp;The Alexcier,237 Alexandra Road, #04-10,
                  &nbsp;&nbsp;<p className="ms-4">Singapore-159929.</p>
                </span>
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 p-4">
            <form>
              <div className="row">
                <h3 className=" text-center ">CONTACT</h3>
                <div className="col-12 mb-3">
                  <label className="contactFields">First Name</label>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    className="form-control "
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="contactFields">Phone</label>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    className="form-control "
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="contactFields">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control "
                  />
                </div>

                <div className="col-12 mb-4">
                  <label className="contactFields">Enquiry</label>
                  <textarea
                    name="message"
                    id="message"
                    className="form-control "
                  ></textarea>
                </div>
                <div className="col-12 mb-3">
                  <button className="form-control btn btn-primary py-2">
                    Submit Form
                  </button>
                </div>
                {/* <span className="d-flex justify-content-center col-12 ">
                  <button className="btn btn-primary">Submit Form</button>
                </span> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
