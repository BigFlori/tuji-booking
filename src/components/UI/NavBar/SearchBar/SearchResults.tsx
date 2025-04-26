import Reservation from "@/models/reservation/reservation-model";
import { List, Paper } from "@mui/material";
import SpacerLine from "../../SpacerLine";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import AnimatedModal from "../../Modal/AnimatedModal";
import EditReservationApollo from "@/components/Forms/edit-reservation/EditReservationApollo";
import ReservationCard from "../../Card/ReservationCard";

interface ISearchResultsProps {
  results: Reservation[];
  isModalOpened: boolean;
  setModalOpened: Dispatch<SetStateAction<boolean>>;
}

// A keresési eredmények megjelenítése
const SearchResults: React.FC<ISearchResultsProps> = (props: ISearchResultsProps) => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Keresési eredmény elemre kattintáskor megnyitja a modalt
  const handleResultItemClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    props.setModalOpened(true);
  };

  if (props.results.length === 0) return <></>;

  return (
    <>
      <Paper
        sx={{
          position: "absolute",
          zIndex: 20,
          width: "100%",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          top: "100%",
        }}
        elevation={6}
      >
        <List disablePadding sx={{ overflowY: "auto", maxHeight: 450 }}>
          {props.results.map((reservation, index) => {
            return (
              <Fragment key={reservation.id}>
                <ReservationCard reservation={reservation} onClick={handleResultItemClick} />
                {index !== props.results.length - 1 && <SpacerLine />}
              </Fragment>
            );
          })}
        </List>
      </Paper>
      <AnimatedModal open={props.isModalOpened} onClose={() => props.setModalOpened(false)}>
        <EditReservationApollo
          onClose={() => props.setModalOpened(false)}
          reservation={selectedReservation!}
          disableDateChange
          disableGroupChange
        />
      </AnimatedModal>
    </>
  );
};

export default SearchResults;
