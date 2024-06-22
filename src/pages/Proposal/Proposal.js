import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegFilePdf, FaSortDown } from "react-icons/fa";
import { RiFileExcel2Fill, RiFileExcel2Line } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { download, generateCsv, mkConfig } from "export-to-csv";

// Dummy data to be displayed in the table
const dummyData = [
  {
    id: 1,
    proposalName: "Proposal A",
    subject: "Subject A",
    proposalType: "Type A",
    description: "Description A",
    createdAt: "2024-06-19",
    updatedAt: "2024-06-20",
  },
  {
    id: 2,
    proposalName: "Proposal B",
    subject: "Subject B",
    proposalType: "Type B",
    description: "Description B",
    createdAt: "2024-06-18",
    updatedAt: "2024-06-19",
  },
  // Add more dummy data as needed
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Proposal = () => {
  const [loading, setLoading] = useState(false);
  const companyId = sessionStorage.getItem("companyId");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const role = "CMP_OWNER";
  const [datas, setDatas] = useState([]);
  console.log("data", datas);

  const columns = useMemo(
    () => [
      {
        accessorKey: "proposalName",
        enableHiding: false,
        header: "Proposal Name",
        Cell: ({ row }) => (
          <Link to={`/proposal/show/${row.original.id}`} className="rowName">
            {row.original.proposalName}
          </Link>
        ),
      },
      {
        accessorKey: "subject",
        enableHiding: false,
        header: "Subject",
      },
      {
        accessorKey: "proposalType",
        enableHiding: false,
        header: "Type",
      },
      {
        accessorKey: "description",
        enableHiding: false,
        header: "Description",
      },
    ],
    []
  );

  const handleExportRows = (rows) => {
    if (!rows || rows.length === 0) {
      toast.error("No rows selected for export.");
      return;
    }
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    if (!data || data.length === 0) {
      toast.error("No data available for export.");
      return;
    }
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleNavigateClick = () => {
    navigate("/proposal/create");
  };

  const table = useMaterialReactTable({
    columns,
    data: datas,
    initialState: {
      columnVisibility: {},
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}
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
          <button className="btn text-secondary border-0">
            <MdOutlinePictureAsPdf size={23} />
          </button>
        </OverlayTrigger>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/proposal/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Deals", 15, 15);
    const tableHeaders1 = [
      "S.no",
      "Proposal Name",
      "Subject",
      "Subject Type",
      "Description",
    ];
    const tableData1 = rows.map((row, i) => [
      i + 1,
      row.original.proposalName,
      row.original.subject,
      row.original.proposalType,
      row.original.description,
    ]);
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

  const handleDelete = async (rows) => {
    const ids = rows.map((row) => row.original.id);
    try {
      const response = await axios.delete(
        `${API_URL}deleteCompanyProposal/${ids}`
      );
      if (response.status === 201) {
        toast.success("Deleted successfully.");
        getData();
        table.setRowSelection(false);
      }
    } catch (error) {
      toast.error("Error deleting data: " + error.message);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllCompanyProposalByCompanyId/${companyId}`
      );
      if (response.status === 200) {
        setDatas(response.data);
        setData(response.data);
        toast.success("Data fetched successfully.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch data: " + error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">Proposal</span>
            </div>
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <button
                  className={`btn btn-primary ${
                    role === "CMP_USER" && "disabled"
                  }`}
                  disabled={role === "CMP_USER"}
                  onClick={handleNavigateClick}
                >
                  Create Proposal
                </button>
              </div>
              <div className="dropdown-center">
                <button
                  className="btn btn-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={role === "CMP_USER"}
                >
                  Action <FaSortDown style={{ marginTop: "-6px" }} />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                      onClick={() =>
                        handleDelete(table.getSelectedRowModel().rows)
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

export default Proposal;
