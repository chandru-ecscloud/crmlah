import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const ProductModel = ({ path }) => {
  console.log(path);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const [productsData, setProdcutsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const userId = sessionStorage.getItem("userId");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectAll(false);
    setSelectedRows([]);
  };

  const fetchProductsData = async () => {
    try {
      //   setLoading(true);
      const response = await axios(
        `${API_URL}allProductsByCompanyId/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const handleSendProductsToQuoteAndInvoice = async () => {
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

  // const handleSendProductsToInvoice = async (rows) => {
  //   const rowData = rows.map((row) => row.original.id);
  //   const invoiceId = sessionStorage.getItem("invoice_id");
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}associateProductsWithInvoice/${invoiceId}`,
  //       rowData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           //Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       toast.success(response.data.message);
  //       sessionStorage.removeItem("invoice_id");
  //       navigate("/invoices");
  //       table.setRowSelection(false);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error("Failed: " + error.message);
  //   }
  // };

  // const handleHeaderCheckboxChange = () => {
  //   const newSelectAll = !selectAll;
  //   setSelectAll(newSelectAll);
  //   const allIds = productsData.map((item) => item.id);
  //   setSelectedRows(
  //     newSelectAll
  //       ? allIds.map((id) => productsData.find((item) => item.id === id))
  //       : []
  //   );
  // };

  const handleHeaderCheckboxChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedRows(newSelectAll ? productsData.map((item) => item.id) : []);
  };

  const handleCheckboxChange = (id) => {
    const isChecked = selectedRows.includes(id);
    if (isChecked) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  console.log("selected", selectedRows);

  return (
    <div>
      <button
        style={{ width: "100%", border: "none", background: "transparent" }}
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
                          className="form-check-input "
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
                            // checked={selectedRows.some(
                            //   (row) => row.id === item.id
                            // )}
                            // onChange={() => handleCheckboxChange(item.id, item)}
                            className="form-check-input "
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
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
                    onClick={() =>
                      handleSendProductsToQuoteAndInvoice(selectedRows)
                    }
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

export default ProductModel;
