import Calendar from "@/components/Calendar/Calendar";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";
import PageHead from "@/components/Page/PageHead";
import { Box, Button } from "@mui/material";
import { useClientContext } from "@/store/client-context";
import Client from "@/models/client-model";
import { useReservationContext } from "@/store/reservation-context";

const BookingApp: NextPage = () => {
  const clientCtx = useClientContext();
  const reservationCtx = useReservationContext();
  const test = () => {
    // Egyedi ügyfelek tárolására szolgáló objektum létrehozása
    const uniqueClientsMap: { [name: string]: Client } = {};

    // Az eredeti tömb bejárása és egyedi ügyfelek hozzáadása az objektumhoz
    clientCtx.clients.forEach((client) => {
      if (!uniqueClientsMap[client.name]) {
        uniqueClientsMap[client.name] = client;
      }
    });

    // Az egyedi ügyfeleket tartalmazó tömb létrehozása
    const uniqueClients: Client[] = Object.values(uniqueClientsMap);

    uniqueClients.sort((a, b) => a.name.localeCompare(b.name));
    console.log(uniqueClients);

    // Azoknak az ügyfeleknek a gyűjtése, amelyeknek nincs ID-jük az egyedi ügyfelek tömbjében
    const missingIds: string[] = clientCtx.clients.reduce<string[]>((acc, client) => {
      if (!uniqueClientsMap[client.name] || uniqueClientsMap[client.name].id !== client.id) {
        acc.push(client.id);
      }
      return acc;
    }, []);
    console.log(missingIds);

    reservationCtx.reservations.forEach((reservation) => {
      if (reservation.clientId && missingIds.includes(reservation.clientId)) {
        const clientName = clientCtx.getClientById(reservation.clientId)?.name;
        const keptClient = uniqueClients.find((client) => client.name === clientName);
        if (keptClient) {
          reservation.clientId = keptClient.id;
        }
      }
    });

    missingIds.forEach((id) => {
      clientCtx.removeClient(id);
    });
  };
  return (
    <>
      <PageHead />
      <Calendar />
      <Box sx={{ paddingTop: 5 }}>
        <Button onClick={test}>Teszt</Button>
      </Box>
    </>
  );
};

export default withProtected(BookingApp);
