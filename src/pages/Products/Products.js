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
import * as XLSX from "xlsx";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Products = () => {
  const [data, setData] = useState([]);
  // console.log("Api Product Data",data);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");

  const columns = useMemo(
    () => [
      {
        accessorKey: "productName",
        enableHiding: false,
        header: "Product Name",
        Cell: ({ row }) => (
          <Link to={`/products/show/${row.original.id}`} className="rowName">
            {row.original.productName}
          </Link>
        ),
      },
      {
        accessorKey: "productCode",
        enableHiding: false,
        header: "Product Code",
      },
      // {
      //   accessorKey: "vendorName",
      //   enableHiding: false,
      //   header: "Vendor Name",
      // },
      {
        accessorKey: "productOwner",
        enableHiding: false,
        header: "Product Owner",
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
      {
        accessorKey: "productActive",
        header: "Product Active",
        Cell: ({ value }) => (value ? "Active" : "Inactive"),
      },
      {
        accessorKey: "productCategory",
        header: "Product Category",
      },

      {
        accessorKey: "salesStartDate",
        header: "Sales Start Date",
      },
      {
        accessorKey: "salesEndDate",
        header: "Sales End Date",
      },
      {
        accessorKey: "supportStartDate",
        header: "Support Start Date",
      },
      {
        accessorKey: "supportEndDate",
        header: "Support End Date",
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
      setLoading(true);
      const response = await axios(
        `${API_URL}allProductsByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
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
      "Product Name": row.productName,
      "Product Code": row.productCode,
      "Vendor Name": row.vendorName,
      "Product Active": row.productActive,
      "Product Owner": row.productOwner,
    }));
  const handleExportRows = (selectedRows = []) => {
    const dataToExport = selectedRows.length
      ? filterFields(selectedRows.map((row) => row.original))
      : filterFields(data);

    const totalRow = {
      "S.no": "",
      "Product Name": "",
      "Product Code": "",
      "Vendor Name": "Total Records",
      "Product Active": dataToExport.length,
      "Product Owner": "",
    };
    dataToExport.push(totalRow);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const uniformWidth = 20;
    ws["!cols"] = Array(Object.keys(dataToExport[0]).length).fill({
      wch: uniformWidth,
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product");

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename =
      selectedRows.length === 1
        ? `${selectedRows[0].original.productName}_${timestamp}.xlsx`
        : `Product_list_${timestamp}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  const handelNavigateClick = () => {
    navigate("/products/create");
  };

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Product", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Product Name",
      "Product Code",
      "Vendor Name",
      "Product Owner",
      "Product Active",
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.productName,
        row.original.productCode,
        row.original.vendorName,
        row.original.productOwner,
        row.original.productActive,
      ];
    });
    if (rows.length > 1) {
      tableData1.push(["", "", "Total Records", rows.length, "", ""]);
    }

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
    //   "Product Category",
    //   "Sales Start Date",
    //   "Sales End Date",
    // ];
    // const tableData2 = rows.map((row) => {
    //   return [
    //     row.original.productCategory,
    //     row.original.salesStartDate,
    //     row.original.salesEndDate,
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
    //   "Support Start Date",
    //   "Support End Date",
    //   "Description",
    //   "Created At",
    //   "Updated At",
    // ];
    // const tableData3 = rows.map((row) => {
    //   return [
    //     row.original.createdAt,
    //     row.original.updatedAt,
    //     row.original.supportStartDate,
    //     row.original.supportEndDate,
    //     row.original.description_info,
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

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Format timestamp
    const filename =
      rows.length === 1
        ? `${rows[0].original.productName}_${timestamp?.slice(0, 10)}.pdf`
        : `Product_List_${timestamp?.slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  const handleSendProductsToInvoice = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    const invoiceId = sessionStorage.getItem("invoice_id");
    try {
      const response = await axios.post(
        `${API_URL}associateProductsWithInvoice/${invoiceId}`,
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
        sessionStorage.removeItem("invoice_id");
        navigate("/invoices");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  const handleSendProductsToQuote = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    const quoteId = sessionStorage.getItem("quote_id");
    try {
      const response = await axios.post(
        `${API_URL}associateProductsWithQuote/${quoteId}`,
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
        sessionStorage.removeItem("quote_id");
        navigate("/quotes");
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

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}deleteMultipleProductData`,
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
        navigate("/products");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    } finally {
      fetchData();
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        productCategory: false,
        productActive: false,
        salesStartDate: false,
        salesEndDate: false,
        supportStartDate: false,
        supportEndDate: false,
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
        {table.getPrePaginationRowModel().rows.length !== 0 && (
          <>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="selected-row-tooltip">Download CSV</Tooltip>
              }
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
              overlay={
                <Tooltip id="selected-row-tooltip">Download PDF</Tooltip>
              }
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
          </>
        )}
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/products/show/${row.original.id}`);
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
              <span className="fs-4 fw-bold px-2">
                Products ({data.length})
              </span>
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
                  Create Product
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

export default Products;
