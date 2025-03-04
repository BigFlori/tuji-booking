import { useClientContext } from "@/store/client-context";
import { DataGrid, GridColDef, GridPaginationModel, GridRowParams } from "@mui/x-data-grid";
import GridActionsCellEdit from "../GridActionsCell/GridActionsCellEdit";
import GridActionsCellDelete from "../GridActionsCell/GridActionsCellDelete";
import { huHU as gridHuHu } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Theme, useMediaQuery } from "@mui/material";

const ClientDataGrid = () => {
  const router = useRouter();
  const clientsCtx = useClientContext();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const rows = clientsCtx.clients.map((client) => {
    return { ...client };
  });

  let columns: GridColDef[] = [];

  if (isMobile) {
    columns = [
      { field: "name", headerName: "Név", minWidth: 180, flex: 1 },
      { field: "phone", headerName: "Telefonszám", minWidth: 140, flex: 0.3 },
      {
        field: "actions",
        type: "actions",
        headerName: "Műveletek",
        width: 100,
        getActions: (params: GridRowParams) => [
          <GridActionsCellEdit params={params} />,
          <GridActionsCellDelete params={params} />,
        ],
      },
    ];
  } else {
    columns = [
      { field: "id", headerName: "ID", minWidth: 90 },
      { field: "name", headerName: "Név", minWidth: 180, flex: 1 },
      { field: "phone", headerName: "Telefonszám", minWidth: 130, flex: 0.3 },
      { field: "email", headerName: "Email", minWidth: 220, flex: 1 },
      { field: "address", headerName: "Cím", minWidth: 200, flex: 1 },
      {
        field: "actions",
        type: "actions",
        headerName: "Műveletek",
        width: 100,
        getActions: (params: GridRowParams) => [
          <GridActionsCellEdit params={params} />,
          <GridActionsCellDelete params={params} />,
        ],
      },
    ];
  }

  const handlePageChange = (params: GridPaginationModel) => {
    const optionalQuery: { page: number; pageSize?: number } = { page: params.page };

    if (params.pageSize !== 5) {
      optionalQuery.pageSize = params.pageSize;
    }

    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...optionalQuery },
    });
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      localeText={gridHuHu.components.MuiDataGrid.defaultProps.localeText}
      initialState={{
        pagination: {
          paginationModel: {
            page: router.query.page ? +router.query.page : 0,
            pageSize: router.query.pageSize ? +router.query.pageSize : 10,
          },
        },
      }}
      onPaginationModelChange={handlePageChange}
      pageSizeOptions={[5, 10, 20]}
    />
  );
};

export default ClientDataGrid;
