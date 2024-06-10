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
  const userId = sessionStorage.getItem("userId");
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
        Cell: ({ row }) =>
          row.original.appointmentMode === "ONLINE" ? (
            <span className="badge bg-success py-2 ">
              {row.original.appointmentMode}
            </span>
          ) : (
            <span className="badge bg-danger py-2 ">
              {row.original.appointmentMode}
            </span>
          ),
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
        accessorKey: "appointmentstatus",
        enableHiding: false,
        header: "Appointment Status",
        Cell: ({ row }) =>
          row.original.appointmentstatus === "CONFIRMED" ? (
            <span
              className="badge bg-warning py-2 "
              style={{ color: "#1f1f1f !important" }}
            >
              CONFIRMED
            </span>
          ) : row.original.appointmentstatus === "COMPLETED" ? (
            <span className="badge bg-success py-2 ">COMPLETED</span>
          ) : row.original.appointmentstatus === "CANCELLED" ? (
            <span className="badge bg-danger py-2">CANCELLED</span>
          ) : row.original.appointmentstatus === "RESCHEDULED" ? (
            <span className="badge bg-info py-2">RESCHEDULED</span>
          ) : (
            <span className="badge bg-primary py-2">PENDING</span>
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}getAppointmentDetailsByUserId/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      // toast.error("Error fetching data:", error);
      console.log("Error fetching data:", error);
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
    const tableHeaders3 = ["created_at", "Updated_at"];
    const tableData3 = rows.map((row) => {
      return [row.original.created_at, row.original.updated_at];
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
        
        const mailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Invoice</title>
          <style>
            body { background-color: #ddd; }
            .invoice-box {
              font-size: 12px;
              max-width: 600px;
              background-color: #fff;
              margin: auto;
              padding: 30px;
              border-bottom: 3px solid #0059ff;
              line-height: 24px;
              font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
              color: #555;
              min-height: 85vh;
            }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
            .invoice-box table td { padding: 5px; vertical-align: top; }
            .invoice-box table td.third { text-align: right; }
            .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
            .invoice-box table tr.item.last td { border-bottom: none; }
            .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
            .invoice { padding: 1rem; }
            #scan { float: right; }
            #scan img { max-width: 100%; height: auto; }
            @media print { .invoice-box { border: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="https://crmlah.com/static/media/WebsiteLogo.142f7f2ca4ef67373e74.png"
                          style="width: 75%; max-width: 180px" alt="Logo" />
                      </td>
                      <td class="third">
                        <b>Date:</b> 24-01-2024<br />
                        The Alexcier, 237 Alexandra Road,<br />
                        #04-10, Singapore-159929.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <div class="invoice">
              <h1 style="color: black;">Hi, ${data.appointmentFor}</h1>
              <p style="margin: 2rem 0 0; font-size: 1rem;">
                We regret to inform you that your scheduled appointment has been cancelled at your request. If you have any questions or need further assistance, please do not hesitate to contact us.<br />
              </p>
              <hr />
              <p style=" margin: 2rem 0 0;">See You Soon,</p>
              <h4 style=" margin: 0; ">${data.appointmentOwner}</h4>
              <p style=" margin: 0 ; ">ECS Cloud</p>
              <p style=" margin: 0 0 2rem 0;">Powered by ECS</p>
              <hr />
            </div>
          </div>
        </body>
        </html>`;
  
      try {
        const response = await axios.post(`${API_URL}sendMail`, {
          toMail: data.email,
          fromMail: data.email,
          subject: "Your Appointment Has Been Cancelled",
          htmlContent: mailContent,
        });
  
        if (response.status === 200) {
          // toast.success("Mail sent successfully.");
        } else {
          toast.error("Error sending mail: " + response.data.message);
        }
      } catch (error) {
        toast.error("Failed to send email: " + error.message);
      }
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
        created_at: false,
        updated_at: false,
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
        navigate(`/appointments/show/${row.original.id}`);
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
              <span className="fs-4 fw-bold px-2">Appointments</span>
            </div>
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
