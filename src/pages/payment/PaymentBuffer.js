import Processing from "../../assets/Spinner.png";
import { IoMdLock } from "react-icons/io";
import { useEffect } from "react";
import WebSocketService from "../../Config/WebSocketService";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentBuffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  // const transactionDetails = [
  //   {
  //     orderId: "ORD-20250119-061101-46CA3725",
  //     TransactionData: [
  //       {
  //         mercId: "BDUAT2K386",
  //         transactionDate: "2025-01-19T11:44:26+05:30",
  //         surcharge: "0.00",
  //         paymentMethodType: "netbanking",
  //         amount: "118000.00",
  //         ru: "https://crmlah.com/payment?OrderId=ORD-20250119-061101-46CA3725",
  //         orderId: "ORD-20250119-061101-46CA3725",
  //         transactionErrorType: "success",
  //         discount: "0.00",
  //         bankRefNo: "BILLDESK12",
  //         transactionId: "U1232RN00043GV",
  //         transactionProcessType: "nb",
  //         bankId: "123",
  //         itemCode: "DIRECT",
  //         transactionErrorCode: "TRS0000",
  //         currency: "356",
  //         authStatus: "0300",
  //         transactionErrorDesc: "Transaction Successful",
  //         objectId: "transaction",
  //         chargeAmount: "118000.00",
  //         additionalInfo: {
  //           additional_info1: "UserName : prem",
  //           additional_info2: "UserEmail : premvp24@gmail.com",
  //           additional_info3: "UserPhoneNumber : 9790415128",
  //           additional_info4: "Course : Front End Development",
  //           additional_info5: "City : chennai",
  //         },
  //       },
  //     ],
  //   },
  // ];
  // const matchedOrder = transactionDetails.find((item) => item.orderId === "ORD-20250119-061101-46CA3725");
  // const orderDataStrings = encodeURIComponent(JSON.stringify(matchedOrder));
  const OrderId = queryParams.get("OrderId");

  useEffect(() => {
    if (!OrderId) {
      console.error("OrderId is missing in the URL");
      navigate("/");
    }
  }, [OrderId, navigate]);

  useEffect(() => {
    let timeoutId;
  
    const subscription = WebSocketService.subscribeToPaymentUpdates((data) => {
      clearTimeout(timeoutId);
  
      console.log("subscription Data", data.data);
      const matchedOrder = data.data.find((item) => item.orderId === OrderId);
      const orderDataString = encodeURIComponent(JSON.stringify(matchedOrder));
  
      if (
        matchedOrder &&
        matchedOrder.TransactionData[0].transactionErrorType === "success"
      ) {
        navigate(
          `/payment-success?OrderId=${OrderId}&info=${orderDataString}`
        );
      } else if (
        matchedOrder &&
        matchedOrder.TransactionData[0].transactionErrorType !== "success"
      ) {
        console.log("Payment Failed");
        navigate(`/payment-failed?OrderId=${OrderId}&info=${orderDataString}`);
      } else {
        navigate(`/network-error?OrderId=${OrderId}&info=${orderDataString}`);
      }
    });
  
    timeoutId = setTimeout(() => {
      // console.error("WebSocket did not respond within 20 seconds.");
      navigate(`/network-error?OrderId=${OrderId}`);
    }, 20000); // 20 seconds
  
    return () => {
      subscription?.unsubscribe?.(); 
      clearTimeout(timeoutId);
    };
  }, [OrderId]);
  

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

            <p className="mt-3 h5 fw-semibold" style={{ marginBottom: "6rem" }}>
              Please hold on while we securely process
              <br /> your transaction.
            </p>
            <p className="mt-3 mb-0 fw-bold" >
              Note:
            </p>
            <p className="success-note">
              This may take a few moments.
              <br />
              Please do not refresh or close this page.
            </p>

            {/* <button className="btn" onClick={()=>( navigate(
          `/payment-success?OrderId=ORD-20250119-061101-46CA3725&info=${orderDataStrings}`
        ))}>button</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBuffer;
