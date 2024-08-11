import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable, } from "material-react-table";
import { LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";

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
        enableHiding: false,
        Cell: ({ row }) => {
          if (row.original.eventDate) {
             return row?.original?.eventDate?.substring(0, 10);
          } else {
            return "";
          }
        },
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
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) => {
          if (row.original.created_at) {
             return row.original.created_at.substring(0, 10);
          } else {
            return "";
          }
        },
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
        `${API_URL}getAllEventManagementByCompanyId/${companyId}`,
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
    if (!rows.length) {
      toast.error("No rows selected for deletion");
      return;
    }
    const ids = rows.map((row) => row.original.id);
    try {
      const responses = await Promise.all(
        ids.map((id) =>
          axios.delete(`${API_URL}deleteEventManagement/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        )
      );
      const allSuccessful = responses.every((response) => response.status === 201);
      if (allSuccessful) {
        toast.success("Events deleted successfully");
        navigate("/event");
        table.setRowSelection(false);
      } else {
        toast.error("Some deletions failed");
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };
  
  useEffect(() => {
    fetchData();
  }, []);

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
    initialState: {
      columnVisibility: {
        eventLink: false,
        eventDescription: false,
        enquiry: false
      },
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
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <Link to="/event/add">
                  <button className={`btn btn-primary`}>Create Event</button>
                </Link>
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
