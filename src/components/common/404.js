import React from "react";
import page404 from "../../assets/404.png";

function Page404() {
  return (
    <section>
      <div className="container">
        <div className="row">
          <div
            className="offset-lg-2 col-lg-8 col-12 d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "90vh" }}
          >
            <img className="img-fluid" src={page404} alt="404" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page404;
