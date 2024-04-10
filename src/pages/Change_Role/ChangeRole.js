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

const ChangeRole = () => {
  const [data, setData] = useState([]);
  //   console.log("Api data:",data);
  const [loading, setLoading] = useState(true);
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        enableHiding: false,
        header: "User Name",
        Cell: ({ row }) => (
          <Link to={`/changerole/show/${row.original.id}`} className="rowName">
            {row.original.userName}
          </Link>
        ),
      },
      {
        accessorKey: "companyId",
        enableHiding: false,
        header: "Company ID",
      },
      {
        accessorKey: "email",
        enableHiding: false,
        header: "Email-Address",
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
        accessorKey: "address",
        header: "Address",
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
      const response = await axios.get(`${API_URL}allUserRegistrations`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      console.log("Api response data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        city: false,
        address: false,
        country: false,
        zipCode: false,
        state: false,
      },
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
          </ThemeProvider>
        </>
      )}
    </section>
  );
};

export default ChangeRole;
