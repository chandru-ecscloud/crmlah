import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Event = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");

  const columns = useMemo(
    () => [
      {
        accessorKey: "eventName",
        enableHiding: false,
        header: "Event Name",
        Cell: ({ row }) => (
          <Link to={`/events/show/${row.original.id}`} className="rowName">
            {row.original.eventName}
          </Link>
        ),
      },
      {
        accessorKey: "firstName",
        enableHiding: false,
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        enableHiding: false,
        header: "Last Name",
      },
      {
        accessorKey: "phone",
        enableHiding: false,
        header: "Phone",
      },
      {
        accessorKey: "businessEmail",
        enableHiding: false,
        header: "Email",
      },
      {
        accessorKey: "eventStatus",
        enableHiding: false,
        header: "Event Status",
        Cell: ({ row }) =>
          row.original.eventStatus === "INPROCESS" ? (
            <span
              className="badge bg-info py-2"
              style={{ color: "#1f1f1f !important" }}
            >
              INPROCESS
            </span>
          ) : row.original.eventStatus === "NEW" ? (
            <span className="badge bg-primary py-2 ">NEW</span>
          ) : row.original.eventStatus === "APPROVED" ? (
            <span className="badge bg-success py-2">APPROVED</span>
          ) : row.original.eventStatus === "RESCHEDULED" ? (
            <span className="badge bg-warning py-2">RESCHEDULED</span>
          ) : row.original.eventStatus === "CANCELLED" ? (
            <span className="badge bg-danger py-2">CANCELLED</span>
          ) : (
            <span className="badge bg-warning  py-2">Pending</span>
          ),
      },
      {
        accessorKey: "eventDate",
        header: "Event Date",
        Cell: ({ row }) => row.original.eventDate.substring(0, 10),
      },
      {
        accessorKey: "enquiry",
        header: "Enquiry",
      },
      {
        accessorKey: "eventDescription",
        header: "Event Description",
      },
      {
        accessorKey: "eventLink",
        header: "Event Link",
      },
      {
        accessorKey: "eventStatus",
        header: "Event Status",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString(),
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        Cell: ({ row }) => {
          if (row.original.updatedAt) {
            return row.original.updatedAt.substring(0, 10);
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
        `${API_URL}getAllEventManagement`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`, 
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}deleteEventManagement/${id}`,
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
        navigate("/event");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handelNavigateClick = () => {
    navigate("/deals/create");
  };
  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Deals", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Deal Name",
      "Account Name",
      "Contact Name",
      "Deal Owner",
      "Amount",
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.dealName,
        row.original.accountName,
        row.original.contactName,
        row.original.dealOwner,
        row.original.amount,
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
      "Closing Date",
      "Lead Source",
      "Stage",
      "Probability",
      "Campaign Source",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.closingDate,
        row.original.leadSource,
        row.original.stage,
        row.original.probability,
        row.original.campaignSource,
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

    const tableHeaders5 = ["Description", "CreatedAt", "UpdatedAt"];
    const tableData5 = rows.map((row) => {
      return [
        row.original.descriptionInfo,
        row.original.createdAt,
        row.original.updatedAt,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders5],
      body: tableData5,
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

  const table = useMaterialReactTable({
    columns,
    data,
    columnVisibility: {
      eventName: false,
      firstName: false,
      lastName: false,
      phone: false,
      businessEmail: false,
      eventDate: false,
      enquiry: false,
      eventDescription: false,
      eventStatus: false,
      skypeId: false,
      twitter: false,
      sources: false,
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/event/view/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
            
          <div className="d-flex align-items-center justify-content-end">
            <div className="d-flex align-items-center  justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <Link to="/event/add">
                  <button className="btn btn-primary">
                    Create Event
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`dropdown-center ${role === "CMP_USER" && "disabled"
                }`}
            >
              <button
                className="btn btn-danger dropdown-toggle"
                // disabled={role === "CMP_USER"}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Action <FaSortDown style={{ marginTop: "-6px" }} />
              </button>
              <ul className="dropdown-menu">
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

export default Event;
