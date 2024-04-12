import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
// import { BsFiletypeCsv } from "react-icons/bs";
// import { FaRegFilePdf } from "react-icons/fa";
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

const Services = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const columns = useMemo(
    () => [
      {
        accessorKey: "serviceName",
        enableHiding: false,
        header: "Service Name",
        Cell: ({ row }) => (
          <Link to={`/services/show/${row.original.id}`} className="rowName">
            {row.original.serviceName}
          </Link>
        ),
      },
      {
        accessorKey: "duration",
        enableHiding: false,
        header: "Duration",
      },
      {
        accessorKey: "price",
        enableHiding: false,
        header: "Price",
      },
      {
        accessorKey: "location",
        enableHiding: false,
        header: "Location",
      },
      {
        accessorKey: "serviceOwner",
        enableHiding: false,
        header: "Service Owner",
      },
      {
        accessorKey: "members",
        header: "Members",
      },
      {
        accessorKey: "availableDays",
        header: "Available Day",
      },
      {
        accessorKey: "availableTime",
        header: "Available Time",
      },
      {
        accessorKey: "tax",
        header: "Tax",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  const fetchData = async () => {
    try {
      const response = await axios(`${API_URL}allServices`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
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
    navigate("/services/create");
  };

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Services", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Service Name",
      "Duration",
      "Price",
      "Location",
      "Service Owner",
      
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.serviceName,
        row.original.duration,
        row.original.price,
        row.original.location,
        row.original.serviceOwner,
        
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
      "Members",
      "Available Day",
      "Available Time",
      "Tax",
      "Description",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.members,
        row.original.availableDays,
        row.original.availableTime,
        row.original.tax,
        row.original.description,
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

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    console.log("rowData",rowData[0])
    // console.log("rowData",rowData.id)
    try {
      const response = await axios.delete(
        `${API_URL}deleteServices/${rowData[0]}`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/services");
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
        members: false,
        availableDays: false,
        availableTime: false,
        tax: false,
        description: false,
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
      <div className="d-flex align-items-center justify-content-end py-4 px-3">
        <div style={{ paddingRight: "10px" }}>
          <button
            className={`btn btn-primary ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER"}
            onClick={handelNavigateClick}
          >
            Create Service
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
            {role !== "CMP_USER" ? (
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
                {/* <li>
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
                </li> */}
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
    </section>
  );
};

export default Services;
