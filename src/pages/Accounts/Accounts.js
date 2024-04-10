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
import { ImQuotesRight } from "react-icons/im";
import QuotesModel from "./QuotesModel";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Accounts = () => {
  const [data, setData] = useState([]);
  const [rowId, setRowId] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState();

  // console.log("rowId",rowId)
  console.log("rowId", rowId);
  const columns = useMemo(
    () => [
      {
        accessorKey: "accountName",
        enableHiding: false,
        header: "Account Name",
        Cell: ({ row }) => (
          <Link to={`/accounts/show/${row.original.id}`} className="rowName">
            {row.original.accountName}
          </Link>
        ),
      },
      {
        accessorKey: "accountNumber",
        enableHiding: false,
        header: "Account Number",
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
        accessorKey: "parentAccount",
        header: "Parent Account",
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
        accessorKey: "id",
        enableHiding: false,
        header: "Create Quote",
        Cell: ({ row }) => (
          <Link to="/quotes" className="d-flex">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                padding: "5px",
                backgroundColor: "rgba(165, 255, 140, 0.5)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            >
              <input
                type="radio"
                onChange={() =>
                  sessionStorage.setItem("account_id", row.original.id)
                }
                name="account"
                id="account"
                className="form-check-input"
              />
            </div>
            <span style={{ fontSize: "20px" }} className="px-1">
              <ImQuotesRight />
            </span>
          </Link>
        ),
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}allAccountsByCompanyId/${userId}`,
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

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
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

  const handleAssignQuote = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    // sessionStorage.setItem("account_id", rowData);
    setRowId(rowData);
  };

  const handelNavigateClick = () => {
    navigate("/accounts/create");
  };

  const handleBulkConvert = async (rows) => {
    rows.forEach((row) => {
      row.original.company_id = userId;
    });
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}transferAccountBulkData`,
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
        navigate("/accounts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);

    const keyMapping = {
      accountOwner: "account_owner",
      accountName: "account_name",
      accountNumber: "account_number",
      accountType: "account_type",
      parentAccount: "parent_account",
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
      descriptionInfo: "description_info",
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
        `${API_URL}deleteMultipleAccountData`,
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
        navigate("/accounts");
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
        parentAccount: false,
        shippingStreet: false,
        shippingCity: false,
        shippingState: false,
        shippingCode: false,
        shippingCountry: false,
        billingStreet: false,
        billingCity: false,
        billingState: false,
        billingCode: false,
        billingCountry: false,
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
                className={`btn btn-primary ${
                  role === "CMP_USER" && "disabled"
                }`}
                disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                onClick={handelNavigateClick}
              >
                Create Accounts
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
                        style={{ width: "100%", border: "none" }}
                        disabled={
                          !(
                            table.getIsSomeRowsSelected() ||
                            table.getIsAllRowsSelected()
                          ) || table.getSelectedRowModel().rows.length !== 1
                        }
                        onClick={() =>
                          handleAssignQuote(table.getSelectedRowModel().rows)
                        }
                      >
                        <QuotesModel
                          // onSuccess={refreshData}
                          path={`associateQuotesWithAccount/${rowId}`}
                        />
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
                          handleBulkConvert(table.getSelectedRowModel().rows)
                        }
                      >
                        Convert Deal
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
                          handleBulkConvert(table.getSelectedRowModel().rows)
                        }
                      >
                        Mass Convert
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
                ) : role === "CRM_ADMIN" || role === "CMP_OWNER" ? (
                  <>
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
                          handleAssignQuote(table.getSelectedRowModel().rows)
                        }
                      >
                        Assign Quote
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn"
                        style={{ width: "100%", border: "none" }}
                        disabled
                      >
                        Convert
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn"
                        style={{ width: "100%", border: "none" }}
                        disabled
                      >
                        Mass Convert
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
                ) : (
                  <>
                    <li>
                      <button
                        className="btn"
                        style={{ width: "100%", border: "none" }}
                        disabled
                      >
                        Assign Quote
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn"
                        style={{ width: "100%", border: "none" }}
                        disabled
                      >
                        Convert
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn"
                        style={{ width: "100%", border: "none" }}
                        disabled
                      >
                        Mass Convert
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

export default Accounts;
