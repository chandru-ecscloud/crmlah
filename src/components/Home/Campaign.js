import React from "react";
import campaignImage from "../../assets/camopaignImage.png";

function Campaign() {
  return (
    <section>
      <div className="container-fluid">
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-lg-6 col-md-6 col-12 my-5">
              <img src={campaignImage} alt="CRMLAH" className="img-fluid" />
            </div>
            <div className="col-lg-6 col-md-6 col-12 my-5 ">
              <span className="heroHeading">
                CONVERSATIONAL <br />
                <span className="heroCRM">AI CRM</span>
              </span>
              <p className="heroSubHeading">
                Accelerate your Business Revenue with an AI-powered Chatbot CRM
              </p>
              <button className="btn btn-primary heroBtn">View More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Campaign;
