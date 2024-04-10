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
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  // const refreshData = async () => {
  //   // destroyDataTable();
  //   setLoading(true);
  //   try {
  //     const response = await axios(`${API_URL}allQuotesByCompanyId/${userId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setData(response.data);
  //     // initializeDataTable();
  //   } catch (error) {
  //     console.error("Error refreshing data:", error);
  //   }
  //   setLoading(false);
  // };

  const columns = useMemo(
    () => [
      {
        accessorKey: "dealName",
        enableHiding: false,
        header: "Deals Name",
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
      const response = await axios(`${API_URL}allQuotesByCompanyId/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
    const rowData = rows.map((row) => row.original.id);
    setRowId(rowData)
    // sessionStorage.setItem("quote_id", rowData);
    // openModal();
    // navigate("/products");
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
                    <li>
                      <button
                        className="btn"
                        style={{ width: "100%", border: "none"}}
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
                          handleSendQuote(table.getSelectedRowModel().rows)
                        }
                      >
                        Send Account
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
          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
          </ThemeProvider>
        </>
      )}
    </section>
  );
};

export default Quotes;
