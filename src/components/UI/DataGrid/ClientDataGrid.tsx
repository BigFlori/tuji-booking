import { useClientContext } from "@/store/client-context";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  gridClasses,
  GridSortModel,
  GridPagination,
  GridToolbar,
} from "@mui/x-data-grid";
import GridActionsCellEdit from "../GridActionsCell/GridActionsCellEdit";
import GridActionsCellDelete from "../GridActionsCell/GridActionsCellDelete";
import { huHU as gridHuHu } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Theme, useMediaQuery, Button, Box, alpha, useTheme, Tooltip, IconButton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AnimatedModal from "../Modal/AnimatedModal";
import EditClientApollo from "@/components/Forms/edit-client/EditClientApollo";
import Client from "@/models/client-model";
import { v4 as uuidv4 } from "uuid";
import { useSnack } from "@/hooks/useSnack";

const ClientDataGrid = () => {
  const router = useRouter();
  const clientsCtx = useClientContext();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const showSnackbar = useSnack();

  const [rows, setRows] = useState<Client[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "name",
      sort: "asc",
    },
  ]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: router.query.page ? +router.query.page : 0,
    pageSize: router.query.pageSize ? +router.query.pageSize : 10,
  });

  // Sorok rendezése a megadott szempont szerint
  const sortRows = (clientsToSort: Client[], model: GridSortModel): Client[] => {
    if (!model.length) return clientsToSort;

    const { field, sort } = model[0];
    const direction = sort === "asc" ? 1 : -1;

    return [...clientsToSort].sort((a, b) => {
      const aValue = a[field as keyof Client] || "";
      const bValue = b[field as keyof Client] || "";

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction * aValue.localeCompare(bValue);
      }

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
  };

  useEffect(() => {
    setRows(sortRows(clientsCtx.clients, sortModel));
  }, [clientsCtx.clients, sortModel]);

  // URL frissítése, ha változik a lapozás
  useEffect(() => {
    const optionalQuery: { page: number; pageSize?: number } = { page: paginationModel.page };

    optionalQuery.pageSize = paginationModel.pageSize;

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, ...optionalQuery },
      },
      undefined,
      { shallow: true }
    );
  }, [paginationModel]);

  const emptyClient: Client = {
    id: uuidv4(),
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const handleCreateClient = (updatedClient?: Client) => {
    if (updatedClient) {
      clientsCtx.addClient(updatedClient);
      setRows((prevRows) => sortRows([...prevRows, updatedClient], sortModel));
      showSnackbar("Ügyfél sikeresen létrehozva!", "success");
    }
    setModalOpen(false);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
    setRows(sortRows([...rows], newModel));
  };

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

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
          <GridActionsCellEdit params={params} key={`edit-${params.id}`} />,
          <GridActionsCellDelete params={params} key={`delete-${params.id}`} />,
        ],
      },
    ];
  } else {
    columns = [
      { field: "id", headerName: "ID", minWidth: 90, flex: 0.3 },
      { field: "name", headerName: "Név", minWidth: 180, flex: 1 },
      { field: "phone", headerName: "Telefonszám", minWidth: 130, flex: 0.5 },
      { field: "email", headerName: "Email", minWidth: 220, flex: 1 },
      { field: "address", headerName: "Cím", minWidth: 200, flex: 1 },
      {
        field: "actions",
        type: "actions",
        headerName: "Műveletek",
        width: 100,
        getActions: (params: GridRowParams) => [
          <GridActionsCellEdit params={params} key={`edit-${params.id}`} />,
          <GridActionsCellDelete params={params} key={`delete-${params.id}`} />,
        ],
      },
    ];
  }

  // Toolbar komponens a keresőmezővel, új ügyfél gombbal és felső lapozóval
  function ClientGridToolbar() {
    return (
      <GridToolbarContainer>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            p: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", md: "auto" },
            }}
          >
            <GridToolbarQuickFilter
              placeholder="Ügyfél keresése..."
              variant="outlined"
              size="small"
              sx={{
                width: "100%",
                minWidth: { md: 300 },
              }}
            />
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    Keresés a következők alapján:
                  </Typography>
                  <ul style={{ paddingLeft: "16px", margin: 0 }}>
                    <li>Név</li>
                    <li>Telefonszám</li>
                    <li>Email cím</li>
                    <li>Lakcím</li>
                  </ul>
                </Box>
              }
              arrow
              placement="bottom-start"
            >
              <IconButton size="small" sx={{ ml: 1, position: "absolute", right: 8 }}>
                <HelpOutlineIcon fontSize="small" color="action" />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.8),
              },
              width: { xs: "100%", md: "auto" },
            }}
          >
            Új ügyfél
          </Button>
        </Box>

        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <GridPagination />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: ClientGridToolbar,
          pagination: GridPagination,
        }}
        localeText={{ ...gridHuHu.components.MuiDataGrid.defaultProps.localeText }}
        disableColumnMenu
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 20]}
        pagination
      />
      <AnimatedModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <EditClientApollo onClose={() => setModalOpen(false)} client={emptyClient} onSubmit={handleCreateClient} />
      </AnimatedModal>
    </>
  );
};

export default ClientDataGrid;
