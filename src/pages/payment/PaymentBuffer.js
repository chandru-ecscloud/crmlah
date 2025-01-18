import Processing from "../../assets/Spinner.png";
import { IoMdLock } from "react-icons/io";
import { useEffect } from "react";
import WebSocketService from "../../Config/WebSocketService";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentBuffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const OrderId = queryParams.get("OrderId");
  if (!OrderId) {
    navigate("/");
  }
  
  useEffect(() => {
    const subscription = WebSocketService.subscribeToPaymentUpdates((data) => {
      console.log("subscription", data);
      const matchedOrder = data.find((item) => item.orderId === OrderId);

      if (matchedOrder) {
        navigate(`/payment-success?OrderId=${OrderId}`);
      } else {
        console.log("Payment Failed");
        navigate(`/payment-failed?OrderId=${OrderId}`);
      }
    });

    // return subscription;
  }, []);

  return (
    <div className="container py-2">
      <div
        className="row justify-content-center"
        style={{ marginTop: "4.5rem" }}
      >
        <div className="col-12">
          <div className="p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-5">
              <div style={{ position: "relative" }}>
                <img
                  src={Processing}
                  className="img-fluid spinner-img"
                  alt="Processing Spinner"
                  style={{ maxHeight: "5em" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "2em",
                    color: "#000",
                  }}
                >
                  <IoMdLock size={23} />
                </span>
              </div>
            </div>

            <span
              className="badge rounded-pill mt-3"
              style={{
                background:
                  "linear-gradient(90deg, rgb(234, 238, 251) 0%, rgb(242, 227, 251) 100%)",
                fontWeight: "lighter",
                color: "#7c2fef", // Use a solid color for text
              }}
            >
              Processing
            </span>

            <p className="mt-3 h5" style={{ marginBottom: "6rem" }}>
              Please hold on while we securely process
              <br /> your transaction.
            </p>
            <p className="mt-3 mb-0" style={{ fontWeight: "500" }}>
              Note:
            </p>
            <p className="success-note">
              This may take a few moments.
              <br />
              Please do not refresh or close this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBuffer;
