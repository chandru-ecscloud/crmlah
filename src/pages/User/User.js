import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
// import { FaSortDown } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { BsFiletypeCsv } from "react-icons/bs";
// import { FaRegFilePdf } from "react-icons/fa";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { Tooltip, Zoom } from "@mui/material";
import TimeSlots from "../TimeSlot/TimeSlots";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const UserActivation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = sessionStorage.getItem("role");
  // console.log(role);
  const navigate = useNavigate();
  // const userId = sessionStorage.getItem("userId");
  const companyId = sessionStorage.getItem("companyId");

  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        enableHiding: false,
        header: "User Name",
        Cell: ({ row }) => (
          <Link to={`/users/show/${row.original.id}`} className="rowName">
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
        header: "Email-Address",
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
        Cell: ({ row }) =>
          row.original.role === "CRM_SUPERADMIN" ? (
            <span
              className="badge bg-info py-2 "
              style={{ color: "#1f1f1f !important" }}
            >
              Super Admin
            </span>
          ) : row.original.role === "CMP_OWNER" ? (
            <span className="badge bg-primary py-2 ">Company Owner</span>
          ) : row.original.role === "CRM_ADMIN" ? (
            <span className="badge bg-warning py-2">Admin</span>
          ) : row.original.role === "CMP_ADMIN" ? (
            <span className="badge bg-warning py-2">Company Admin</span>
          ) : (
            <span className="badge bg-secondary  py-2">Company User</span>
          ),
      },
      {
        accessorKey: "appointmentRoleType",
        enableHiding: false,
        header: "Appointment Role",
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
        Cell: ({ row }) => (
          <span>
            {row.original.countryCode}&nbsp;{row.original.phone}
          </span>
        ),
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
        accessorKey: "zipCode",
        header: "Zip Code",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}getAllUserRegistrationsByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      console.log("Api data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // const handleExportRowsPDF = (rows) => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(20);
  //   doc.text("Leads", 15, 15);

  //   const tableHeaders1 = [
  //     "S.no",
  //     "Lead Name",
  //     "Company Name",
  //     "Email-Address",
  //     "Phone Number",
  //     "Lead Owner",
  //   ];
  //   const tableData1 = rows.map((row, i) => {
  //     return [
  //       i + 1,
  //       row.original.userName,
  //       row.original.companyName,
  //       row.original.email,
  //       row.original.phone,
  //       row.original.lead_owner,
  //     ];
  //   });

  //   autoTable(doc, {
  //     head: [tableHeaders1],
  //     body: tableData1,
  //     startY: 25,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   const tableHeaders2 = [
  //     "Land Line",
  //     "Lead Source",
  //     "Lead Status",
  //     "Street",
  //     "City",
  //   ];
  //   const tableData2 = rows.map((row) => {
  //     return [
  //       row.original.land_line,
  //       row.original.lead_source,
  //       row.original.lead_status,
  //       row.original.street,
  //       row.original.city,
  //     ];
  //   });
  //   autoTable(doc, {
  //     head: [tableHeaders2],
  //     body: tableData2,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   const tableHeaders3 = [
  //     "Zip Code",
  //     "State",
  //     "Country",
  //     "Created By",
  //     "Updated By",
  //   ];
  //   const tableData3 = rows.map((row) => {
  //     return [
  //       row.original.zipCode,
  //       row.original.state,
  //       row.original.country,
  //       row.original.created_by,
  //       row.original.updatedBy,
  //     ];
  //   });
  //   autoTable(doc, {
  //     head: [tableHeaders3],
  //     body: tableData3,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   const tableHeaders4 = ["Description", "Skype ID", "Twitter"];
  //   const tableData4 = rows.map((row) => {
  //     return [
  //       row.original.Description,
  //       row.original.skype_id,
  //       row.original.twitter,
  //     ];
  //   });
  //   autoTable(doc, {
  //     head: [tableHeaders4],
  //     body: tableData4,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   doc.save("ECS.pdf");
  // };

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
    navigate("/users/create");
  };

  const handelProposalNavigate = () => {
    navigate("/proposal");
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        city: false,
        phone: false,
        street: false,
        country: false,
        zipCode: false,
        state: false,
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

        <Tooltip TransitionComponent={Zoom} title="Selected Row">
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          >
            <RiFileExcel2Line size={23} />
          </button>
        </Tooltip>

        <button
          className="btn text-secondary"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //   onClick={() =>
          //     handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          //   }
        >
          <MdPictureAsPdf size={23} />
        </button>
        <Tooltip TransitionComponent={Zoom} title="Selected Row">
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            // onClick={() => handleExportRowsPDF(table.getSelectedRowModel().rows)}
          >
            <MdOutlinePictureAsPdf size={23} />
          </button>
        </Tooltip>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/users/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between py-4 px-3">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">All User</span>
            </div>

            <div className="d-flex" style={{ paddingRight: "10px" }}>
              {/* <button
                className={`btn btn-danger mx-2 ${
                  role === "CMP_USER" && "disabled"
                }`}
                disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
              >
                Time Slot
              </button> */}
               <div style={{ paddingRight: "10px" }}>
                <Link to={"/user/proposal"}>
                  <button
                    className={`btn btn-primary ${role === "CMP_USER" && "disabled"
                      }`}
                    disabled={role === "CMP_USER"}
                  >
                    Proposal
                  </button>
                </Link>
              </div>
              <div style={{ paddingRight: "10px" }}>
                <Link to={"/companyadd"}>
                  <button
                    className={`btn btn-primary ${role === "CMP_USER" && "disabled"
                      }`}
                    disabled={role === "CMP_USER"}
                  >
                    Company
                  </button>
                </Link>
              </div>
              <TimeSlots />
              <button
                className={`btn btn-primary ${
                  role === "CMP_USER" && "disabled"
                }`}
                disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                onClick={handelNavigateClick}
              >
                Create User
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

export default UserActivation;
