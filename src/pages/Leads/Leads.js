import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import WebSocketService from "../../Config/WebSocketService";
import "../../styles/custom.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Modal } from "react-bootstrap";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Lead = () => {
  const [data, setData] = useState([]);
  // console.log(data);
  const [loading, setLoading] = useState(true);
  const role = sessionStorage.getItem("role");
  const Id = sessionStorage.getItem("Id");
  const owner = sessionStorage.getItem("user_name");
  const [datas, setDatas] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  // console.log(role);
  const navigate = useNavigate();
  const companyId = sessionStorage.getItem("companyId");
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleShow = () => setShow(true);
  const [showRadios, setShowRadios] = useState(false);

  const handleProposalTypeChange = (event) => {
    formik.handleChange(event);
    setShowRadios(!!event.target.value);
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("files", file);
  };

  const validationSchema = yup.object().shape({
    proposalType: yup.string().required("*proposal Type is required"),
    proposal: yup.array()
      .of(yup.string().required("*Working Days is required!"))
      .min(1, "*Working Days is required!"),
  });
  console.log("object", datas)
  const formik = useFormik({
    initialValues: {
      proposalType: "",
      file: "",
      generateLink: "",

    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log(data);
      // try {
      //   const response = await api.post(`/createNewsUpdatedSaveImages`, formData);
      //   if (response.status === 201) {
      //     setShow(false);
      //     formik.resetForm();
      //     toast.success(response.data.message);
      //     refreshData()
      //   } else {
      //     toast.error(response.data.message);
      //   }
      // } catch (error) {
      //   toast.error(error);
      // } finally {
      //   setLoadIndicator(false);
      // }
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "first_name",
        enableHiding: false,
        header: "Lead Name",
        Cell: ({ row }) => (
          <Link
            to={`/leads/show/${row.original.id}`}
            className="rowName d-flex"
          >
            {row.original.first_name} &nbsp;
            {row.original.newLead && (
              <div className="newCircle">
                <span className="badge text-bg-danger">New</span>
              </div>
            )}
          </Link>
        ),
      },
      {
        accessorKey: "company",
        enableHiding: false,
        header: "Company",
      },
      {
        accessorKey: "email",
        enableHiding: false,
        header: "Email-Address",
      },
      {
        accessorKey: "phone",
        enableHiding: false,
        header: "Phone Number",
        Cell: ({ row }) => (
          <span>
            {row.original.countryCode}&nbsp;{row.original.phone}
          </span>
        ),
      },
      {
        accessorKey: "lead_status",
        enableHiding: false,
        header: "Lead Status",
        Cell: ({ row }) =>
          row.original.lead_status === "Processed" ? (
            <span
              className="badge bg-info py-2"
              style={{ color: "#1f1f1f !important" }}
            >
              Processed
            </span>
          ) : row.original.lead_status === "Contacted" ? (
            <span className="badge bg-primary py-2 ">Contacted</span>
          ) : row.original.lead_status === "Qualified" ? (
            <span className="badge bg-success py-2">Qualified</span>
          ) : row.original.lead_status === "Negotiation" ? (
            <span className="badge bg-warning py-2">Negotiation</span>
          ) : row.original.lead_status === "Closed" ? (
            <span className="badge bg-danger py-2">Closed</span>
          ) : row.original.lead_status === "Win" ? (
            <span className="badge bg-success py-2">Win</span>
          ) : row.original.lead_status === "Junk" ? (
            <span className="badge bg-warning py-2">Junk</span>
          ) : row.original.lead_status === "Lost" ? (
            <span className="badge bg-danger  py-2">Lost</span>
          ) : (
            <span className="badge bg-warning  py-2">Pending</span>
          ),
      },
      {
        accessorKey: "land_line",
        header: "Land Line",
      },
      {
        accessorKey: "lead_owner",
        header: "Lead Owner",
      },
      {
        accessorKey: "lead_source",
        header: "Lead Source",
      },

      {
        accessorKey: "street",
        header: "Street",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        accessorKey: "created_by",
        header: "Created By",
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
      },
      {
        accessorKey: "description_info",
        header: "Description",
      },
      {
        accessorKey: "skype_id",
        header: "Skype ID",
      },
      {
        accessorKey: "twitter",
        header: "Twitter",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) => row.original.created_at.substring(0, 10),
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        Cell: ({ row }) => {
          if (row.original.updated_at) {
            return row.original.updated_at.substring(0, 10);
          } else {
            return "";
          }
        },
      },
    ],
    []
  );

  useEffect(() => {
    const subscription = WebSocketService.subscribeToLeadUpdates((data) => {
      console.log("subscription", data);
      if (data === true) {
        setCount((prevCount) => prevCount + 1);
      }
    });
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}allClientsByCompanyId/${companyId}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [count]);

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Leads", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Lead Name",
      "Company",
      "Email-Address",
      "Phone Number",
      "Lead Owner",
    ];

    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.first_name,
        row.original.company,
        row.original.email,
        row.original.phone,
        row.original.lead_owner,
      ];
    });

    autoTable(doc, {
      head: [tableHeaders1],
      body: tableData1,
      startY: 25,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    const tableHeaders2 = [
      "Land Line",
      "Lead Source",
      "Lead Status",
      "Street",
      "City",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.land_line,
        row.original.lead_source,
        row.original.lead_status,
        row.original.street,
        row.original.city,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders2],
      body: tableData2,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    const tableHeaders3 = [
      "Zip Code",
      "State",
      "Country",
      "Created By",
      "Updated By",
    ];

    const tableData3 = rows.map((row) => {
      return [
        row.original.zipCode,
        row.original.state,
        row.original.country,
        row.original.created_by,
        row.original.updatedBy,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders3],
      body: tableData3,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    const tableHeaders4 = [
      "Description",
      "Skype ID",
      "Twitter",
      "Created At",
      "Updated At",
    ];
    const tableData4 = rows.map((row) => {
      return [
        row.original.Description,
        row.original.skype_id,
        row.original.twitter,
        row.original.createdAt,
        row.original.updatedAt,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders4],
      body: tableData4,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    doc.save("ECS.pdf");
  };

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "white",
            backgroundColor: "#0066fffb !important",
          },
        },
      },
    },
  });

  const handleBulkConvert = async (rows) => {
    rows.forEach((row) => {
      row.original.company_id = companyId;
    });

    const rowData = rows.map((row) => row.original);
    const rowDataid = rows.map((row) => row.original.id).toString();

    console.log("12", rowDataid);
    try {
      const response = await axios.post(
        `${API_URL}transferBulkData?ownerName=${owner}`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            // //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/leads");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  const handelNavigateClick = () => {
    navigate("/leads/create");
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}deleteMultipleClientData`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            // //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/leads");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        description_info: false,
        city: false,
        lead_owner: false,
        lead_source: false,
        land_line: false,
        street: false,
        country: false,
        zipCode: false,
        state: false,
        created_by: false,
        updatedBy: false,
        skype_id: false,
        twitter: false,
      },
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <button className="btn text-secondary" onClick={handleExportData}>
          <RiFileExcel2Fill size={23} />
        </button>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
        >
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          >
            <RiFileExcel2Line size={23} />
          </button>
        </OverlayTrigger>

        <button
          className="btn text-secondary"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          }
        >
          <MdPictureAsPdf size={23} />
        </button>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
        >
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() =>
              handleExportRowsPDF(table.getSelectedRowModel().rows)
            }
          >
            <MdOutlinePictureAsPdf size={23} />
          </button>
        </OverlayTrigger>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/leads/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">Lead</span>
            </div>

            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <button
                  className={`btn btn-primary ${role === "CMP_USER" && "disabled"
                    }`}
                  disabled={role === "CMP_USER"}
                  onClick={handelNavigateClick}
                >
                  Create Lead
                </button>
              </div>
              <div
                className={`dropdown-center ${role === "CMP_USER" && "disabled"
                  }`}
              >
                <button
                  className="btn btn-danger dropdown-toggle"
                  disabled={role === "CMP_USER"}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Action <FaSortDown style={{ marginTop: "-6px" }} />
                </button>
                <ul className="dropdown-menu">

                  {/* {role === "CRM_USER" ? (
                    <>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !(
                              table.getIsSomeRowsSelected() ||
                              table.getIsAllRowsSelected()
                            ) || table.getSelectedRowModel().rows.length !== 1
                          }
                          onClick={() =>
                            handleBulkConvert(table.getSelectedRowModel().rows)
                          }
                        >
                          Convert
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleBulkConvert(table.getSelectedRowModel().rows)
                          }
                        >
                          Mass Convert
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !(
                              table.getIsSomeRowsSelected() ||
                              table.getIsAllRowsSelected()
                            ) || table.getSelectedRowModel().rows.length !== 1
                          }
                          onClick={() =>
                            handleBulkDelete(table.getSelectedRowModel().rows)
                          }
                        >
                          Delete
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleBulkDelete(table.getSelectedRowModel().rows)
                          }
                        >
                          Mass Delete
                        </button>
                      </li>
                    </>
                  ) : (
                    // Render disabled buttons for CMP_USER
                    <>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Convert
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Mass Convert
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Delete
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Mass Delete
                        </button>
                      </li>
                    </>
                  )} */}
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) || table.getSelectedRowModel().rows.length !== 1
                      }
                      onClick={() =>
                        handleBulkConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Convert
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                      onClick={() =>
                        handleBulkConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Convert
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) || table.getSelectedRowModel().rows.length !== 1
                      }
                      onClick={() =>
                        handleBulkDelete(table.getSelectedRowModel().rows)
                      }
                    >
                      Delete
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                      onClick={() =>
                        handleBulkDelete(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Delete
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      onClick={handleShow}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                    >
                      Company Proposal
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleClose}
          >
            <form onSubmit={formik.handleSubmit}>
              <Modal.Header closeButton
                closeVariant="white" className="Calenderview"
              >
                <Modal.Title>
                  Send Proposal
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="mb-2">
                    <label className="form-label">Proposal Type</label>
                    <select
                      {...formik.getFieldProps("proposalType")}
                      className={`form-select ${formik.touched.proposalType && formik.errors.proposalType ? "is-invalid" : ""}`}
                      aria-label="Default select example"
                      onChange={handleProposalTypeChange}
                    >
                      <option selected value=""></option>
                      <option value="Company_Profile">Company Profile</option>
                      <option value="Other's">Other's</option>
                    </select>
                    {formik.touched.proposalType && formik.errors.proposalType && (
                      <div className="invalid-feedback">
                        {formik.errors.proposalType}
                      </div>
                    )}
                  </div>

                  {showRadios && (
                    <div className="mb-2">
                      <div className="">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radio"
                          id="1"
                        >
                        </input>&nbsp;&nbsp;
                        <label className="form-check-label" htmlFor="1">
                          Company Profile
                        </label>
                      </div>
                      <div className="">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radio"
                          id="2">
                        </input>&nbsp;&nbsp;
                        <label className="form-check-label" htmlFor="2">
                          Infrastructure
                        </label>
                      </div>
                      <div className="">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="radio"
                          id="3">
                        </input>&nbsp;&nbsp;
                        <label className="form-check-label" htmlFor="3">
                          AWS
                        </label>
                      </div>
                      {formik.touched.proposal && formik.errors.proposal && (
                        <div className="invalid-feedback">
                          {formik.errors.proposal}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mb-2">
                    <label className="form-label">
                      Attachments
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="file"
                        className={`form-control ${formik.touched.file && formik.errors.file ? "is-invalid" : ""}`}
                        onChange={handleFileChange}
                      />
                      {formik.touched.file && formik.errors.file && (
                        <div className="invalid-feedback">
                          {formik.errors.file}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* {selectedFile && (
                    <div className="mb-2">
                      {selectedFile.type.startsWith("image") && (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Selected File"
                          style={{ maxHeight: "100px" }}
                        />
                      )}
                    </div>
                  )} */}

                  <div className="mb-2">
                    <label className="form-label">
                      Generate Appointment Link
                    </label>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        role="switch"
                        id="yes"
                        className={`form-check-input ${formik.touched.generateLink && formik.errors.generateLink ? "is-invalid" : ""}`}
                        {...formik.getFieldProps("generateLink")}
                        checked
                      />
                    </div>
                    {formik.touched.generateLink && formik.errors.generateLink && (
                      <div className="invalid-feedback">{formik.errors.generateLink}</div>
                    )}
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="mt-5">
                <Button className="btn btn-danger" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loadIndicator}
                >
                  {loadIndicator && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                  )}
                  Save
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
          </ThemeProvider>
        </>
      )}
    </section>
  );
};

export default Lead;
