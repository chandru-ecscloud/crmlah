import React from "react";
import { BiLogoGmail } from "react-icons/bi";
import { MdOutlineGpsFixed } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  first_name: yup.string().required("*First Name is required"),
  phone: yup
    .string()
    .required("*Phone is required")
    .matches(/^[0-9]{10}$/, "*Phone Number must be 10 digits"),
  email: yup.string().required("*Email is required"),
  description_info: yup.string().required("*Enquiry is required"),
});

function Contact() {
  // const companyId = sessionStorage.getItem("companyId");
  // const owner = sessionStorage.getItem("user_name");
  const formik = useFormik({
    initialValues: {
      company_id: "",
      first_name: "",
      phone: "",
      email: "",
      description_info: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log(data);
      data.company_id = 2;
      data.company = "ECSCloudInfotech";
      data.lead_status = "Processed";
      try {
        const response = await axios.post(`${API_URL}newClient`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success("Thank You for Contacting Us! We'll be in touch soon!");
          formik.resetForm();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  return (
    <section>
      <div
        className=" container-fluid p-4"
        style={{ backgroundColor: "#ECFAFE" }}
      >
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 p-5 d-flex flex-column ">
            <div className="">
              <h2 className=" pt-3 mb-4">
                <b>Let's &nbsp; Talk!</b>
              </h2>
              <p className="mb-4">
                We love hearing from you! Whether you have a question, feedback,
                or just want to chat about your ideas, feel free to reach out.
                <span className=" text-primary ">
                  &nbsp;Here’s how you can contact us:
                </span>
              </p>
              <span className="d-flex flex-column">
                <span className=" mb-4">
                  <span
                    className=""
                    style={{
                      backgroundColor: "#ffff",
                      padding: "4px 6px",
                      borderRadius: "15px",
                    }}
                  >
                    <BiLogoGmail className="mb-1 text-primary " />
                  </span>
                  &nbsp;&nbsp;info@ecscloudinfotech.com
                </span>
                <span className=" mb-4 ">
                  <span
                    className=""
                    style={{
                      backgroundColor: "#ffff",
                      padding: "4px 6px",
                      borderRadius: "15px",
                    }}
                  >
                    <FaPhoneAlt className="mb-1 text-primary" />
                  </span>
                  &nbsp;&nbsp;(+65) 88941306
                </span>

                <span className=" mb-4">
                  <span
                    className=""
                    style={{
                      backgroundColor: "#ffff",
                      padding: "4px 6px",
                      borderRadius: "15px",
                    }}
                  >
                    <MdOutlineGpsFixed className="mb-1 text-primary" />
                  </span>
                  &nbsp;&nbsp;The Alexcier,237 Alexandra Road, #04-10,
                  &nbsp;&nbsp;<p className="ms-4">Singapore-159929.</p>
                </span>
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 p-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <h3 className=" text-center ">CONTACT</h3>
                <div className="col-12 mb-3">
                  <label className="contactFields">
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.first_name && formik.errors.first_name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("first_name")}
                    name="first_name"
                    id="first_name"
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-danger">{formik.errors.first_name}</p>
                  )}
                </div>
                <div className="col-12 mb-3">
                  <label className="contactFields">
                    Phone<span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-size form-control  ${
                      formik.touched.phone && formik.errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("phone")}
                    id="phone"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-danger">{formik.errors.phone}</p>
                  )}
                </div>
                <div className="col-12 mb-3">
                  <label className="contactFields">
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-size form-control  ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("email")}
                    id="email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-danger">{formik.errors.email}</p>
                  )}
                </div>

                <div className="col-12 mb-4">
                  <label className="contactFields">
                    Enquiry<span className="text-danger">*</span>
                  </label>
                  <textarea
                    {...formik.getFieldProps("description_info")}
                    name="description_info"
                    className="form-control "
                  ></textarea>
                  {formik.touched.description_info &&
                    formik.errors.description_info && (
                      <p className="text-danger">
                        {formik.errors.description_info}
                      </p>
                    )}
                </div>
                <div className="col-12 mb-3">
                  <button
                    type="submit"
                    className="form-control btn btn-primary py-2"
                  >
                    Submit Form
                  </button>
                </div>
                {/* <span className="d-flex justify-content-center col-12 ">
                  <button className="btn btn-primary">Submit Form</button>
                </span> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
