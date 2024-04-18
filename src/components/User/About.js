import React from "react";
import Contact from "../../assets/Contact.png";

function About() {
  return (
    <section style={{ backgroundColor: "#ECFAFE" }} className="p-5">
      <div className="container">
        <div className="   text-center pt-5">
          <h3 className=" text-primary ">Introducing CRMLAH </h3>
          <h1 className=" fw-bold pt-4">Your All-in-One CRM </h1>
          <h1 className=" fw-bold ">
            App Platform with AI-Powered Capabilities
          </h1>
          <p className="p-5 fw">
            CRMLAH is a suite of CRM App platform featuring an AI-powered
            Chatbot, customer relationship <br /> management, marketing
            automation, website building capabilities, email marketing tools,
            loyalty programs,
            <br />
            campaign management, workflow automation, lead generation functions,
            analytics and reporting tools, SMS <br /> marketing, and additional
            features.
          </p>
        </div>

        <div className="row pt-4">
          <div className="col-md-7 col-12 ps-3 p-5">
            <h3 className="mb-4">
              Enhance Customer Engagement with Integrated Chatbots
            </h3>

            <p className="" style={{ fontSize: "1vw" }}>
              Elevate your customer engagement strategy with CRMLAH's integrated
              chatbots. Powered by AI, our chatbots provide instant support,
              streamline communication, and enhance interactions with your
              audience. From answering inquiries to guiding users through
              processes, our chatbots empower your business to deliver efficient
              and personalized experiences round the clock. Join the future of
              customer service and elevate your brand with CRMLAH's cutting-edge
              chatbot integration.
            </p>
          </div>
          <div className="col-md-5 col-12">
            <img className="img-fluid " src={Contact} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
