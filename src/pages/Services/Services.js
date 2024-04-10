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
import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Services = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const columns = useMemo(
    () => [
      {
        accessorKey: "service_name",
        enableHiding: false,
        header: "Service Name",
        Cell: ({ row }) => (
          <Link to={`/services/show/${row.original.id}`} className="rowName">
            {row.original.first_name}
          </Link>
        ),
      },
      {
        accessorKey: "duration",
        enableHiding: false,
        header: "Duration",
      },
      {
        accessorKey: "price",
        enableHiding: false,
        header: "Price",
      },
      {
        accessorKey: "location",
        enableHiding: false,
        header: "Location",
      },
      {
        accessorKey: "service_owner",
        enableHiding: false,
        header: "Service Owner",
      },
      {
        accessorKey: "members",
        header: "Members",
      },
      {
        accessorKey: "available_day",
        header: "Available Day",
      },
      {
        accessorKey: "available_time",
        header: "Available Time",
      },
      {
        accessorKey: "tax",
        header: "Tax",
      },
      {
        accessorKey: "description_info",
        header: "Description",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      const response = await axios(`${API_URL}allClients`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    navigate("/services/create");
  };

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
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

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}deleteMultipleCServiceData`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/services");
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
        members: false,
        available_day: false,
        available_time: false,
        tax: false,
        description_info: false,
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
        <button className="btn btn-success" onClick={handleExportData}>
          <BsFiletypeCsv />
        </button>
        <button
          className="btn btn-success"
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        >
          <BsFiletypeCsv /> selected row
        </button>
        <button
          className="btn btn-danger"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          }
        >
          <FaRegFilePdf />
        </button>
        <button
          className="btn btn-danger"
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRowsPDF(table.getSelectedRowModel().rows)}
        >
          <FaRegFilePdf /> selected row
        </button>
      </Box>
    ),
  });

  return (
    <section>
      <div className="d-flex align-items-center justify-content-end py-4 px-3">
        <div style={{ paddingRight: "10px" }}>
          <button
            className={`btn btn-primary ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER"}
            onClick={handelNavigateClick}
          >
            Create Service
          </button>
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
            )}
          </ul>
        </div>
      </div>
      <ThemeProvider theme={theme}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </section>
  );
};

export default Services;
