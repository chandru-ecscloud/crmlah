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

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Contacts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");

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
        header: "twitter",
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
        `${API_URL}allContactsByCompanyId/${userId}`,
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

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original);
    const keyMapping = {
      firstName: "first_name",
      lastName: "last_name",
      contactOwner: "contact_owner",
      leadSource: "lead_source",
      accountName: "account_name",
      vendorName: "vendor_name",
      email: "email",
      countryCode: "country_code",
      phone: "phone",
      landLine: "landLine",
      skypeId: "skype_id",
      twitter: "twitter",
      mailingStreet: "mailing_street",
      mailingCity: "mailing_city",
      mailingState: "mailing_state",
      mailingZip: "mailing_zip",
      mailingCountry: "mailing_country",
      otherStreet: "other_street",
      otherCity: "other_city",
      otherState: "other_state",
      otherZip: "other_zip",
      otherCountry: "other_country",
      descriptionInfo: "description_info",
      createdAt: "created_at",
      createdBy: "created_by",
      updatedAt: "updated_at",
      updatedBy: "updated_by",
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
        `${API_URL}deleteMultipleContactData`,
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
                Create Contact
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
                  <>
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

export default Contacts;
