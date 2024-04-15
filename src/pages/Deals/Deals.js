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
import { MdPictureAsPdf,MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { Tooltip, Zoom } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Deals = () => {
  const [data, setData] = useState([]);
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
        header: "Deal Name",
        Cell: ({ row }) => (
          <Link to={`/deals/show/${row.original.id}`} className="rowName">
            {row.original.dealName}
          </Link>
        ),
      },
      {
        accessorKey: "accountName",
        enableHiding: false,
        header: "Account Name",
        Cell: ({ row }) => (
          <Link to={`/deals/show/${row.original.id}`} className="rowName">
            {row.original.accountName}
          </Link>
        ),
      },
      {
        accessorKey: "contactName",
        enableHiding: false,
        header: "Contact Name",
      },
      {
        accessorKey: "dealOwner",
        enableHiding: false,
        header: "Deal Owner",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "closingDate",
        header: "Closing Date",
      },
      {
        accessorKey: "leadSource",
        header: "Lead Source",
      },
      {
        accessorKey: "stage",
        header: "Stage",
      },
      {
        accessorKey: "probability",
        header: "Probability",
      },
      {
        accessorKey: "campaignSource",
        header: "Campaign Source",
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
        accessorKey: "descriptionInfo",
        header: "Description",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(`${API_URL}allDealsByCompanyId/${companyId}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
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
    navigate("/deals/create");
  };
  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Deals", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Deal Name",
      "Account Name",
      "Contact Name",
      "Deal Owner",
      "Amount",
      
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.dealName,
        row.original.accountName,
        row.original.contactName,
        row.original.dealOwner,
        row.original.amount,
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
      "Closing Date",
      "Lead Source",
      "Stage",
      "Probability",
      "Campaign Source",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.closingDate,
        row.original.leadSource,
        row.original.stage,
        row.original.probability,
        row.original.campaignSource,
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
      "Shipping Street",
      "Shipping City",
      "Shipping State",
      "Shipping Code",
      "Shipping Country",
    ];
    const tableData3 = rows.map((row) => {
      return [
        row.original.shippingStreet,
        row.original.shippingCity,
        row.original.shippingState,
        row.original.shippingCode,
        row.original.shippingCountry,
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
      "Billing Street",
      "Billing City",
      "Billing State",
      "Billing Code",
      "Billing Country",
      
    ];
    const tableData4 = rows.map((row) => {
      return [
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
    const tableHeaders5 = [
      "Description",
    ];
    const tableData5 = rows.map((row) => {
      return [
        row.original.descriptionInfo,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders5],
      body: tableData5,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });
    
    doc.save("ECS.pdf");
  };

  const handleSendDealToInvoice = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    const invoiceId = sessionStorage.getItem("invoice_id");
    try {
      const response = await axios.post(
        `${API_URL}associateDealsWithInvoice/${invoiceId}`,
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
      dealName: "deal_name",
      accessories: "accessories",
      accountName: "account_name",
      leadSource: "lead_source",
      contactName: "contact_name",
      amount: "amount",
      closingDate: "closing_date",
      stage: "stage",
      probability: "probability",
      campaignSource: "campaign_source",
      descriptionInfo: "description_info",
      dealOwner: "deal_owner",

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
        `${API_URL}deleteMultipleDealData`,
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
        navigate("/deals");
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
        deal_owner: false,
        leadSource: false,
        lead_status: false,
        amount: false,
        closingDate: false,
        campaignSource: false,
        probability: false,
        stage: false,
        descriptionInfo: false,
        skypeId: false,
        twitter: false,
        sources: false,

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
        <button className="btn text-secondary" onClick={handleExportData}>
    <RiFileExcel2Fill size={23}/>
    </button>
    
    <Tooltip TransitionComponent={Zoom} title="Selected Row">
    <button
      className="btn text-secondary border-0"
      disabled={
        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
      }
      onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
    >
      <RiFileExcel2Line size={23}/> 
    </button>
    </Tooltip>

    <button className="btn text-secondary" 
    disabled={table.getPrePaginationRowModel().rows.length === 0}
    onClick={() =>
      handleExportRowsPDF(table.getPrePaginationRowModel().rows)
    }
    >
    <MdPictureAsPdf size={23}/>
    </button>
    <Tooltip TransitionComponent={Zoom} title="Selected Row">
    <button
      className="btn text-secondary border-0"
      disabled={
        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
      }
      onClick={() => handleExportRowsPDF(table.getSelectedRowModel().rows)}
    >
      <MdOutlinePictureAsPdf size={23} /> 
    </button></Tooltip>
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
                Create Deals
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
                          !table.getIsSomeRowsSelected() &&
                          !table.getIsAllRowsSelected()
                        }
                        onClick={() =>
                          handleSendDealToInvoice(
                            table.getSelectedRowModel().rows
                          )
                        }
                      >
                        Send to Invoice
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

export default Deals;
