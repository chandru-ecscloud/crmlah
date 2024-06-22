import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const InvoiceModel = ({ path,dealIds,getData }) => {
  // const token = sessionStorage.getItem("token");
  const [dealsdata, setDealsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const companyId = sessionStorage.getItem("companyId");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectAll(false);
    setSelectedRows([]);
  };

  const fetchInvoiceData = async () => {
    try {
      const response = await axios(
        `${API_URL}allInvoicesByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDealsData(response.data);
      console.log("Invoice Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDealsAssignToInvoice = async () => {
    const payload = {
      "dealIds": dealIds,
      "invoiceIds": selectedRows
    }
    try {
      const response = await axios.post(`${API_URL}${path}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        getData();
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.warning(error?.response?.data?.message);
      } else {
        console.log(
          "Error assigning Invoice to Deal ",
          error?.response?.data?.message
        );
      }
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows([id]);
  };

  console.log("selected", selectedRows);

  return (
    <div>
      <span
        // className="btn"
        style={{ width: "100%", border: "none" }}
        onClick={openModal}
      >
        Assign Invoice
      </span>
      <Modal
        size="lg"
        show={isOpen}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton className="Calenderview">
          <Modal.Title id="example-modal-sizes-title-lg">
            Assign Invoice
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
                      <th scope="col">Select</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Invoice Date</th>
                      <th scope="col">Invoice Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealsdata.map((item, index) => (
                      <tr className="" key={item.id}>
                        <td>
                          <input
                            type="radio"
                            className="form-check-input"
                            checked={selectedRows[0] === item.id}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </td>
                        <td>{item.subject}</td>
                        <td>{item.status}</td>
                        <td>
                          {new Date(item.invoiceDate)
                            .toISOString()
                            .substring(0, 10)}
                        </td>
                        <td>{item.invoiceOwner}</td>
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
                  onClick={() => handleDealsAssignToInvoice(selectedRows)}
                >
                  Assign
                </button>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceModel;
