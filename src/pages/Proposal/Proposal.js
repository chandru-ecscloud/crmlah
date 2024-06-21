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

const Proposal = () => {
  const [loading, setLoading] = useState(false);
  const companyId = sessionStorage.getItem("companyId");
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
      // {
      //   accessorKey: "created_at",
      //   header: "Created At",
      //   Cell: ({ row }) => row.original?.createdAt?.substring(0, 10),
      // },
      // {
      //   accessorKey: "updated_at",
      //   header: "Updated At",
      //   Cell: ({ row }) => {
      //     if (row.original.updatedAt) {
      //       return row.original.updatedAt.substring(0, 10);
      //     } else {
      //       return "";
      //     }
      //   },
      // },
    ],
    []
  );


  const handelNavigateClick = () => {
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
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.proposalName,
        row.original.subject,
        row.original.proposalType,
        row.original.description,
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
  const handledelete = async (rows) => {
    const id = rows.map((row) => row.original.id);

    try{
      const response = await axios.delete(
        `${API_URL}deleteCompanyProposal/${id}`,
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        getData();
        table.setRowSelection(false);
      } 
    }catch(error){
      toast.error("Error deleting Data");
    }
  }
  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllCompanyProposalByCompanyId/${companyId}`,
        {
          // headers: {
          //   "Content-Type": "application/json",
          // },
        }
      );

      if (response.status === 200) {
        setDatas(response.data);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
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
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) || table.getSelectedRowModel().rows.length !== 1
                      }
                      onClick={() =>
                        handledelete(table.getSelectedRowModel().rows)
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
