import React from "react";

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
          <div className="col-lg-6 col-md-6 col-12 contactColumn">
            <div className="contactBackground">
              <p className="contactInformation">Contact Information</p>
              <p className="contactContent">
                Say something to start a live chat!
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">Hii</div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
