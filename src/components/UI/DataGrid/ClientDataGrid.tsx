import { useClientContext } from "@/store/client-context";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridSortModel,
  GridPagination,
} from "@mui/x-data-grid";
import GridActionsCellEdit from "../GridActionsCell/GridActionsCellEdit";
import GridActionsCellDelete from "../GridActionsCell/GridActionsCellDelete";
import { huHU as gridHuHu } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Theme, useMediaQuery, Button, Box, alpha, useTheme, Typography, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AnimatedModal from "../Modal/AnimatedModal";
import ClientFormApollo from "@/components/Forms/client";
import Client from "@/models/client-model";
import { useSnack } from "@/hooks/useSnack";

// Ha nincs ügyfél, akkor megjelenít egy üzenetet és egy gombot új ügyfél hozzáadásához
function NoRowsOverlay({ onAddClick }: { onAddClick: () => void }) {
  const theme = useTheme();
  
  return (
    <Stack
      height="100%"
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 4,
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          maxWidth: 450,
        }}
      >
        <Typography variant="h6" color="text.primary" gutterBottom>
          Nincsenek ügyfelek
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Jelenleg nincsenek ügyfelek a rendszerben. Kattints az alábbi gombra új ügyfél hozzáadásához.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onAddClick}
          sx={{
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.8),
            },
          }}
        >
          Új ügyfél hozzáadása
        </Button>
      </Box>
    </Stack>
  );
}

// Ügyfél adatokat megjelenítő táblázat
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

  // Ügyfél hozzáadása a táblázathoz
  const handleCreateClient = (updatedClient?: Client) => {
    if (updatedClient) {
      setRows((prevRows) => sortRows([...prevRows], sortModel));
    }
    setModalOpen(false);
  };

  // Rendezési modell változása
  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
    setRows(sortRows([...rows], newModel));
  };

  // Lapozási modell változása
  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  // Új ügyfél gomb megnyomása
  const handleAddClientClick = () => {
    setModalOpen(true);
  };

  let columns: GridColDef[] = [];

  // Oszlopok definiálása mobil és asztali nézethez
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

        {rows.length > 0 && (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <GridPagination />
          </Box>
        )}
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
          noRowsOverlay: () => <NoRowsOverlay onAddClick={handleAddClientClick} />,
        }}
        localeText={{ ...gridHuHu.components.MuiDataGrid.defaultProps.localeText }}
        disableColumnMenu
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 20]}
        pagination
        sx={{
          '& .MuiDataGrid-virtualScroller': {
            minHeight: rows.length > 0 ? 'auto' : 400,
          },
        }}
      />
      <AnimatedModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ClientFormApollo
          mode="create"
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateClient}
        />
      </AnimatedModal>
    </>
  );
};

export default ClientDataGrid;