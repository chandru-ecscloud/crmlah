import { useLocation, useNavigate } from "react-router-dom";
import Success from "../../assets/success.png";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const OrderId = queryParams.get("OrderId");
  if (!OrderId) {
    navigate("/");
  }
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
                src={Success}
                className="img-fluid img-responsive success-img"
                alt="Success"
                style={{ maxHeight: "6em" }}
              />
            </div>
            <span
              className="badge rounded-pill mt-3"
              style={{
                backgroundColor: "#d4edda",
                color: "#28A745",
                fontWeight: "lighter",
              }}
            >
              Payment Successful
            </span>
            <p className="mt-3 h5" style={{ marginBottom: "6rem" }}>
              Your payment has been successfully
              <br /> processed!
            </p>
            <p className="mt-3 mb-0" style={{ fontWeight: "500" }}>
              Note:
            </p>
            <p className="success-note">
              You’ll receive an email with the transaction details.
              <br />
              Please do not refresh or close this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
