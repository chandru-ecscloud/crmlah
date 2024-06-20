import React, { useMemo, useState } from "react";
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

// Dummy data to be displayed in the table
const dummyData = [
  {
    id: 1,
    proposalName: "Proposal A",
    subject: "Subject A",
    type: "Type A",
    discribtion: "Description A",
    createdAt: "2024-06-19",
    updatedAt: "2024-06-20",
  },
  {
    id: 2,
    proposalName: "Proposal B",
    subject: "Subject B",
    type: "Type B",
    discribtion: "Description B",
    createdAt: "2024-06-18",
    updatedAt: "2024-06-19",
  },
  // Add more dummy data as needed
];

const Proposal = () => {
  const [loading, setLoading] = useState(false); // Set to false as we're using dummy data
  const navigate = useNavigate();
  const role = "CMP_OWNER"; 

  const columns = useMemo(
    () => [
      {
        accessorKey: "proposalName",
        enableHiding: false,
        header: "Proposal Name",
        Cell: ({ row }) => (
          <Link to={`/proposal/show`} className="rowName">
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
        accessorKey: "type",
        enableHiding: false,
        header: "Type",
      },
      {
        accessorKey: "description",
        enableHiding: false,
        header: "Description",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) => row.original.createdAt.substring(0, 10),
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

  const handelNavigateClick = () => {
    navigate("/proposal/create");
  };

  const table = useMaterialReactTable({
    columns,
    data: dummyData,
    initialState: {
      columnVisibility: {},
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
        <button className="btn text-secondary">
          <RiFileExcel2Fill size={23} />
        </button>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
        >
          <button className="btn text-secondary border-0">
            <RiFileExcel2Line size={23} />
          </button>
        </OverlayTrigger>

        <button className="btn text-secondary">
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
        navigate(`/deals/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

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
                  onClick={handelNavigateClick}
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
