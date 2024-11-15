import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import { FaTrash } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

const schema = yup.object().shape({
  deal_name: yup.string().required("!Enter Deal Name"),
  subject: yup.string().required("!Enter Subject"),
  quote_stage: yup.string().required("!Select Quote Stage"),
  quote_owner: yup.string().required("!Select Quote Owner"),
  product: yup.string().required("!Select Product Names"),
});

function QuotesCreate() {
  const role = sessionStorage.getItem("role");
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(`${API_URL}allProducts`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setProductOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [rows, setRows] = useState([
    {
      id: 1,
      productName: "",
      quantity: "",
      listPrice: "",
      amount: "",
      discount: "",
      tax: "",
      total: "",
    },
  ]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      productName: "",
      quantity: "",
      listPrice: "",
      amount: "",
      discount: "",
      tax: "",
      total: "",
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  const handleSelectChange = async (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = value;
    try {
      const response = await axios.get(`${API_URL}allProducts/${value}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      const listPrices = response.data.unitPrice;
      updatedRows[index].listPrice = listPrices;
      updatedRows[index].quantity = 1;
      updatedRows[index].tax = 0;
      updatedRows[index].discount = 0;
      setRows(updatedRows);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    const updateAmountAndTotal = (index) => {
      const updatedRows = [...rows];
      const listPrice = updatedRows[index].listPrice || 0;
      const quantity = updatedRows[index].quantity || 0;
      const discount = updatedRows[index].discount || 0;
      const tax = updatedRows[index].tax || 0;

      updatedRows[index].amount = listPrice * quantity;
      updatedRows[index].total =
        (listPrice * quantity * (100 - discount) * (100 + tax)) / 10000;

      setRows(updatedRows);
    };

    rows.forEach((row, index) => {
      if (!row.amount || !row.total) {
        // If amount or total is not set, update them
        updateAmountAndTotal(index);
      }
    });
  }, [rows]);

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = value;
    console.log(updatedRows);

    // Calculate the amount based on listPrice and quantity
    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = value || 0;

    updatedRows[index].amount = listPrice * quantity;

    // Calculate the total based on listPrice, quantity, discount, and tax
    const discount = updatedRows[index].discount || 0;
    const tax = updatedRows[index].tax || 0;

    updatedRows[index].total =
      (updatedRows[index].amount * (100 - discount) * (100 + tax)) / 10000;

    setRows(updatedRows);
  };

  const handleDiscountChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].discount = value;

    // Calculate the total based on listPrice, quantity, discount, and tax
    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;
    const discount = value || 0;
    const tax = updatedRows[index].tax || 0;

    updatedRows[index].total =
      (listPrice * quantity * (100 - discount) * (100 + tax)) / 10000;

    setRows(updatedRows);
  };

  const handleTaxChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].tax = value;

    // Calculate the total based on listPrice, quantity, discount, and tax
    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;
    const discount = updatedRows[index].discount || 0;
    const tax = value || 0;

    updatedRows[index].total =
      (listPrice * quantity * (100 - discount) * (100 + tax)) / 10000;

    setRows(updatedRows);
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handelCancel = () => {
    navigate("/quotes");
  };

  const handleApiSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}newQuote`, data, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/quotes");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }

    console.log("Api Quotes Data:", data);
  };
  

  return (
    <section className="createLead">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Create Quote</b>
              <br></br>
              <img
                src={userImage}
                className="img-fluid mt-3"
                style={{
                  width: "70px",
                  height: "70px",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
                alt="user"
                onClick={() => document.getElementById("imageInput").click()}
              />
              {/* Input for image upload */}
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <FaCamera className="cameraIcon" />
            </h4>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
            <span>
              <button className="btn btn-danger" onClick={handelCancel}>
                Cancel
              </button>
            </span>
            &nbsp;
            <span>
              <button
                className="btn btn-primary"
                type="button"
                // onClick={handleSubmit}
                onClick={handleSubmit((data) => {
                  console.log("handleSubmit:", data);
                  handleApiSubmit(data);
                })}
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Quotes Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Quote Owner</lable> &nbsp;&nbsp;
              <select
                {...register("quote_owner")}
                type="text"
                className="form-size form-control"
                id="quote_owner"
              >
                <option value={owner}>{owner}</option>
                <option value="Vignesh Devan">Vignesh Devan</option>
                <option value="Chandru R">Chandru R</option>
                <option value="Gayathri M">Gayathri M</option>
                <option value="Poongodi K">Poongodi K</option>
                <option value="Suriya G">Suriya G</option>
                <option value="Leela Prasanna D">Leela Prasanna D</option>
                <option value="Saravanan M">Saravanan M</option>
                <option value="Nagaraj VR">Nagaraj VR</option>
                <option value="Yalini A">Yalini A</option>
                <option value="Vishnu Priya">Vishnu Priya</option>
                <option value="Kavitha">Kavitha</option>
              </select>
            </div>

            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.quote_owner?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Deal Name</lable> &nbsp;&nbsp;
              <input
                {...register("deal_name")}
                type="text"
                className="form-size form-control"
                id="deal_name"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.deal_name?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Subject</lable> &nbsp;&nbsp;
              <input
                {...register("subject")}
                type="text"
                className="form-size form-control"
                id="subject"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.subject?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="d-flex align-items-center justify-content-end mb-3">
              <lable>Quotes Stage</lable> &nbsp;&nbsp;
              <select
                {...register("quote_stage")}
                type="text"
                className="form-size form-control"
                id="quote_stage"
              >
                <option value=""></option>
                <option value="Analysed">Analysed</option>
                <option value="Processed">Processed</option>
                <option value="Delivered">Delivered</option>
                <option value="Intermediated">Intermediated</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                <p className="text-danger">{errors.quote_stage?.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Valid Until</lable> &nbsp;&nbsp;
            <input
              {...register("valid_until")}
              type="date"
              className="form-size form-control"
              name="valid_until"
              id="valid_until"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Team</lable> &nbsp;&nbsp;
            <input
              type="text"
              className="form-size form-control"
              name="team"
              id="team"
              placeholder="--"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Account Name</lable> &nbsp;&nbsp;
            <input
              {...register("account_name")}
              type="text"
              className="form-size form-control"
              name="account_name"
              id="account_name"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Contact Name</lable> &nbsp;&nbsp;
            <input
              {...register("contact_name")}
              type="text"
              className="form-size form-control"
              name="contact_name"
              id="contact_name"
            />
          </div>
        </div>
      </div>

      <div className="container-fluid my-5">
        <h4>
          <b>Address Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Street</lable> &nbsp;&nbsp;
            <input
              {...register("shipping_street")}
              type="text"
              className="form-size form-control"
              name="shipping_street"
              id="shipping_street"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Street</lable> &nbsp;&nbsp;
            <input
              {...register("billing_street")}
              type="text"
              className="form-size form-control"
              name="billing_street"
              id="billing_street"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping City</lable> &nbsp;&nbsp;
            <input
              {...register("shipping_city")}
              type="text"
              className="form-size form-control"
              name="shipping_city"
              id="shipping_city"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing City</lable> &nbsp;&nbsp;
            <input
              {...register("billing_city")}
              type="text"
              className="form-size form-control"
              name="billing_city"
              id="billing_city"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Code</lable> &nbsp;&nbsp;
            <input
              {...register("shipping_code")}
              type="text"
              className="form-size form-control"
              name="shipping_code"
              id="shipping_code"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Code</lable> &nbsp;&nbsp;
            <input
              {...register("billing_code")}
              type="text"
              className="form-size form-control"
              name="billing_code"
              id="billing_code"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping State</lable> &nbsp;&nbsp;
            <input
              {...register("shipping_state")}
              type="text"
              className="form-size form-control"
              name="shipping_state"
              id="shipping_state"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing State</lable> &nbsp;&nbsp;
            <input
              {...register("billing_state")}
              type="text"
              className="form-size form-control"
              name="billing_state"
              id="billing_state"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Shipping Country</lable> &nbsp;&nbsp;
            <input
              {...register("shipping_country")}
              type="text"
              className="form-size form-control"
              name="shipping_country"
              id="shipping_country"
            />
          </div>

          <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end mb-3">
            <lable>Billing Country</lable> &nbsp;&nbsp;
            <input
              {...register("billing_country")}
              type="text"
              className="form-size form-control"
              name="billing_country"
              id="billing_country"
            />
          </div>
        </div>
      </div>

      <div className="container-fluid my-5">
        <h4>
          <b>Quotes Items</b>
        </h4>
      </div>

      <div className="container">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  Product Name
                </th>
                <th scope="col">Quantity</th>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  List Price
                </th>
                <th scope="col">Amount</th>
                <th scope="col">Discount</th>
                <th scope="col">Tax</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody className="table-secondary">
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <th scope="row">{row.id}</th>
                  <td>
                    <select
                      className="form-select"
                      aria-label="Product"
                      value={row.selectedOption}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                    >
                      <option value="" selected disabled></option>
                      {productOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.productName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      className="form-control"
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.listPrice}
                      class="form-control"
                      id="exampleFormControlInput1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.amount}
                      class="form-control"
                      id="exampleFormControlInput1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.discount}
                      className="form-control"
                      onChange={(e) =>
                        handleDiscountChange(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.tax}
                      className="form-control"
                      onChange={(e) => handleTaxChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.total}
                      class="form-control"
                      id="exampleFormControlInput1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary" onClick={addRow}>
          Add Row
        </button>
        {rows.length > 1 && (
          <button className="btn btn-outline-danger mx-3" onClick={deleteRow}>
            <FaTrash />
          </button>
        )}
      </div>

      <div className="container-fluid">
        <div className="container-fluid row mt-5 mx-2">
          <div className="container-fluid p-3 col-md-4 border rounded">
            <div className="container-fluid py-2">
              <label className="text-dark text-end">Sub Total(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                placeholder="--"
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Discount(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                {...register("discount")}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Tax(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                {...register("tax")}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Adjustment(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                {...register("adjustment")}
              />
            </div>
            <div className="container-fluid py-2">
              <label className="text-dark">Grand Total(Rs.)</label>
              <input
                className="form-control p-1"
                type="text"
                {...register("grand_total")}
              />
            </div>
          </div>
          <div className="container-fluid p-3 col-md-8"></div>
        </div>
      </div>

      <div className="container-fluid my-5">
        <h4>
          <b>Terms and Conditions</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-8 d-flex align-items-center justify-content-end mb-3">
            <lable>Terms & Conditions</lable> &nbsp;&nbsp;
            <input
              {...register("terms_and_conditions")}
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="terms_and_conditions"
              id="terms_and_conditions"
            />
          </div>
        </div>
      </div>

      <div className="container-fluid my-5">
        <h4>
          <b>Description Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-8 d-flex align-items-center justify-content-end mb-3">
            <lable>Description</lable> &nbsp;&nbsp;
            <input
              {...register("description")}
              type="text"
              style={{ width: "70%" }}
              className="form-control"
              name="description"
              id="description"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuotesCreate;
