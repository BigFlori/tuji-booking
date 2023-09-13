import Reservation from "@/models/reservation/reservation-model";
import { List, Paper } from "@mui/material";
import SpacerLine from "../../SpacerLine";
import { Fragment, useState } from "react";
import ResultItem from "./ResultItem";
import AnimatedModal from "../../Modal/AnimatedModal";
import EditReservationApollo from "@/components/Forms/edit-reservation/EditReservationApollo";

interface ISearchResultsProps {
  results: Reservation[];
}

const SearchResults: React.FC<ISearchResultsProps> = (props: ISearchResultsProps) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleResultItemClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalOpened(true);
  };

  if (props.results.length === 0) return <></>;

  return (
    <>
      <Paper
        sx={{
          position: "absolute",
          zIndex: 10,
          width: "100%",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          // backgroundColor: (theme) => theme.palette.brandColor.light,
          // color: (theme) => theme.palette.brandColor.contrastText,
        }}
        elevation={6}
      >
        <List disablePadding>
          {props.results.map((reservation, index) => {
            return (
              <Fragment key={reservation.id}>
                <ResultItem result={reservation} onClick={handleResultItemClick} />
                {index !== props.results.length - 1 && <SpacerLine />}
              </Fragment>
            );
          })}
        </List>
      </Paper>
      <AnimatedModal open={modalOpened} onClose={() => setModalOpened(false)}>
        <EditReservationApollo onClose={() => setModalOpened(false)} reservation={selectedReservation!} />
      </AnimatedModal>
    </>
  );
};

export default SearchResults;
