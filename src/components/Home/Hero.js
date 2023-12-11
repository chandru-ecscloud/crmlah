import React from "react";
import HeroImage from "../../assets/heroImage.png"

function Hero() {
  return (
    <section>
      <div className="container-fluid Hero py-3">
        <div className="container ">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-lg-6 col-md-6 col-12 my-5">
              <span className="heroHeading">CONVERSATIONAL <br /><span className="heroCRM">AI CRM</span></span>
              <p className="heroSubHeading">Accelerate your Business Revenue with an AI-powered Chatbot CRM</p>
              <button className="btn btn-primary heroBtn">View More</button>
            </div>
            <div className="col-lg-6 col-md-6 col-12 my-5 heroImageBackground">
              <img src={HeroImage} alt="CRMLAH" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
