import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useClientContext } from "@/store/client-context";
import { forwardRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import { useSnack } from "@/hooks/useSnack";
import ReservationCard from "../Card/ReservationCard";
import { useReservationContext } from "@/store/reservation-context";
import AnimatedModal from "../Modal/AnimatedModal";
import EditReservationApollo from "@/components/Forms/edit-reservation/EditReservationApollo";
import Reservation from "@/models/reservation/reservation-model";
import { CircularProgress } from "@mui/material"; // Importáljuk a CircularProgress-t
import { TransitionProps } from "@mui/material/transitions";
import Client from "@/models/client-model";

interface GridActionsCellDeleteProps {
  params: GridRowParams<Client>;
}

// Transition komponens létrehozása
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GridActionsCellDelete = (props: GridActionsCellDeleteProps) => {
  const client = props.params.row;
  const clientsCtx = useClientContext();
  const reservationCtx = useReservationContext();
  const showSnackbar = useSnack();
  const [openDialog, setOpenDialog] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedReservations, setRelatedReservations] = useState<Reservation[]>([]);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false); // Betöltés állapota

  const updateRelatedReservations = async () => {
    const reservations = await reservationCtx.getReservationsByClient(client.id);
    setRelatedReservations(reservations);
  };

  const handleDialogOpen = async () => {
    setLoading(true); // Indítjuk a betöltést
    await updateRelatedReservations();
    setLoading(false); // Befejezzük a betöltést
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTimeout(() => {
      setRelatedReservations([]);
    }, 200);
  };

  const handleDelete = (id: string) => {
    relatedReservations.forEach((reservation) => {
      reservationCtx.removeReservation(reservation.id);
    });
    setRelatedReservations([]);
    clientsCtx.removeClient(id);
    showSnackbar("Ügyfél törölve!", "success");
  };

  const onReservationDelete = (id: string) => {
    setRelatedReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReservationCardClick = (reservationId: string) => {
    const reservation = relatedReservations.find((r) => r.id === reservationId);
    if (reservation) {
      setActiveReservation(reservation);
      setModalOpen(true);
    } else {
      showSnackbar("Hiba történt a foglalás betöltésekor!", "error");
    }
  };

  return (
    <>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Törlés"
        onClick={() => {
          handleDialogOpen();
        }}
      />

      <Dialog open={openDialog} onClose={handleDialogClose} transitionDuration={200} >
        <DialogTitle>Biztosan törölni szeretnéd?</DialogTitle>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 2 }}>
            <CircularProgress /> {/* Betöltés közben megjelenítjük a spinnert */}
          </Box>
        ) : (
          relatedReservations.length !== 0 && (
            <DialogContent>
              <DialogContentText>FIGYELEM!!! Törlés esetén az alábbi foglalások is törlődnek!</DialogContentText>
              <Box sx={{ marginY: 1 }}>
                {relatedReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onClick={(reservation) => {
                      handleReservationCardClick(reservation.id);
                    }}
                  />
                ))}
              </Box>
              <DialogContentText sx={{ color: "red", fontWeight: 500 }}>
                A törlés végleges és visszafordíthatatlan!
              </DialogContentText>
            </DialogContent>
          )
        )}
        <DialogActions sx={{ display: "flex", justifyContent: "flex-end", paddingInline: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleDialogClose}>Mégse</Button>
            <Button onClick={() => handleDelete(props.params.id as string)} color="error" variant="contained">
              Törlés
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <AnimatedModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <EditReservationApollo
          onClose={() => {
            setModalOpen(false);
          }}
          onSubmit={(updatedReservation) => {
            if (updatedReservation && updatedReservation.clientId !== props.params.id) {
              setRelatedReservations((prev) => prev.filter((r) => r.id !== updatedReservation.id));
            }
          }}
          reservation={activeReservation!}
          disableDateChange
          disableGroupChange
          deleteEvent={onReservationDelete}
        />
      </AnimatedModal>
    </>
  );
};

export default GridActionsCellDelete;