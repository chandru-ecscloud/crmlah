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
import ProductModel from "./ProductModel";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Quotes = () => {
  const [data, setData] = useState([]);
  const [rowId, setRowId] = useState("");
  // console.log("rowId",rowId)
  // console.log(data)
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "dealName",
        enableHiding: false,
        header: "Quote Name",
        Cell: ({ row }) => (
          <Link to={`/quotes/show/${row.original.id}`} className="rowName">
            {row.original.dealName}
          </Link>
        ),
      },
      {
        accessorKey: "subject",
        enableHiding: false,
        header: "Subject",
      },
      {
        accessorKey: "quoteStage",
        enableHiding: false,
        header: "Quote Stages",
      },
      {
        accessorKey: "quoteOwner",
        enableHiding: false,
        header: "Quotes Owner",
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
        accessorKey: "product",
        header: "Product",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
      },
      {
        accessorKey: "contactName",
        header: "Contact Name",
      },
      {
        accessorKey: "accountName",
        header: "Account Name",
      },

      {
        accessorKey: "adjustment",
        header: "Adjustment",
      },
      {
        accessorKey: "validUntil",
        header: "Valid Until",
      },
      {
        accessorKey: "shippingStreet",
        header: "Shipping Street",
      },
      {
        accessorKey: "shippingCity",
        header: "Shipping City",
      },
      {
        accessorKey: "shippingState",
        header: "Shipping State",
      },
      {
        accessorKey: "shippingCode",
        header: "Shipping Code",
      },
      {
        accessorKey: "shippingCountry",
        header: "Shipping Country",
      },
      {
        accessorKey: "billingStreet",
        header: "Billing Street",
      },

      {
        accessorKey: "billingCity",
        header: "Billing City",
      },

      {
        accessorKey: "billingState",
        header: "Billing State",
      },

      {
        accessorKey: "billingCode",
        header: "Billing Code",
      },
      {
        accessorKey: "billingCountry",
        header: "Billing Country",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}allQuotesByCompanyId/${companyId}`,
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

  const handelNavigateClick = () => {
    navigate("/quotes/create");
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleAssignProducts = async (rows) => {
    setRowId(() => rows.map((row) => row.original.id));
  };
  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Quotes", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Deals Name",
      "Subject",
      "Quote Stages",
      "Quotes Owner",
      "Product",
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.dealName,
        row.original.subject,
        row.original.quoteStage,
        row.original.quoteOwner,
        row.original.product,
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

    const tableHeaders2 = [
      "Quantity",
      "Price",
      "Total Amount",
      "Contact Name",
      "Account Name",
      "Adjustment",
      "Created At",
      "Updated At",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.quantity,
        row.original.price,
        row.original.totalAmount,
        row.original.contactName,
        row.original.accountName,
        row.original.adjustment,
        row.original.createdAt,
        row.original.updatedAt,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders2],
      body: tableData2,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    const tableHeaders3 = [
      "Valid Until",
      "Shipping Street",
      "Shipping City",
      "Shipping State",
      "Shipping Code",
    ];
    const tableData3 = rows.map((row) => {
      return [
        row.original.validUntil,
        row.original.shippingStreet,
        row.original.shippingCity,
        row.original.shippingState,
        row.original.shippingCode,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders3],
      body: tableData3,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });
    const tableHeaders4 = [
      "Shipping Country",
      "Billing Street",
      "Billing City",
      "Billing State",
      "Billing Code",
      "Billing Country",
    ];
    const tableData4 = rows.map((row) => {
      return [
        row.original.shippingCountry,
        row.original.billingStreet,
        row.original.billingCity,
        row.original.billingState,
        row.original.billingCode,
        row.original.billingCountry,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders4],
      body: tableData4,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    // console.log("tableData",tableData1)
    // console.log("tableHeaders",tableHeaders1 )
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

  const handleSendQuote = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    const accountId = sessionStorage.getItem("account_id");
    try {
      const response = await axios.post(
        `${API_URL}associateQuotesWithAccount/${accountId}`,
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
        sessionStorage.removeItem("account_id");
        navigate("/accounts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    const keyMapping = {
      product: "product",
      quantity: "quantity",
      price: "price",
      discount: "discount",
      totalAmount: "total_amount",
      itemDescription: "item_description",
      description: "description",
      termsAndConditions: "terms_and_conditions",
      tax: "tax",
      adjustment: "adjustment",
      grandTotal: "grand_total",
      quoteOwner: "quote_owner",
      subject: "subject",
      quoteStage: "quote_stage",
      dealName: "deal_name",
      validUntil: "valid_until",
      contactName: "contact_name",
      accountName: "account_name",
      billingStreet: "billing_street",
      billingCity: "billing_city",
      billingState: "billing_state",
      billingCode: "billing_code",
      billingCountry: "billing_country",
      shippingStreet: "shipping_street",
      shippingCity: "shipping_city",
      shippingState: "shipping_state",
      shippingCode: "shipping_code",
      shippingCountry: "shipping_country",
      createdAt: "created_at",
      createdBy: "created_by",
      updatedAt: "updated_at",
      updatedBy: "updated_by",
      companyId: "company_id",
    };

    const transformedData = rowData.map((data) => {
      return Object.keys(data).reduce((acc, key) => {
        const newKey = keyMapping[key] || key;
        acc[newKey] = data[key];
        return acc;
      }, {});
    });

    try {
      const response = await axios.post(
        `${API_URL}deleteMultipleQuoteData`,
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/quotes");
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
        contactName: false,
        accountName: false,

        billingStreet: false,
        billingCity: false,
        billingState: false,
        billingCode: false,
        billingCountry: false,
        shippingStreet: false,
        shippingCity: false,
        shippingState: false,
        shippingCode: false,
        shippingCountry: false,

        product: false,
        quantity: false,
        price: false,
        discount: false,
        tax: false,
        total: false,
        totalAmount: false,
        adjustment: false,
        validUntil: false,
        grandTotal: false,
        itemDescription: false,
        termsAndConditions: false,
        description: false,
        // createdAt: false,
        createdBy: false,
        // updatedAt: false,
        updatedBy: false,
        companyId: false,
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
        </OverlayTrigger>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/quotes/show/${row.original.id}`);
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
              <span className="fs-4 fw-bold px-2">Quotes</span>
            </div>
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <button
                  className={`btn btn-primary ${
                    role === "CMP_USER" && "disabled"
                  }`}
                  disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                  onClick={handelNavigateClick}
                >
                  Create Quotes
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
                  {role === "CRM_SUPERADMIN" ? (
                    <>
                      {/* <li>
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
                          handleAssignProducts(table.getSelectedRowModel().rows)
                        }
                      >
                        <ProductModel
                          // onSuccess={refreshData}
                          path={`associateProductsWithQuote/${rowId}`}
                        />
                      </button>
                    </li> */}
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
                          Assign Products
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Send Quote
                        </button>
                      </li>
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
          </div>

          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
          </ThemeProvider>
        </>
      )}
    </section>
  );
};

export default Quotes;
