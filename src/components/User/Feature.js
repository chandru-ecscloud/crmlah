import React from "react";
import Leads from "../../assets/Leads.png";
import Whatsapp from "../../assets/whatsapp.png";
import Email from "../../assets/Email.png";
import Sales from "../../assets/sales.png";
import Analytics from "../../assets/analytics.png";
import { Link } from "react-router-dom";
function Feature() {
  return (
    <div className="container-fluid about pb-5" style={{ backgroundColor: "#ECFAFE" }}>

      <div className="row pt-5">
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
          <img className="img-fluid" src={Whatsapp} style={{ maxHeight: "100%" }} />
        </div>
        <div className="col-md-6 col-12 d-flex align-items-start justify-content-center flex-column">
          <div className="containerps-lg-5">
            <h1
              className="fw-bold mt-3"
              style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >
              What'sApp Automation
            </h1>
            <div className="row">
              <div className="col-md-10 ">
                <p className="d-flex pt-3 pb-4 text-start text-muted">
                  Create a complete marketing funnel for your business. Create
                  an end to end all in one customer experience for your WhatsApp
                  CRM with the help of whatsapp automation.
                </p>
                <Link to={"/entryappointment"}>
                  <button class="btn donateBtn">
                    Book Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 col-12 d-flex align-items-start justify-content-center flex-column ps-5">
          <div className="container ps-lg-5">
            <h1 className="fw-bold mt-3" style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >Email Integration</h1>
            <div className="row">
              <p className="d-flex pt-3 pb-4 text-start text-muted">
                Revamp your sales approach by seamlessly connecting your CRMLah
                tool with your Office 365 or Gmail mailbox. Streamline your
                workflow and maximize efficiency by effortlessly accessing
                emails and contacts directly within your CRM platform, saving
                valuable time on daily tasks.
              </p>
              <Link to={"/entryappointment"}>
                <button class="btn donateBtn">
                  Book Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center mt-3 ">
          <img className="img-fluid" src={Email} style={{ maxHeight: "100%" }} />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
          <img className="img-fluid" src={Leads} style={{ maxHeight: "100%" }} />
        </div>
        <div className="col-md-6 col-12 d-flex align-items-start justify-content-center flex-column">
          <div className="containerps-lg-5">
            <h1
              className="fw-bold mt-3" style={{ color: "rgba(0, 0, 0, 0.726)" }}>
              Lead Generation
            </h1>
            <div className="row">
              <div className="col-md-10 ">
                <p className="d-flex pt-3 pb-4 text-start text-muted">
                  Speed up your sales pipeline by seamlessly transferring leads
                  from your website and social media platforms to your CRM system.
                  Utilize user-friendly and easily customizable web forms to optimize
                  lead generation, effortlessly assigning leads to the appropriate salesperson
                  with automated processes.
                </p>
                <Link to={"/entryappointment"}>
                  <button class="btn donateBtn">
                    Book Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 col-12 d-flex align-items-start justify-content-center flex-column ps-5">
          <div className="container ps-lg-5">
            <h1 className="fw-bold mt-3" style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >Sales Management</h1>
            <div className="row">
              <h5 className="d-flex pt-3 pb-4 text-start text-muted">
                Drag and drop sales pipeline With your favourite sales CRM,
                track your leads conveniently and effortlessly transform leads
                into winning opportunities. Customise, optimise, and streamline
                your sales activities and let your team work laser-focused.
              </h5>
              <Link to={"/entryappointment"}>
                <button class="btn donateBtn">
                  Book Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center mt-3 ">
          <img className="img-fluid" src={Sales} style={{ maxHeight: "100%" }} />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
          <img className="img-fluid" src={Analytics} style={{ maxHeight: "100%" }} />
        </div>
        <div className="col-md-6 col-12 d-flex align-items-start justify-content-center flex-column">
          <div className="containerps-lg-5">
            <h1
              className="fw-bold mt-3"
              style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >
              CRM Analytics
            </h1>
            <div className="row">
              <div className="col-md-10 ">
                <p className="d-flex pt-3 pb-4 text-start text-muted">
                  Accelerate your sales process by quickly accessing consolidated
                  overview reports and analyzing essential performance metrics all
                  in one location. Obtain actionable insights on sales, leads, activities,
                  and campaigns through comprehensive analytics, facilitating informed
                  decision-making and strategic planning.
                </p>
                <Link to={"/entryappointment"}>
                  <button class="btn donateBtn">
                    Book Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Feature;
