import React, { useState, useEffect } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  serviceName: yup.string().required("*Service name is required"),
  serviceOwner: yup.string().required("*Service owner is required"),
  duration: yup.string().required("*Duration is required"),
  location: yup.string().required("*Location is required"),
  members: yup.string().required("*Members is required"),
  availableDays: yup.string().required("*Available days is required"),
  availableTime: yup.string().required("*Available time is required"),
  price: yup.string().required("*Price is required"),
  tax: yup.string().required("*Tax is required"),
});

function ServicesEdit() {
  const { id } = useParams();
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();


  const formik = useFormik({
    initialValues: {
      serviceOwner: "",
      company_id: userId,
      serviceName: "",
      duration: "",
      location: "",
      members: "",
      availableDays: "",
      availableTime: "",
      price: "",
      tax: "",
      description: ""

    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log("Service Datas:", data);
      try {
        const response = await axios.put(`${API_URL}updateServices/${id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/services");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    }
  });

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allServices/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        const payload = {
          serviceOwner: getData.serviceOwner,
          company_id: userId,
          serviceName: getData.serviceName,
          duration: getData.duration,
          location: getData.location,
          members: getData.members,
          availableDays: getData.availableDays,
          availableTime: getData.availableTime,
          price: getData.price,
          tax: getData.tax,
          description: getData.description
        };
        // console.log("Converted Data", payload)
        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    userData();
  }, [id]);


  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };



  return (
    // <section className="updateService">
    //   <form onSubmit={formik.handleSubmit}>
    //     <div className="container-fluid">
    //       <div className="row mt-3">
    //         <div className="col-lg-6 col-md-6 col-12">
    //           <h4>
    //             <b>Update Service</b>
    //             <br></br>
    //             <img
    //               src={User}
    //               className="img-fluid"
    //               style={{ width: "70px", height: "70px" }}
    //               alt="user"
    //             />
    //           </h4>
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
    //           <span>
    //             <Link to={"/services"}>
    //               <button className="btn btn-danger">
    //                 Cancel
    //               </button>
    //             </Link>
    //           </span>
    //           &nbsp;
    //           <span>
    //             <button
    //               className="btn btn-primary"
    //               type="submit"
    //             >
    //               Save
    //             </button>
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="container-fluid my-5">
    //       <h4>
    //         <b>Service Information</b>
    //       </h4>
    //     </div>
    //     <div className="container">
    //       <div className="row">
    //         <input
    //           type="hidden"
    //           {...formik.getFieldProps("companyId")}
    //           value={userId}
    //           name="companyId"
    //         />
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <label htmlFor="serviceOwner">Service Owner</label>&nbsp;&nbsp;
    //             <select
    //               id="serviceOwner"
    //               className=" form-select form-size"
    //               {...formik.getFieldProps("serviceOwner")}
    //               name="serviceOwner"
    //             >
    //               <option value=""></option>
    //               <option value="Suriya">Suriya</option>
    //               <option value="Vignesh Devan">Vignesh Devan</option>
    //               <option value="Chandru R">Chandru R</option>
    //               <option value="Gayathri M">Gayathri M</option>
    //               <option value="Poongodi K">Poongodi K</option>
    //               <option value="Suriya G">Suriya G</option>
    //               <option value="Leela Prasanna D">Leela Prasanna D</option>
    //               <option value="Saravanan M">Saravanan M</option>
    //               <option value="Nagaraj VR">Nagaraj VR</option>
    //               <option value="Yalini A">Yalini A</option>
    //               <option value="Vishnu Priya">Vishnu Priya</option>
    //               <option value="Kavitha">Kavitha</option>
    //             </select>
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.serviceOwner && formik.errors.serviceOwner && (
    //                 <p className="text-danger">{formik.errors.serviceOwner}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Service Name</lable> &nbsp;&nbsp;
    //             <input
    //               type="text"
    //               className=" form-control form-size"
    //               {...formik.getFieldProps("serviceName")}
    //               name="serviceName"
    //               id="serviceName"
    //             />
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.serviceName && formik.errors.serviceName && (
    //                 <p className="text-danger">{formik.errors.serviceName}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>

    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Duration</lable> &nbsp;&nbsp;
    //             <select
    //               id="duration"
    //               className=" form-select form-size"
    //               {...formik.getFieldProps("duration")}
    //               name="duration"
    //             >
    //               <option value=""></option>
    //               <option value="2 Hours">2 Hours</option>
    //               <option value="4 Hours">4 Hours</option>
    //             </select>
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.duration && formik.errors.duration && (
    //                 <p className="text-danger">{formik.errors.duration}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Location</lable> &nbsp;&nbsp;
    //             <select
    //               id="location"
    //               className=" form-select form-size"
    //               {...formik.getFieldProps("location")}
    //               name="location"
    //             >
    //               <option value=""></option>
    //               <option value="Business Address">Business Address</option>
    //               <option value="Client Address">Client Address</option>
    //               <option value="Business Address and Client Address">Business Address and Client Address</option>
    //             </select>
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.location && formik.errors.location && (
    //                 <p className="text-danger">{formik.errors.location}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Member(s)</lable> &nbsp;&nbsp;
    //             <input
    //               type="tel"
    //               className=" form-control form-size"
    //               {...formik.getFieldProps("members")}
    //               name="members"
    //               id="members"
    //             />
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.members && formik.errors.members && (
    //                 <p className="text-danger">{formik.errors.members}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="container-fluid my-5">
    //       <h4>
    //         <b>Availability Information</b>
    //       </h4>
    //     </div>
    //     <div className="container">
    //       <div className="row">
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Available Day(s)</lable> &nbsp;&nbsp;
    //             <select
    //               id="availableDays"
    //               className=" form-select form-size"
    //               {...formik.getFieldProps("availableDays")}
    //               name="availableDays"
    //             >
    //               <option value=""></option>
    //               <option value="Every Business Days">Every Business Days</option>
    //               <option value="Specific Date Range">Specific Date Range</option>
    //               <option value="Specific Date(s)">Specific Date(s)</option>
    //               <option value="Specific Day(s)">Specific Day(s)</option>
    //             </select>
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.availableDays && formik.errors.availableDays && (
    //                 <p className="text-danger">{formik.errors.availableDays}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Available Time</lable> &nbsp;&nbsp;
    //             <select
    //               id="availableTime"
    //               className=" form-select form-size"
    //               {...formik.getFieldProps("availableTime")}
    //               name="availableTime"
    //             >
    //               <option value=""></option>
    //               <option value="Same as Business Time">Same as Business Time</option>
    //               <option value="Option 1">Option 1</option>
    //               <option value="Option 2">Option 2</option>
    //               <option value="Option 3">Option 3</option>
    //             </select>
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.availableTime && formik.errors.availableTime && (
    //                 <p className="text-danger">{formik.errors.availableTime}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="container-fluid my-5">
    //       <h4>
    //         <b>Price Information</b>
    //       </h4>
    //     </div>
    //     <div className="container">
    //       <div className="row">
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Price</lable> &nbsp;&nbsp;
    //             <input
    //               type="text"
    //               className=" form-control form-size"
    //               {...formik.getFieldProps("price")}
    //               name="price"
    //               id="price"
    //             />
    //           </div>
    //           <div className="row sm-device">
    //             <div className="col-5"></div>
    //             <div className="col-6 sm-device">
    //               {formik.touched.price && formik.errors.price && (
    //                 <p className="text-danger">{formik.errors.price}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="col-lg-6 col-md-6 col-12 mb-3">
    //           <div className="d-flex align-items-center justify-content-end sm-device">
    //             <lable>Tax</lable> &nbsp;&nbsp;
    //             <input
    //               type="text"
    //               className={`form-size form-control  ${formik.touched.tax && formik.errors.tax ? "is-invalid" : ""
    //                 }`}
    //               {...formik.getFieldProps("tax")}
    //               name="tax"
    //               id="tax"
    //             />
    //           </div>
    //           <div className="row">
    //             <div className="col-5"></div>
    //             <div className="col-6">
    //               {formik.touched.tax && formik.errors.tax && (
    //                 <p className="text-danger">{formik.errors.tax}</p>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="container-fluid my-5">
    //       <h4>
    //         <b>Description Information</b>
    //       </h4>
    //     </div>
    //     <div className="container">
    //       <div className="row">
    //         <div className="col-8 d-flex align-items-center justify-content-end mb-3 sm-device">
    //           <lable>Description</lable> &nbsp;&nbsp;
    //           <input
    //             type="text"
    //             style={{ width: "70%" }}
    //             className=" form-control form-size"
    //             {...formik.getFieldProps("description")}
    //             name="description"
    //             id="description"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </form>
    // </section>


    <section className="createLead">
    <form onSubmit={formik.handleSubmit}>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <h4>
              <b>Update Service</b>
              <br></br>
              {/* <img
                src={User}
                className="img-fluid"
                style={{ width: "70px", height: "70px" }}
                alt="user"
              /> */}
            </h4>
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
            <span>
              <Link to={"/services"}>
                <button className="btn btn-danger">
                  Cancel
                </button>
              </Link>
            </span>
            &nbsp;
            <span>
              <button
                className="btn btn-primary"
                type="submit"
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Service Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <input
            type="hidden"
            {...formik.getFieldProps("companyId")}
            value={userId}
            name="companyId"
          />
          <div className="col-lg-6 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <label htmlFor="serviceOwner">Service Owner</label>&nbsp;&nbsp;
              <select
                id="serviceOwner"
                className=" form-select form-size"
                {...formik.getFieldProps("serviceOwner")}
                name="serviceOwner"
              >
                <option value=""></option>
                <option value="Suriya">Suriya</option>
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
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.serviceOwner && formik.errors.serviceOwner && (
                  <p className="text-danger">{formik.errors.serviceOwner}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Service Name</lable> &nbsp;&nbsp;
              <input
                type="text"
                className=" form-control form-size"
                {...formik.getFieldProps("serviceName")}
                name="serviceName"
                id="serviceName"
              />
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.serviceName && formik.errors.serviceName && (
                  <p className="text-danger">{formik.errors.serviceName}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 mb-3 ">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Duration</lable> &nbsp;&nbsp;
              <select
                id="duration"
                className=" form-select form-size"
                {...formik.getFieldProps("duration")}
                name="duration"
              >
                <option value=""></option>
                <option value="2 Hours">2 Hours</option>
                <option value="4 Hours">4 Hours</option>
              </select>
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.duration && formik.errors.duration && (
                  <p className="text-danger">{formik.errors.duration}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Location</lable> &nbsp;&nbsp;
              <select
                id="location"
                className=" form-select form-size"
                {...formik.getFieldProps("location")}
                name="location"
              >
                <option value=""></option>
                <option value="Business Address">Business Address</option>
                <option value="Client Address">Client Address</option>
                <option value="Business Address and Client Address">Business Address and Client Address</option>
              </select>
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.location && formik.errors.location && (
                  <p className="text-danger">{formik.errors.location}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Member(s)</lable> &nbsp;&nbsp;
              <input
                type="tel"
                className=" form-control form-size"
                {...formik.getFieldProps("members")}
                name="members"
                id="members"
              />
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.members && formik.errors.members && (
                  <p className="text-danger">{formik.errors.members}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Availability Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Available Day(s)</lable> &nbsp;&nbsp;
              <select
                id="availableDays"
                className=" form-select form-size"
                {...formik.getFieldProps("availableDays")}
                name="availableDays"
              >
                <option value=""></option>
                <option value="Every Business Days">Every Business Days</option>
                <option value="Specific Date Range">Specific Date Range</option>
                <option value="Specific Date(s)">Specific Date(s)</option>
                <option value="Specific Day(s)">Specific Day(s)</option>
              </select>
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.availableDays && formik.errors.availableDays && (
                  <p className="text-danger">{formik.errors.availableDays}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Available Time</lable> &nbsp;&nbsp;
              <select
                id="availableTime"
                className=" form-select form-size"
                {...formik.getFieldProps("availableTime")}
                name="availableTime"
              >
                <option value=""></option>
                <option value="Same as Business Time">Same as Business Time</option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </select>
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.availableTime && formik.errors.availableTime && (
                  <p className="text-danger">{formik.errors.availableTime}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid my-5">
        <h4>
          <b>Price Information</b>
        </h4>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12mb-3">
            <div className="d-flex align-items-center justify-content-end  sm-device">
              <lable>Price</lable> &nbsp;&nbsp;
              <input
                type="text"
                className=" form-control form-size"
                {...formik.getFieldProps("price")}
                name="price"
                id="price"
              />
            </div>
            <div className="row sm-device">
              <div className="col-5"></div>
              <div className="col-6 sm-device">
                {formik.touched.price && formik.errors.price && (
                  <p className="text-danger">{formik.errors.price}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 mb-3 ">
            <div className="d-flex align-items-center justify-content-end sm-device">
              <lable>Tax</lable> &nbsp;&nbsp;
              <input
                type="text"
                className={`form-size form-control  ${
                  formik.touched.tax && formik.errors.tax ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("tax")}
                name="tax"
                id="tax"
              />
            </div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-6">
                {formik.touched.tax && formik.errors.tax && (
                  <p className="text-danger">{formik.errors.tax}</p>
                )}
              </div>
            </div>
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
          <div className="col-8 d-flex align-items-center justify-content-end ">
            <lable>Description</lable> &nbsp;&nbsp;
            <input
              type="text"
              style={{ width: "70%" }}
              className=" form-control form-size"
              {...formik.getFieldProps("description")}
              name="description"
              id="description"
            />
          </div>
        </div>
      </div>
    </form>
  </section>
  );
}

export default ServicesEdit;
