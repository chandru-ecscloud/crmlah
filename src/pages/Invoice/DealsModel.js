import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";

const DealsModel = () => {
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const [dealsdata, setDealsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const fetchDealsData = async () => {
    try {
      //   setLoading(true);
      const response = await axios(`${API_URL}allDeals`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDealsData(response.data);
      console.log("DealsData", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealsData();
  }, []);
  const handleHeaderCheckboxChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const allIds = dealsdata.map((item) => item.id);
    setSelectedRows(
      newSelectAll
        ? allIds.map((id) => dealsdata.find((item) => item.id === id))
        : []
    );
  };

  const handleCheckboxChange = (id, rowData) => {
    const isChecked = selectedRows.some((row) => row.id === id);
    if (isChecked) {
      setSelectedRows(selectedRows.filter((row) => row.id !== id));
    } else {
      setSelectedRows([...selectedRows, rowData]);
    }
  };
  console.log("selected", selectedRows);
  const dealsDataSubmit = () => {
    console.log("selectedRows", selectedRows);
  };
  return (
    <div>
      <button
        className="btn"
        style={{ width: "100%", border: "none" }}
        onClick={openModal}
      >
        Assign Deal
      </button>
      <Modal
        size="lg"
        show={isOpen}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Assign Deal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="Dealsmodel">
            <div className="container-fluid">
              <div
                className="table-responsive mt-1 mb-5"
                style={{ maxHeight: "22rem", overflowY: "auto" }}
              >
                <table className="table">
                  <thead className="thead-dark">
                    <tr
                      style={{ position: "sticky", top: 0, zIndex: 1 }}
                      className=" table-dark "
                    >
                      <th scope="col">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleHeaderCheckboxChange}
                        />
                      </th>
                      <th scope="col">Deal Name</th>
                      <th scope="col">Account Name</th>
                      <th scope="col">Contact Name</th>
                      <th scope="col">Deal Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealsdata.map((item, index) => (
                      <tr className="" key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.some(
                              (row) => row.id === item.id
                            )}
                            onChange={() => handleCheckboxChange(item.id, item)}
                          />
                        </td>
                        <td>{item.dealName}</td>
                        <td>{item.accountName}</td>
                        <td>{item.contactName}</td>
                        <td>{item.dealOwner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-12 d-flex justify-content-end ">
                <button className="btn btn-danger mx-2 " onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary "
                  type="button"
                  onClick={dealsDataSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DealsModel;
