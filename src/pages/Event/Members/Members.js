import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../Config/URL";
import { toast } from "react-toastify";
import { FaSortDown } from "react-icons/fa";

const Members = () => {
  const {id} = useParams()
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  // console.log("data", data);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}getEventMemberEventManagementId/${id}`,
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "companyName",
        enableHiding: false,
        header: "Company Name",
      },
      {
        accessorKey: "firstName",
        enableHiding: false,
        header: "First Name",
      },
      {
        accessorKey: "businessEmail",
        enableHiding: false,
        header: "Bussiness Email",
      },
      {
        accessorKey: "phone",
        enableHiding: false,
        header: "Phone",
      },
      {
        accessorKey: "eventMemberStatus",
        enableHiding: false,
        header: "Member Status",
        Cell: ({ row }) =>
          row.original.eventMemberStatus === "NEW" ? (
            <span
              className="badge bg-info py-2"
              style={{ color: "#1f1f1f !important" }}
            >
              NEW
            </span>
          ) : row.original.eventMemberStatus === "APPROVED" ? (
            <span className="badge bg-success  py-2">APPROVED</span>
          ) : (
            <span className="badge bg-danger  py-2">REJECTED</span>
          ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data,
    initialState: {
      columnVisibility: {},
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/members/view/${row.original.id}?eventId=${id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  const handleBulkDelete = async (rows) => {
    if (!rows.length) {
      toast.error("No rows selected for deletion");
      return;
    }
    const ids = rows.map((row) => row.original.id);
    try {
      const responses = await Promise.all(
        ids.map((id) =>
          axios.delete(`${API_URL}deleteEventMembers/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        )
      );
      const allSuccessful = responses.every((response) => response.status === 201);
      if (allSuccessful) {
        toast.success("Members deleted successfully");
        navigate("/members");
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

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-end">
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <Link to={`/members/add?eventId=${id}`}>
                  <button className={`btn btn-primary`}>Create Members</button>
                </Link>
              </div>

              {/* <div
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
              </div> */}
              <div style={{ paddingLeft: "10px" }}>
                <Link to={`/event/view/${id}`}>
                  <button
                    className={`btn btn-light `}
                    style={{ border: "1px solid #000" }}
                  >
                    Back
                  </button>
                </Link>
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

export default Members;
