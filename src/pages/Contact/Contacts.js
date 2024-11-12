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
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import TableDeleteModel from "../../components/common/TableDeleteModel";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Contacts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "Contact Name",
        Cell: ({ row }) => (
          <Link to={`/contacts/show/${row.original.id}`} className="rowName">
            {row.original.firstName}
          </Link>
        ),
      },
      {
        accessorKey: "email",
        header: "Email-Address",
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
        Cell: ({ row }) => (
          <span>
            {row.original.countryCode}&nbsp;&nbsp;{row.original.phone}
          </span>
        ),
      },
      {
        accessorKey: "contactOwner",
        header: "Contact Owner",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "leadSource",
        header: "Lead Source",
      },
      {
        accessorKey: "accountName",
        header: "Account Name",
      },
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
      },
      {
        accessorKey: "landLine",
        header: "Land Line",
      },
      {
        accessorKey: "skypeId",
        header: "Skype Id",
      },
      {
        accessorKey: "twitter",
        header: "Twitter",
      },
      {
        accessorKey: "mailingStreet",
        header: "Mailing Street",
      },
      {
        accessorKey: "mailingCity",
        header: "Mailing City",
      },
      {
        accessorKey: "mailingState",
        header: "Mailing State",
      },
      {
        accessorKey: "mailingZip",
        header: "Mailing Zip",
      },
      {
        accessorKey: "mailingCountry",
        header: "Mailing Country",
      },
      {
        accessorKey: "otherStreet",
        header: "Other Street",
      },
      {
        accessorKey: "otherCity",
        header: "Other City",
      },
      {
        accessorKey: "otherState",
        header: "other State",
      },
      {
        accessorKey: "otherZip",
        header: "Other Zip",
      },
      {
        accessorKey: "otherCountry",
        header: "Other Country",
      },
      {
        accessorKey: "descriptionInfo",
        header: "Description",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) => {
          if (row.original.createdAt) {
            return row.original.createdAt.substring(0, 10);
          } else {
            return "";
          }
        },
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
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
      {
        accessorKey: "updatedBy",
        header: "Updated By",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}allContactsByCompanyId/${companyId}`,
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

  useEffect(() => {
    fetchData();
  }, []);

  const filterFields = (data) =>
    data.map((row, index) => ({
      "S.no": index + 1,
      "Contact Name": row.contactName,
      "Contact Owner": row.contactOwner,
      "Email-Address": row.email,
      "Phone Number": row.phone,
      "Company": row.companyName,
    }));
  const handleExportRows = (selectedRows = []) => {
    const dataToExport = selectedRows.length
      ? filterFields(selectedRows.map((row) => row.original))
      : filterFields(data);

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename =
      selectedRows.length === 1
        ? `${selectedRows[0].original.contactName}_${timestamp}.csv`
        : `Contact_list_${timestamp}.csv`;

    const csvContent = [
      Object.keys(dataToExport[0]).join(","), // CSV headers
      ...dataToExport.map((row) => Object.values(row).join(",")), // CSV rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Contacts", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Contact Name",
      "Company",
      "Email-Address",
      "Phone Number",
      "Contact Owner",
    ];

    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.contactName,
        row.original.firstName,
        row.original.email,
        row.original.phone,
        row.original.contactOwner,
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

    // const tableHeaders2 = [
    //   "Land Line",
    //   "Lead Source",
    //   "Lead Status",
    //   "Street",
    //   "City",
    // ];
    // const tableData2 = rows.map((row) => {
    //   return [
    //     row.original.land_line,
    //     row.original.lead_source,
    //     row.original.lead_status,
    //     row.original.street,
    //     row.original.city,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders2],
    //   body: tableData2,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    // const tableHeaders3 = [
    //   "Zip Code",
    //   "State",
    //   "Country",
    //   "Created By",
    //   "Updated By",
    // ];

    // const tableData3 = rows.map((row) => {
    //   return [
    //     row.original.zipCode,
    //     row.original.state,
    //     row.original.country,
    //     row.original.created_by,
    //     row.original.updatedBy,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders3],
    //   body: tableData3,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    // const tableHeaders4 = [
    //   "Description",
    //   "Skype ID",
    //   "Twitter",
    //   "Created At",
    //   "Updated At",
    // ];
    // const tableData4 = rows.map((row) => {
    //   return [
    //     row.original.Description,
    //     row.original.skype_id,
    //     row.original.twitter,
    //     row.original.createdAt,
    //     row.original.updatedAt,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders4],
    //   body: tableData4,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Format timestamp
    const filename =
      rows.length === 1
        ? `${rows[0].original.firstName}_${timestamp?.slice(0,10)}.pdf`
        : `Contacts_List_${timestamp?.slice(0,10)}.pdf`;

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

  const handleLeadConvert = async (rows) => {
    const id = rows.map((row) => row.original.id);

    try {
      const response = await axios.post(
        `${API_URL}contactToLeadConvert/${id}?ownerName=${owner}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/contacts");
        fetchData();
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Submiting Data");
    }
  };

  const handleAccountConvert = async (rows) => {
    const id = rows.map((row) => row.original.id);

    try {
      const response = await axios.post(
        `${API_URL}contactToAccountConvert/${id}?ownerName=${owner}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/contacts");
        fetchData();
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Submiting Data");
    }
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    const formattedRowData = rowData.join(",");

    const formData = new FormData();
    formData.append("contactIds", formattedRowData);
    formData.append("ownerName", owner);

    try {
      const response = await axios.post(
        `${API_URL}contactToLeadConvertMultiple`,
        formData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/contacts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  const handelNavigateClick = () => {
    navigate("/contacts/create");
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        lastName: false,
        leadSource: false,
        accountName: false,
        vendorName: false,
        landLine: false,
        skypeId: false,
        twitter: false,
        mailingCity: false,
        mailingStreet: false,
        mailingState: false,
        mailingZip: false,
        mailingCountry: false,
        otherStreet: false,
        otherCity: false,
        otherState: false,
        otherZip: false,
        otherCountry: false,
        descriptionInfo: false,
        createdAt: false,
        createdBy: false,
        updatedAt: false,
        updatedBy: false,
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
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Download CSV</Tooltip>}
        >
          <button
            className="btn text-secondary"
            //  onClick={handleExportData}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows;
              handleExportRows(selectedRows);
            }}
          >
            <RiFileExcel2Fill size={23} />
          </button>
        </OverlayTrigger>
        {/* 
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
        </OverlayTrigger> */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Download PDF</Tooltip>}
        >
          <button
            className="btn text-secondary"
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            // onClick={() =>
            //   handleExportRowsPDF(table.getPrePaginationRowModel().rows)
            // }
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows;
              if (selectedRows.length === 1) {
                handleExportRowsPDF(selectedRows);
              } else {
                handleExportRowsPDF(table.getPrePaginationRowModel().rows);
              }
            }}
          >
            <MdPictureAsPdf size={23} />
          </button>
        </OverlayTrigger>
        {/* <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
        >
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() =>
              handleExportRowsPDF(table.getSelectedRowModel().rows)
            }
          >
            <MdOutlinePictureAsPdf size={23} />
          </button>
        </OverlayTrigger> */}
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/contacts/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">Contact ({data.length})</span>
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
                  Create Contact
                </button>
              </div>
              <div class="dropdown-center">
                <button
                  class="btn btn-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={role === "CMP_USER"}
                >
                  Action <FaSortDown style={{ marginTop: "-6px" }} />
                </button>
                <ul class="dropdown-menu">
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
                        handleAccountConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Convert
                    </button>
                  </li>
                  <li>
                    <TableDeleteModel
                      rows={table.getSelectedRowModel().rows}
                      rowSelected={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        )
                      }
                      handleBulkDelete={handleBulkDelete}
                      onSuccess={() => {
                        table.setRowSelection(false);
                        fetchData();
                      }}
                    />
                  </li>
                  {/* <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) || table.getSelectedRowModel().rows.length === 1
                      }
                      onClick={() =>
                        handleBulkDelete(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Delete
                    </button>
                  </li> */}
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

export default Contacts;
