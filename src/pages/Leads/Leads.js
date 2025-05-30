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
import SendCompanyProfile from "../Email/SendCompanyProfile";
import TableDeleteModel from "../../components/common/TableDeleteModel";
import * as XLSX from "xlsx";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Lead = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = sessionStorage.getItem("role");
  const Id = sessionStorage.getItem("Id");
  const owner = sessionStorage.getItem("user_name");
  const [datas, setDatas] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  // console.log(role);
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate();
  const companyId = sessionStorage.getItem("companyId");
  const [count, setCount] = useState(0);

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
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        Cell: ({ row }) => {
          if (row.original.updated_by) {
            return row.original.updated_by;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return `${formattedDate} at ${formattedTime}`;
  };

  // const parseDescription = (description) => {
  //   if (!description || !description.includes("^")) {
  //     return {
  //       Location: "",
  //       Course: "",
  //       "Year of Passing": "",
  //       "About Candidate": description,
  //     };
  //   }

  //   const parts = description.split("^").map((part) => part.trim());
  //   const extractValue = (label) =>
  //     parts
  //       ?.find((part) => part.startsWith(label))
  //       ?.split(":")[1]
  //       ?.trim() || "";

  //   return {
  //     Location: extractValue("Location"),
  //     Course: extractValue("Course"),
  //     "Year of Passing": extractValue("Year of Passing"),
  //     "About Candidate": extractValue("About Candidate"),
  //   };
  // };

  // const filterFields = (data) =>
  //   data.map((row, index) => {
  //     // if ( row.companyId === 53) {
  //     //   return {
  //     //     "S.no": index + 1,
  //     //     "Lead Name": row.first_name,
  //     //     Company: row.company,
  //     //     "Email-Address": row.email,
  //     //     "Phone Number": row.phone,
  //     //     "Lead Description": row.description_info,
  //     //     "Created At": formatDate(row.created_at),
  //     //   };
  //     // }

  //     const {
  //       Location,
  //       Course,
  //       "Year of Passing": YearOfPassing,
  //       "About Candidate": AboutCandidate,
  //     } = parseDescription(row.description_info);

  //     return {
  //       "S.no": index + 1,
  //       "Lead Name": row.first_name,
  //       Company: row.company,
  //       "Email-Address": row.email,
  //       "Phone Number": row.phone,
  //       Location,
  //       Course,
  //       "Year of Passing": YearOfPassing,
  //       "About Candidate": AboutCandidate,
  //       "Created At": formatDate(row.created_at),
  //     };
  //   });

  // const removeDuplicates = (data, key) => {
  //   const seen = new Set();
  //   return data.filter((item) => {
  //     // if (item.companyId === 43 || item.companyId === 53) {
  //     //   return true;
  //     // }

  //     const value = item[key];
  //     if (seen.has(value)) {
  //       return false;
  //     }
  //     seen.add(value);
  //     return true;
  //   });
  // };

  // const handleExportData = (selectedRows = []) => {
  //   const rawData = selectedRows.length
  //     ? selectedRows.map((row) => row.original)
  //     : data;
  //   const uniqueData = removeDuplicates(rawData, "phone");
  //   const dataToExport = filterFields(uniqueData);

  //   const totalRow = {
  //     "S.no": "",
  //     "Lead Name": "",
  //     Company: "Total Records",
  //     "Email-Address": dataToExport.length,
  //     "Phone Number": "",
  //     Location: "",
  //     Course: "",
  //     "Year of Passing": "",
  //     "About Candidate": "",
  //     "Created At": "",
  //   };
  //   dataToExport.push(totalRow);

  //   const ws = XLSX.utils.json_to_sheet(dataToExport);

  //   const uniformWidth = 25;
  //   ws["!cols"] = Array(
  //     dataToExport[0] ? Object.keys(dataToExport[0]).length : 0
  //   ).fill({ wch: uniformWidth });

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Leads");

  //   const timestamp = new Date().toISOString().slice(0, 10);
  //   const filename =
  //     selectedRows.length === 1
  //       ? `${selectedRows[0].original.company}_${timestamp}.xlsx`
  //       : `company_list_${timestamp}.xlsx`;

  //   XLSX.writeFile(wb, filename);
  // };

  const parseDescription = (description) => {
    if (!description || !description.includes("^")) {
      return {
        Location: "",
        Course: "",
        "Year of Passing": "",
        "About Candidate": description,
        "selected Course": "",
      };
    }

    const parts = description.split("^").map((part) => part.trim());
    const extractValue = (label) =>
      parts
        ?.find((part) => part.startsWith(label))
        ?.split(":")[1]
        ?.trim() || "";

    return {
      Location: extractValue("Location"),
      Course: extractValue("Course"),
      "selected Course": extractValue("selected Course"),
      "Year of Passing": extractValue("Year of Passing"),
      "About Candidate": extractValue("About Candidate"),
    };
  };

  const filterFieldsForSpecificCompanyIds = (data) =>
    data
      .filter((row) => row.companyId === 43 || row.companyId === 53 || row.companyId === 54 || row.companyId === 55 || row.companyId === 56)
      .map((row, index) => {
        const {
          Location,
          Course,
          "Year of Passing": YearOfPassing,
          "About Candidate": AboutCandidate,
          "selected Course": selectedCourse,
        } = parseDescription(row.description_info);

        return {
          "S.no": index + 1,
          "Lead Name": row.first_name,
          Company: row.company,
          "Email-Address": row.email,
          "Phone Number": row.phone,
          Location,
          Course,
          "Year of Passing": YearOfPassing,
          "About Candidate": AboutCandidate,
          "Selected Course": selectedCourse,
          "Created At": formatDate(row.created_at),
        };
      });

  const filterFields = (data) =>
    data
      .filter((row) => row.companyId !== 43 && row.companyId !== 53 && row.companyId !== 54 && row.companyId !== 55 && row.companyId !== 56)
      .map((row, index) => {
        return {
          "S.no": index + 1,
          "Lead Name": row.first_name,
          Company: row.company,
          "Email-Address": row.email,
          "Phone Number": row.phone,
          "Lead description": row.description_info,

          "Created At": formatDate(row.created_at),
        };
      });

  const removeDuplicatesForSpecificCompanyIds = (data, key) => {
    const seen = new Set();
    return data
      .filter((item) => item.companyId === 43 || item.companyId === 53 || item.companyId === 54 || item.companyId === 55 || item.companyId === 56)
      .filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
  };

  const handleExportData = (selectedRows = []) => {
    const rawData = selectedRows.length
      ? selectedRows.map((row) => row.original)
      : data;
    const uniqueDataForSpecificCompanyIds =
      removeDuplicatesForSpecificCompanyIds(rawData, "phone");

    const dataForSpecificCompanyIds = filterFieldsForSpecificCompanyIds(
      uniqueDataForSpecificCompanyIds
    );
    const otherData = filterFields(rawData);
    const dataToExport = [...dataForSpecificCompanyIds, ...otherData];
    const totalRow = {
      "S.no": "",
      "Lead Name": "",
      Company: "Total Records",
      "Email-Address": dataToExport.length,
      "Phone Number": "",
      "Created At": "",
    };
    dataToExport.push(totalRow);

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    const uniformWidth = 25;
    ws["!cols"] = Array(
      dataToExport[0] ? Object.keys(dataToExport[0]).length : 0
    ).fill({ wch: uniformWidth });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename =
      selectedRows.length === 1
        ? `${selectedRows[0].original.company}_${timestamp}.xlsx`
        : `company_list_${timestamp}.xlsx`;

    XLSX.writeFile(wb, filename);
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
      "Lead Description",
    ];

    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.first_name,
        row.original.company,
        row.original.email,
        row.original.phone,
        row.original.description_info,
      ];
    });
    if (rows.length > 1) {
      tableData1.push(["", "", "Total Records", rows.length, "", ""]);
    }

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

    // const tableHeaders2 = [
    //   "Land Line",
    //   "Lead Source",
    //   "Lead Status",
    //   "Street",
    //   "City",
    // ];
    // const tableData2 = rows.map((row) => {
    //   return [
    //     row.original.land_line,
    //     row.original.lead_source,
    //     row.original.lead_status,
    //     row.original.street,
    //     row.original.city,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders2],
    //   body: tableData2,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    // const tableHeaders3 = [
    //   "Zip Code",
    //   "State",
    //   "Country",
    //   "Created By",
    //   "Updated By",
    // ];

    // const tableData3 = rows.map((row) => {
    //   return [
    //     row.original.zipCode,
    //     row.original.state,
    //     row.original.country,
    //     row.original.created_by,
    //     row.original.updatedBy,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders3],
    //   body: tableData3,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    // const tableHeaders4 = [
    //   "Description",
    //   "Skype ID",
    //   "Twitter",
    //   "Created At",
    //   "Updated At",
    // ];
    // const tableData4 = rows.map((row) => {
    //   return [
    //     row.original.Description,
    //     row.original.skype_id,
    //     row.original.twitter,
    //     row.original.createdAt,
    //     row.original.updatedAt,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders4],
    //   body: tableData4,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Format timestamp
    const filename =
      rows.length === 1
        ? `${rows[0].original.first_name}_${timestamp?.slice(0, 10)}.pdf`
        : `Lead_List_${timestamp?.slice(0, 10)}.pdf`;

    doc.save(filename);
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
        updatedBy: true,
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
        {table.getPrePaginationRowModel().rows.length !== 0 && (
          <>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="selected-row-tooltip">Download CSV</Tooltip>
              }
            >
              <button
                className="btn text-secondary"
                onClick={() => {
                  const selectedRows = table.getSelectedRowModel().rows;
                  if (selectedRows.length === 1) {
                    handleExportData(selectedRows);
                  } else {
                    handleExportData(table.getPrePaginationRowModel().rows);
                  }
                }}
              >
                <RiFileExcel2Fill size={23} />
              </button>
            </OverlayTrigger>
            {/* <OverlayTrigger
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
        </OverlayTrigger> */}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="selected-row-tooltip">Download PDF</Tooltip>
              }
            >
              <button
                className="btn text-secondary"
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                // onClick={() =>
                //   handleExportRowsPDF(table.getPrePaginationRowModel().rows)
                // }
                onClick={() => {
                  const selectedRows = table.getSelectedRowModel().rows;
                  if (selectedRows.length === 1) {
                    handleExportRowsPDF(selectedRows);
                  } else {
                    handleExportRowsPDF(table.getPrePaginationRowModel().rows);
                  }
                }}
              >
                <MdPictureAsPdf size={23} />
              </button>
            </OverlayTrigger>
            {/* <OverlayTrigger
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
        </OverlayTrigger> */}
          </>
        )}
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/leads/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  const getEmail = (rows) => {
    const emails = rows.map((row) => row.original);
    setEmails(emails);
  };
  const tableReset = () => {
    table.setRowSelection(false);
  };
  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">Lead ({data.length})</span>
            </div>

            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <button
                  className={`btn btn-primary ${
                    role === "CMP_USER" && "disabled"
                  }`}
                  disabled={role === "CMP_USER"}
                  onClick={handelNavigateClick}
                >
                  Create Lead
                </button>
              </div>
              <div
                className={`dropdown-center ${
                  role === "CMP_USER" && "disabled"
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
                        )
                        // || table.getSelectedRowModel().rows.length !== 1
                      }
                      onClick={() =>
                        handleBulkConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Convert
                    </button>
                  </li>
                  {/* <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={table.getSelectedRowModel().rows.length < 2}
                      onClick={() =>
                        handleBulkConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Convert
                    </button>
                  </li> */}
                  <li>
                    <TableDeleteModel
                      rows={table.getSelectedRowModel().rows}
                      rowSelected={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        )
                      }
                      handleBulkDelete={handleBulkDelete}
                      onSuccess={() => {
                        table.setRowSelection(false);
                        fetchData();
                      }}
                    />
                  </li>
                  {/* <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={table.getSelectedRowModel().rows.length < 2}
                      onClick={() =>
                        handleBulkDelete(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Delete
                    </button>
                  </li> */}
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      onClick={() => getEmail(table.getSelectedRowModel().rows)}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                    >
                      <SendCompanyProfile
                        emails={emails}
                        tablereset={tableReset}
                      />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
          </ThemeProvider>
        </>
      )}
    </section>
  );
};

export default Lead;
