import Failed from '../../assets/failed.png';

const PaymentFailed = () => {
  return (
    <div className="container py-2">
      <div className="row justify-content-center"
        style={{ marginTop: "4.5rem" }}>
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
            <span className="badge rounded-pill mt-3"
              style={{ backgroundColor: "#ffd4d5", color: "#FF2B2E", fontWeight: "lighter" }}>
              Payment Failed
            </span>
            <p className="mt-3 h5"
              style={{ marginBottom: "6rem" }}>
              Your payment could not be made.</p>
            <p className="mt-3 mb-0"
              style={{ fontWeight: "500" }}>Error:</p>
            <p className="success-note">Bank Servers did not respond. Please Try Again.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed