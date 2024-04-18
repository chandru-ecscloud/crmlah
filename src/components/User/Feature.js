import React from "react";
import Leads from "../../assets/Leads.jpg";
import Whatsapp from "../../assets/Whatsapp.jpg";
import Email from "../../assets/Email.webp";
import Sales from "../../assets/Sales.jpg";
import Analytics from "../../assets/Analytics.jpg";
function Feature() {
  return (
    <div
      className="container-fluid about"
      style={{ backgroundColor: "#ECFAFE" }}
    >

    
        <div className="row">
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
            <img className="img-fluid" src={Whatsapp} alt="mission" style={{ maxWidth: "100%", maxHeight: "80%" }} />
          </div>
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center flex-column">
            <h1
              className="fw-bold text-center mt-2"
              style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >
              What'sApp Automation
            </h1>
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h5 className="d-flex p-2 text-start ms-2">
                  Create a complete marketing funnel for your business. Create
                  an end to end all in one customer experience for your WhatsApp
                  CRM with the help of whatsapp automation.
                </h5>
              </div>
            </div>
          </div>
        </div>
  
     
     
        <div className="row">
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center flex-column ">
            <h1 className="fw-bold text-center mt-2"style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >Email Integration</h1>
            <div className="row">
              <h5 className="d-flex text-start">
                Revamp your sales approach by seamlessly connecting your CRMLah
                tool with your Office 365 or Gmail mailbox. Streamline your
                workflow and maximize efficiency by effortlessly accessing
                emails and contacts directly within your CRM platform, saving
                valuable time on daily tasks.
              </h5>
            </div>
            </div>
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
            <img className="img-fluid" src={Email} alt="about us" style={{ maxWidth: "100%", maxHeight: "80%" }} />
          </div>
        
      </div>
     
        <div className="row ">
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
            <img className="img-fluid" src={Leads} alt="mission" style={{ maxWidth: "100%", maxHeight: "80%" }}/>
          </div>
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center flex-column">
            <h1
              className="fw-bold text-start mt-2"
              style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >
              Lead Generation
            </h1>
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h5 className="d-flex p-2 text-start ms-2">
                  Speed up your sales pipeline by seamlessly transferring leads
                  from your website and social media platforms to your CRM
                  system. Utilize user-friendly and easily customizable web
                  forms to optimize lead generation, effortlessly assigning
                  leads to the appropriate salesperson with automated processes.
                </h5>
              </div>
            </div>
          </div>
        </div>
      
     
        <div className="row  ">
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center flex-column ">
            <h1 className="fw-bold text-center mt-2" style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >Sales Management</h1>
            <div className="row">
              <h5 className="d-flex text-start">
                Drag and drop sales pipeline With your favourite sales CRM,
                track your leads conveniently and effortlessly transform leads
                into winning opportunities. Customise, optimise, and streamline
                your sales activities and let your team work laser-focused.
              </h5>
            </div>
          </div>
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
            <img className="img-fluid" src={Sales} alt="about us" style={{ maxWidth: "100%", maxHeight: "80%" }}/>
          </div>
        </div>
      
      
        <div className="row ">
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center">
            <img className="img-fluid" src={Analytics} alt="mission" style={{ maxWidth: "100%", maxHeight: "80%" }}/>
          </div>
          <div className="col-md-6 col-12 d-flex align-items-center justify-content-center flex-column">
            <h1
              className="fw-bold text-center mt-2"
              style={{ color: "rgba(0, 0, 0, 0.726)" }}
            >
              CRM Analytics
            </h1>
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h5 className="d-flex p-2 text-start ms-2">
                  Accelerate your sales process by quickly accessing
                  consolidated overview reports and analyzing essential
                  performance metrics all in one location. Obtain actionable
                  insights on sales, leads, activities, and campaigns through
                  comprehensive analytics, facilitating informed decision-making
                  and strategic planning.
                </h5>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

export default Feature;
