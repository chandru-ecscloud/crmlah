import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../Config/URL";
import { toast } from "react-toastify";
import { FaSortDown } from "react-icons/fa";
// const dummyData = [
//   {
//     id: 1,
//     CompanyName: "ECS",
//     FirstName: "Sakthivel",
//     Email: "Sakthiveljayabal23@gmail.com",
//     phone: "6345674567",
//   },
//   {
//     id: 2,
//     CompanyName: "ECS",
//     FirstName: "Prem",
//     Email: "Prem@gmail.com",
//     phone: "6345674567",
//   },
//   {
//     id: 3,
//     CompanyName: "ECS",
//     FirstName: "Chandru",
//     Email: "Chandru@gmail.com",
//     phone: "6345674567",
//   },
// ];

const Members = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  console.log("data", data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios(`${API_URL}getAllEventMembers`);
        setData(response.data);
      } catch (error) {
        toast.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        navigate(`/members/view/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });
  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.delete(
        `${API_URL}deleteEventMembers/${rows.original.id}`,
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
        navigate("/members");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
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

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-end">
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <Link to="/members/add">
                  <button className={`btn btn-primary`}>Create Members</button>
                </Link>
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

export default Members;
