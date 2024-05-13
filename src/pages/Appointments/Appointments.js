import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { LinearProgress } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AppointmentsCreate from "./AppointmentsCreate";
import WebSocketService from "../../Config/WebSocketService";
const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Appointments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const companyId = sessionStorage.getItem("companyId");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "appointmentFor",
        enableHiding: false,
        header: "Appointment For",
        Cell: ({ row }) => (
          <Link
            to={`/appointments/show/${row.original.id}`}
            className="rowName d-flex"
          >
            {row.original.appointmentFor} &nbsp;&nbsp;
            {row.original.newAppointment && (
              <div className="newCircle">
                <span class="badge text-bg-danger">New</span>
              </div>
            )}
          </Link>
        ),
      },

      {
        accessorKey: "appointmentName",
        enableHiding: false,
        header: "Appointment Name",
      },
      // {
      //   accessorKey: "email",
      //   enableHiding: false,
      //   header: "Email",
      // },
      {
        accessorKey: "appointmentMode",
        enableHiding: false,
        header: "Appointment Mode",
        Cell :({row}) =>
          row.original.appointmentMode ==="ONLINE" ? (
            <span className="badge bg-success py-2 ">
              {row.original.appointmentMode}
            </span>
          ) : (
            <span className="badge bg-danger py-2 ">
              {row.original.appointmentMode}
            </span>
          )
      },
      {
        accessorKey: "appointmentStartDate",
        enableHiding: false,
        header: "Appointment Start Date",
      },
      {
        accessorKey: "typeOfAppointment",
        enableHiding: false,
        header: "Appointment Type",
        Cell: ({ row }) =>
          row.original.typeOfAppointment === "Leads" ? (
            <span
              className="badge bg-info py-2 "
              style={{ color: "#1f1f1f !important" }}
            >
              {row.original.typeOfAppointment}
            </span>
          ) : row.original.typeOfAppointment === "Contacts" ? (
            <span className="badge bg-primary py-2 ">
              {row.original.typeOfAppointment}
            </span>
          ) : row.original.typeOfAppointment === "Accounts" ? (
            <span className="badge bg-warning py-2">
              {row.original.typeOfAppointment}
            </span>
          ) : row.original.typeOfAppointment === "Deals" ? (
            <span className="badge bg-success py-2">
              {row.original.typeOfAppointment}
            </span>
          ) : (
            <span className="badge bg-info py-2">
              {row.original.typeOfAppointment}
            </span>
          ),
      },
      {
        accessorKey: "serviceName",
        header: "Service Name",
      },
      {
        accessorKey: "duration",
        header: "Duration",
      },
      {
        accessorKey: "appointmentStartTime",
        header: "Appointment Start Time",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "member",
        header: "Member",
      },
      {
        accessorKey: "reminder",
        header: "Remainder",
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
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "zipCode",
        header: "ZipCode",
      },
      {
        accessorKey: "zipCode",
        header: "Country",
      },
      {
        accessorKey: "additionalInformation",
        header: "Description",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}getAllAppointmentsByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = WebSocketService.subscribeToAppointmentUpdates(
      (data) => {
        // console.log("Websocket Data", data);
        if (data === true) {
          setCount((prevCount) => prevCount + 1);
        }
      }
    );
  }, []);

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
    doc.text("Appointments", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Appointment For",
      "Service Name",
      "Duration",
      "Appointment Name",
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.leadId,
        row.original.serviceName,
        row.original.duration,
        row.original.appointmentName,
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
      "Appointment Start Date",
      "Location",
      "Address",
      "Member",
      "Remainder",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.appointmentStartDate,
        row.original.location,
        row.original.street,
        row.original.member,
        row.original.reminder,
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

    console.log(tableData1);
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

  const handleBulkDelete = async (rows) => {
    const rowId = rows.map((row) => row.original.id);
    try {
      const response = await axios.delete(
        `${API_URL}cancelAppointment/${rowId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/appointments");
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
        serviceName: false,
        duration: false,
        appointmentStartTime: false,
        location: false,
        member: false,
        reminder: false,
        street: false,
        city: false,
        state: false,
        zipCode: false,
        additionalInformation: false,
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
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-end py-4 px-3">
            <div style={{ paddingRight: "10px" }}>
              <AppointmentsCreate
                name="Create Appointment"
                getData={fetchData}
              />
            </div>
            <div class="dropdown-center">
              <button
                class="btn btn-danger dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Action <FaSortDown style={{ marginTop: "-6px" }} />
              </button>
              <ul class="dropdown-menu">
                {role !== "CMP_USER" ? (
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
                          handleBulkDelete(table.getSelectedRowModel().rows)
                        }
                      >
                        Delete
                      </button>
                    </li>
                    {/* <li>
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
                </li> */}
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
                        Delete
                      </button>
                    </li>
                    {/* <li>
                  <button
                    className="btn"
                    style={{ width: "100%", border: "none" }}
                    disabled
                  >
                    Mass Delete
                  </button>
                </li> */}
                  </>
                )}
              </ul>
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

export default Appointments;
