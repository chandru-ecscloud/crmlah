import { useLocation, useNavigate } from "react-router-dom";
import Failed from "../../assets/failed.png";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderDataString = queryParams.get("info");
  const OrderId = queryParams.get("OrderId");
  if (!OrderId) {
    navigate("/");
  }
  const orderData = orderDataString
    ? JSON.parse(decodeURIComponent(orderDataString))
    : null;
  console.log("orderData", orderData);
  return (
    <div className="container py-2">
      <div
        className="row justify-content-center"
        style={{ marginTop: "4.5rem" }}
      >
        <div className="col-12">
          <div className="p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src={Failed}
                className="img-fluid img-responsive success-img"
                alt="Success"
                style={{ maxHeight: "6em" }}
              />
            </div>
            <span
              className="badge rounded-pill mt-3"
              style={{
                backgroundColor: "#ffd4d5",
                color: "#FF2B2E",
                fontWeight: "lighter",
              }}
            >
              Payment Failed
            </span>
            <p className="mt-3 h5 fw-semibold" style={{ marginBottom: "6rem" }}>
              Your payment could not be made.
            </p>
            <p className="mt-3 mb-0 fw-bold">Error:</p>
            <p className="success-note">
              Bank Servers did not respond. Please Try Again.
            </p>
            <a
              href="https://ecsaio.in/students_internship/contact"
              className="text-muted"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
