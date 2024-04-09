import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";

const ProductModel = () => {
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const [productsData, setProdcutsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const fetchProductsData = async () => {
    try {
      //   setLoading(true);
      const response = await axios(`${API_URL}allProducts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setProdcutsData(response.data);
      console.log("ProductsData", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleHeaderCheckboxChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const allIds = productsData.map((item) => item.id);
    setSelectedRows(
      newSelectAll
        ? allIds.map((id) => productsData.find((item) => item.id === id))
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
  const quatesDataSubmit = () => {
    console.log("selectedRows", selectedRows);
  };
  return (
    <div>
      <button
        className="btn"
        style={{ width: "100%", border: "none" }}
        onClick={openModal}
      >
        Assign Product
      </button>
      <Modal
        size="lg"
        show={isOpen}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Assign Products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="Quotesmodel">
            <div className="container-fluid">
              <div
                className="table-responsive mb-3"
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
                      <th scope="col">Product Name</th>
                      <th scope="col">Product Code</th>
                      <th scope="col">Vendor Name</th>
                      <th scope="col">Product Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsData.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.some(
                              (row) => row.id === item.id
                            )}
                            onChange={() => handleCheckboxChange(item.id, item)}
                          />
                        </td>
                        <td>{item.productName}</td>
                        <td>{item.productCode}</td>
                        <td>{item.vendorName}</td>
                        <td>{item.productOwner}</td>
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
                    onClick={quatesDataSubmit}
                  >
                    Save
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

export default ProductModel;
