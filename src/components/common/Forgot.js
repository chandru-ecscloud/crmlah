import { Link, useNavigate } from "react-router-dom";
import CRM from "../../assets/heroImage.png";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("*Please Enter valid email")
    .required("*Enter the Email"),
});

const RadioFormSelector = () => {
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log("User Datas:", data);
      try {
        const response = await axios.get(
          `${API_URL}userForgotPassword`,
          { params: data },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success("Password send to mail");
          navigate("/login");
        } else {
          toast.error("Unsuccess");
        }
      } catch (error) {
        toast.error(error.response.data?.message);
      }
      console.log("Api Data:", Email);
    },
  });

  const handelForgot = async () => {};

  return (
    <section className="signIn">
    <div style={{backgroundColor: "#ECFAFE" }} className="py-5">
      <div className="container">
        <div className="row py-5">
          <div className="col-md-6 col-12 heroImageBackground">
            <img className="img-fluid" src={CRM} alt="CRMLAH" />
          </div>
          <div className="col-md-6 col-12 d-flex flex-column align-items-center justify-content-center">
            <div className="card my-3" style={{ width: "25rem" }}>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-group my-2">
                    <h3 className="registerWord ms-5">FORGOT PASSWORD</h3>
                    <label htmlFor="companyId" className="mb-1">
                      User Email:
                    </label>
                    <input
                      type="text"
                      // className="form-control"
                      id="companyId"
                      {...formik.getFieldProps("email")}
                      className={`form-control ${
                        formik.touched.email && formik.errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter User Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-danger text-start">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <button
                    // className="contactsubmitBtn btn btn-primary mt-3"
                    className="btn donateBtn"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Submit
                  </button>
                  <p className="forgotWord text-center mt-2">
                    Return to{" "}
                    <Link to="/login" className="password-link">
                      Login
                    </Link>
                    ?
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default RadioFormSelector;
