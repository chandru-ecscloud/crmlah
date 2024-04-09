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
import DealsModel from "./DealsModel";
import ProductsModel from "../Quotes/ProductModel";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Example = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        enableHiding: false,
        header: "Subject",
        Cell: ({ row }) => (
          <Link
            style={{ textDecoration: "none" }}
            className="rowName"
            to={`/invoices/show/${row.original.id}`}
          >
            {row.original.subject}
          </Link>
        ),
      },
      {
        accessorKey: "status",
        enableHiding: false,
        header: "Status",
      },
      {
        accessorKey: "invoiceDate",
        enableHiding: false,
        header: "Invoice Date",
        Cell: ({ row }) => {
          const invoiceDate = row.original.invoiceDate;

          if (invoiceDate) {
            const formattedDate = new Date(invoiceDate).toLocaleDateString(
              "en-GB"
            );
            return (
              <div>
                <div>{formattedDate}</div>
              </div>
            );
          } else {
            return null;
          }
        },
      },
      {
        accessorKey: "invoiceOwner",
        enableHiding: false,
        header: "Invoice Owner",
      },
      {
        accessorKey: "salesOrder",
        header: "Sales Order",
      },
      {
        accessorKey: "purchaseOrder",
        header: "Purchase Order",
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
      },
      {
        accessorKey: "salesCommission",
        header: "Sales Commission",
      },
      {
        accessorKey: "accountName",
        header: "Account Name",
      },
      {
        accessorKey: "contactName",
        header: "Contact Name",
      },
      {
        accessorKey: "dealName",
        header: "Deal Name",
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

      {
        accessorKey: "createdAt",
        header: "Created At",
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },

      {
        accessorKey: "updatedAt",
        header: "Updated At",
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
        `${API_URL}allInvoicesByCompanyId/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    navigate("/invoices/create");
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

  const handleAssignProducts = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    sessionStorage.setItem("invoice_id", rowData);
    // navigate("/products");
  };

  const handleAssignDeals = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    sessionStorage.setItem("invoice_id", rowData);
    // navigate("/deals");
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}deleteMultipleInvoiceData`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/invoices");
        table.setRowSelection(false);
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
        salesOrder: false,
        purchaseOrder: false,
        dueDate: false,
        salesCommission: false,
        accountName: false,
        contactName: false,
        dealName: false,

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

        productName: false,
        quantity: false,
        listPrice: false,
        amount: false,
        discount: false,
        tax: false,
        total: false,
        adjustment: false,
        grandTotal: false,
        itemDescription: false,
        termsAndConditions: false,
        description: false,
        createdAt: false,
        createdBy: false,
        updatedAt: false,
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
        <button className="btn btn-danger" onClick={handleExportData}>
          <FaRegFilePdf />
        </button>
        <button
          className="btn btn-danger"
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        >
          <FaRegFilePdf /> selected row
        </button>
      </Box>
    ),
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-end py-4 px-3">
            <div style={{ paddingRight: "10px" }}>
              <button
                className={`btn btn-primary ${
                  role === "CMP_USER" && "disabled"
                }`}
                disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                onClick={handelNavigateClick}
              >
                Create Invoice
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
                    <li>
                      <button
                        // className="btn"
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
                        <ProductsModel />
                      </button>
                    </li>
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
                          handleAssignDeals(table.getSelectedRowModel().rows)
                        }
                      >
                        <DealsModel />
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
        </>
      )}
    </section>
  );
};

export default Example;
