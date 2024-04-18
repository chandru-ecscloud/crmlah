import React from "react";
import Mobile from "../../assets/mobile.png";
import Lead from "../../assets/lead.png";
import home from "../../assets/home.png";
import Crm from "../../assets/crm.png";
import Mic from "../../assets/mic.png";
import Search from "../../assets/search.png";
import Speaker from "../../assets/speaker.png";
import Rocket from "../../assets/rocket.png";
import Calender from "../../assets/calender.png";
import Sensex from "../../assets/sensex.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="container-fluid ">
      <div
        className="row"
        style={{ backgroundColor: "#ECFAFE", minHeight: "75vh" }}
      >
        <div className="d-flex mt-5  align-items-center justify-content-center flex-column">
          <h1 className="text-primary fw-bold" style={{ fontSize: "4vw" }}>
            CONVERSATIONAL
          </h1>
          <h1 className="text-danger fw-bold " style={{ fontSize: "4vw" }}>
            AI CRM
          </h1>
          <h6 className="mt-3 " style={{ fontSize: "1.5vw" }}>
            {" "}
            <b>
              Accelerate your Business Revenue with an AI-powered Chatbot CRM
            </b>
          </h6>

          <Link to={"/entryappointment"} className="mt-3">
            <button class="btn donateBtn py-3">Book Demo</button>
          </Link>
        </div>
      </div>

      <div className="" style={{ backgroundColor: "#ECFAFE" }}>
        <div className="text-center">
          <h1 className="fw-bold " style={{ fontSize: "4vw" }}>
            All of what your business needs <br />
            in one space
          </h1>
        </div>
        <img src={Mobile} className="img-fluid rounded mx-auto d-block p-5" />
      </div>

      <div className="row pt-5 pb-3">
        <div className=" col-md-8 col-12 px-5">
          <div
            className=" shadow p-3 mb-5"
            style={{ backgroundColor: "#ECFAFE" }}
          >
            <img src={Lead} className="img-fluid rounded mx-auto d-block p-2" />
          </div>
        </div>

        <div className="col-md-4 col-12 px-5">
          <h1 className="fw-bold pt-5" style={{ fontSize: "3vw" }}>
            Automate all of business operations
          </h1>
          <h5 className="text-muted pt-3" style={{ fontSize: "1.5vw" }}>
            Elevate your business with end-to-end automation using ECS Cloud.
            Unleash the power of seamless efficiency and unparalleled control
            across all your operations.
          </h5>
        </div>
      </div>

      <div className="row pt-5 pb-3">
        <div className="col-md-4 col-12 px-5">
          <h1 className="fw-bold pt-5" style={{ fontSize: "3vw" }}>
            Enhance the efficiency of your business processes.
          </h1>
          <h5 className="text-muted pt-3" style={{ fontSize: "1.5vw" }}>
            Boost your team's productivity with ECS CRM. Our advanced platform
            enables seamless collaboration, workflow streamlining, and overall
            efficiency enhancement. Take your business to new heights with the
            ultimate solution for team performance.
          </h5>
        </div>
        <div className=" col-md-8 col-12 px-5">
          <div
            className=" shadow p-3 mb-5"
            style={{ backgroundColor: "#ECFAFE" }}
          >
            <img src={home} className="img-fluid rounded mx-auto d-block p-2" />
          </div>
        </div>
      </div>

      <div
        className="shadow p-3 mb-5 mt-3 "
        style={{ backgroundColor: "#ECFAFE" }}
      >
        <div className="row mt-4  pb-3">
          <div className="col-md-6 col-12">
            <img src={Crm} className="img-fluid rounded mx-auto d-block" />
          </div>
          <div className="col-md-6 col-12  justify-content-center mt-3 ">
            <h1 className="text-center  fw-bold" style={{ fontSize: "3vw" }}>
              {" "}
              Chatbot CRM
            </h1>
            <p className=" text-muted text-center mt-5">
              {" "}
              Supercharge your team’s productivity with ECS Cloud. Our
              cutting-edge platform empowers your staff to collaborate
              seamlessly, streamline workflows, and enhance overall efficiency.
              Elevate your business to new heights with the ultimate team
              performance solution.
            </p>
            <div className="d-flex justify-content-center mt-3 ">
              <button
                className="btn  btn-lg "
                style={{ backgroundColor: "#3D63EA" }}
              >
                <span className="text-white">Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" container ">
        <div className="row pt-3">
          <div className=" d-flex justify-content-center  align-items-center flex-column ">
            <h1 className="fw-bold " style={{ fontSize: "3vw" }}>
              Key Features
            </h1>
            <p className="text-muted pb-5" style={{ fontSize: "1.5vw" }}>
              Experience Robust Automation and AI-Powered Insights with ECS
              Cloud, streamlining operations whil gaining actionable data-driven
              insights for informed decision-making.
            </p>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className="card key-features h-75 shadow p-3 mb-5 ">
              <div className="row">
                <div className="col-4">
                  <img src={Mic} className="img-fluid" />
                </div>
                <div className="col-8 d-flex flex-column justify-content-center">
                  <h5 className=" fw-bold p">AI-Powered Chatbot</h5>
                  <p className=" text-muted m-0">
                    {" "}
                    Omni-channel chatbot: Supports multiple platforms,
                    AI-trained for client interaction, automation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="card key-features h-75 shadow p-3 mb-5 ">
              <div className="row">
                <div className="col-4">
                  <img src={Search} className="img-fluid" />
                </div>
                <div className="col-8 d-flex flex-column justify-content-center">
                  <h5 className=" fw-bold p">CRM</h5>
                  <p className=" text-muted m-0">
                    {" "}
                    Organize contacts, track communication, and manage sales
                    pipelines efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="card key-features h-75 shadow p-3 mb-5 ">
              <div className="row">
                <div className="col-4">
                  <img src={Speaker} className="img-fluid" />
                </div>
                <div className="col-8 d-flex flex-column justify-content-center">
                  <h5 className=" fw-bold p"> Marketing Automation</h5>
                  <p className=" text-muted m-0">
                    {" "}
                    SMS and social media marketing, landing pages, analytics,
                    reporting and much more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="card key-features h-75 shadow p-3 mb-5 ">
              <div className="row">
                <div className="col-4">
                  <img src={Rocket} className="img-fluid" />
                </div>
                <div className="col-8 d-flex flex-column justify-content-center">
                  <h5 className=" fw-bold p">Lead Generation</h5>
                  <p className=" text-muted m-0">
                    Lead capture forms, conversion tracking, and third party
                    integration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="card key-features h-75 shadow p-3 mb-5 ">
              <div className="row">
                <div className="col-4">
                  <img src={Calender} className="img-fluid" />
                </div>
                <div className="col-8 d-flex flex-column justify-content-center">
                  <h5 className=" fw-bold p">Appointment Scheduling</h5>
                  <p className=" text-muted m-0">
                    Online appointment booking, calendar management, and
                    automated reminders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="card key-features h-75 shadow p-3 mb-5 ">
              <div className="row">
                <div className="col-4">
                  <img src={Sensex} className="img-fluid" />
                </div>
                <div className="col-8 d-flex flex-column justify-content-center">
                  <h5 className=" fw-bold p"> Analytics and Reporting</h5>
                  <p className=" text-muted m-0">
                    {" "}
                    Track marketing and sales performance, generating reports on
                    key metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
