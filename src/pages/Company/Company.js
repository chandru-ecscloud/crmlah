import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf } from "react-icons/md";
import { Tooltip, Zoom } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Company = () => {
  const [data, setData] = useState([]);
  const [rowId, setRowId] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        enableHiding: false,
        header: "User Name",
        Cell: ({ row }) => (
          <Link to={`/company/show/${row.original.id}`} className="rowName">
            {row.original.userName}
          </Link>
        ),
      },
      {
        accessorKey: "companyName",
        enableHiding: false,
        header: "Company Name",
      },
      {
        accessorKey: "email",
        enableHiding: false,
        header: "Email",
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
        accessorKey: "registrationStatus",
        enableHiding: false,
        header: "Status",
        Cell: ({ row }) =>
          row.original.registrationStatus === "APPROVED" ? (
            <span
              className="badge bg-success py-2 "
              style={{ color: "#1f1f1f !important" }}
            >
              Approved
            </span>
          ) : row.original.registrationStatus === "REJECTED" ? (
            <span className="badge bg-danger py-2 ">Rejected</span>
          ) : (
            <span className="badge bg-warning  py-2">Pending</span>
          ),
      },
      {
        accessorKey: "role",
        enableHiding: false,
        header: "Role",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(`${API_URL}getCompanyOwnerList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const download = (csvConfig, filename = "export.csv") => (csv) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const companyName = rowData[0]?.companyName || "default"; // Use first index or a default name
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig, `${companyName}.csv`)(csv);
  };


  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig, "Company_list.csv")(csv);
  };

  // Export Rows PDF
  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Company", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "User Name",
      "Company Name",
      "Email",
      "Phone Number",
      "Status",
      "Roll",
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.userName,
        row.original.companyName,
        row.original.email,
        row.original.phone,
        row.original.registrationStatus,
        row.original.role,
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
    const filename = rows.length > 0 ? `${rows[0].original.companyName}.pdf` : "Company_list.pdf";
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

  const handelNavigateClick = () => {
    navigate("/company/create");
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
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
        <Tooltip TransitionComponent={Zoom} title="CSV">
          <button
            className="btn text-secondary"
            onClick={() => {
              if (table.getIsSomeRowsSelected()) {
                // Export only the selected rows
                const rowsToExport = table.getSelectedRowModel().rows;
                handleExportRows(rowsToExport);
              } else {
                // Export all rows
                handleExportData();
              }
            }}
          >
            <RiFileExcel2Fill size={23} />
          </button>
        </Tooltip>

        <Tooltip TransitionComponent={Zoom} title="PDF">
          <button
            className="btn text-secondary"
            onClick={() => {
              const rowsToExport = table.getIsSomeRowsSelected()
                ? table.getSelectedRowModel().rows
                : table.getPrePaginationRowModel().rows;
              handleExportRowsPDF(rowsToExport);
            }}
          >
            <MdPictureAsPdf size={23} />
          </button>
        </Tooltip>
      </Box>
    ),

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/company/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-end py-4 px-3">
            <div style={{ paddingRight: "10px" }}>
              <button
                className={`btn btn-primary ${role === "CMP_USER" && "disabled"
                  }`}
                disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                onClick={handelNavigateClick}
              >
                Create Company
              </button>
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

export default Company;
