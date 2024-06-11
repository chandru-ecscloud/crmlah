import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const QuotesModel = ({ path }) => {
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const [quotesdata, setQuotesData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  console.log(path);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectAll(false);
    setSelectedRows([]);
  };

  const fetchQuatesData = async () => {
    try {
      //   setLoading(true);
      const response = await axios(`${API_URL}allQuotes`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setQuotesData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuatesData();
  }, []);

  //   const handleCheckboxChange = (id, rowData) => {
  //     const isChecked = selectedRows.some((row) => row.id === id);
  //     if (isChecked) {
  //       setSelectedRows(selectedRows.filter((row) => row.id !== id));
  //     } else {
  //       setSelectedRows([...selectedRows, rowData]);
  //     }
  //   };

  const handleSendAccountToQuote = async () => {
    try {
      const response = await axios.post(`${API_URL}${path}`, selectedRows, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  // const handleHeaderCheckboxChange = () => {
  //     const newSelectAll = !selectAll;
  //     setSelectAll(newSelectAll);
  //     const allIds = quotesdata.map((item) => item.id);
  //     setSelectedRows(
  //     newSelectAll
  //         ? allIds.map((id) => quotesdata.find((item) => item.id === id))
  //         : []
  //     );
  // };
  const handleHeaderCheckboxChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedRows(newSelectAll ? quotesdata.map((item) => item.id) : []);
  };

  const handleCheckboxChange = (id) => {
    const isChecked = selectedRows.includes(id);
    if (isChecked) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  console.log("selectedRows", selectedRows);

  return (
    <div>
      <button
        className="btn"
        style={{ width: "100%", border: "none" }}
        onClick={openModal}
      >
        Assign Quote
      </button>
      <Modal
        size="lg"
        show={isOpen}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton className="Calenderview">
          <Modal.Title id="example-modal-sizes-title-lg">
            Assign Quotes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="Quotesmodel">
            <div className="container">
              <div
                className="table-responsive  mb-3"
                style={{ maxHeight: "23rem", overflowY: "auto" }}
              >
                <table class="table ">
                  <thead>
                    <tr
                      className="table-dark"
                      style={{ position: "sticky", top: 0, zIndex: 1 }}
                    >
                      <th scope="col">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleHeaderCheckboxChange}
                        />
                      </th>
                      <th scope="col">Deals Name</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Quote Stages</th>
                      <th scope="col">Quotes Owner</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {quotesdata.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </td>
                        <td>{item.dealName}</td>
                        <td>{item.subject}</td>
                        <td>{item.quoteStage}</td>
                        <td>{item.quoteOwner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-12 d-flex justify-content-end justify-content-end">
                <span>
                  <button className="btn btn-danger" onClick={closeModal}>
                    Cancel
                  </button>
                </span>
                &nbsp;
                <span>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handleSendAccountToQuote(selectedRows)}
                  >
                    Assign
                  </button>
                </span>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QuotesModel;
