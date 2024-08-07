import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const dummyData = [
  {
    id: 1,
    CompanyName: "ECS",
    FirstName: "Sakthivel",
    Email: "Sakthiveljayabal23@gmail.com",
    phone: "6345674567",
  },
  {
    id: 2,
    CompanyName: "ECS",
    FirstName: "Prem",
    Email: "Prem@gmail.com",
    phone: "6345674567",
  },
  {
    id: 3,
    CompanyName: "ECS",
    FirstName: "Chandru",
    Email: "Chandru@gmail.com",
    phone: "6345674567",
  },
];

const Event = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "CompanyName",
        enableHiding: false,
        header: "Company Name",
      },
      {
        accessorKey: "FirstName",
        enableHiding: false,
        header: "First Name",
      },
      {
        accessorKey: "Email",
        enableHiding: false,
        header: "Bussiness Email",
      },
      {
        accessorKey: "phone",
        enableHiding: false,
        header: "Phone",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: dummyData,
    initialState: {
      columnVisibility: {},
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/event/view`);
      },
      style: { cursor: "pointer" },
    }),
  });

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

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">Event</span>
            </div>
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <Link to="/event/add">
                  <button className="btn btn-primary">Create Event</button>
                </Link>
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

export default Event;
