import Calendar from "@/components/Calendar/Calendar";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";
import PageHead from "@/components/UI/PageHead";
import NavBar from "@/components/UI/NavBar";
import GroupContextProvider from "@/store/group-context";
import ReservationContextProvider from "@/store/reservation-context";
import ClientContextProvider from "@/store/client-context";

const BookingApp: NextPage = () => {
  return (
    <GroupContextProvider>
      <ReservationContextProvider>
        <ClientContextProvider>
          <PageHead />
          <NavBar />
          <Calendar />
        </ClientContextProvider>
      </ReservationContextProvider>
    </GroupContextProvider>
  );
};

export default withProtected(BookingApp);
