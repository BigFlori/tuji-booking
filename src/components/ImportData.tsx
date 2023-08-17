import Client from "@/models/client-model";
import PaymentState from "@/models/reservation/payment-state-model";
import Reservation from "@/models/reservation/reservation-model";
import { ClientContext } from "@/store/client-context";
import { ReservationContext } from "@/store/reservation-context";
import { Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useContext } from "react";
import CSVReader from "react-csv-reader";
import { v4 as uuidv4 } from "uuid";

type Dictionary = {
  [key: string]: string;
};

const groupIdDictionary: Dictionary = {
  "560537": "6bb83ac3-304d-497d-b562-080fc6230652", //OPEL VIVARO 818
  "560538": "d73fee1b-a97e-4d28-8ab1-cd7cafdefb75", //OPEL VIVARO 775
  "638819": "13f797b6-53d6-42cb-ade6-249d20ec70d4", //OPEL VIVARO 302
  "560539": "99266b4e-4563-4827-b497-bb548755cb04", //RENAULT TRAFIC 841
  "560540": "25e6587e-de0d-4a3e-9a80-a47645e2d3ab", //REANULT TRAFIC 842
  "583923": "fe5c4a76-d1f6-441c-a13b-58ac358c6ab4", //SOFŐR
  "673404": "50f67e18-84d2-4912-baeb-674fe03ed166", //AUTÓKOZMETIKA
  "1013689": "8fd213eb-61b5-488f-83d3-bef463d135bb", //LAKÁS
};

const getUuidByGroupId = (groupId: string) => {
  return groupIdDictionary[groupId];
};

const statusDictionary: Dictionary = {
  "1": "FULL_PAID",
  "2": "NOT_PAID",
  "3": "DEPOSIT_PAID",
  "4": "BLOCKED",
};

const getStatusByStatusId = (statusId: string) => {
  return Object.values(PaymentState).find((state) => state === statusDictionary[statusId]);
};

const formatDate = (date: string) => {
  const splittedDate = date.split(".");
  let formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  return dayjs(formattedDate);
};

const formatDateTime = (date: string, time: string) => {
  const splittedDate = date.split(".");
  let formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  return dayjs(formattedDate + " " + time);
};

const ImportData: React.FC = () => {
  const clientCtx = useContext(ClientContext);
  const reservationCtx = useContext(ReservationContext);

  const fileLoadedHandler = (data: any, fileInfo: any) => {
    console.dir(data, fileInfo);

    for (let i = 0; i < data.length; i++) {
      const obj = data[i];

      if (getUuidByGroupId(obj["RoomId"]) === undefined) continue;

      const newClient: Client = {
        id: uuidv4(),
        name: obj["ClientName"] || "",
        phone: obj["ClientPhone"] || "",
        email: obj["ClientEmail"] || "",
        address: "",
      };
      clientCtx.addClient(newClient);

      const newReservation: Reservation = {
        id: uuidv4(),
        groupId: getUuidByGroupId(obj["RoomId"]),
        clientId: newClient.id,
        startDate: formatDate(obj["StartTime"]),
        startTime: formatDateTime(obj["StartTime"], obj["ArrivalTime"]),
        endDate: formatDate(obj["EndTime"]),
        endTime: formatDateTime(obj["EndTime"], obj["DepartureTime"]),
        paymentState: getStatusByStatusId(obj["Status"]) || PaymentState.NOT_PAID,
        fullPrice: obj["Price"] || 0,
        depositPrice: 0,
        cautionPrice: 0,
        cautionReturned: false,
        comment: obj["ClientNote"] || "",
      };
      reservationCtx.addReservation(newReservation);

      console.log(newReservation);
    }
  };
  return (
    <Container maxWidth="lg">
      <Typography variant="h5">Import</Typography>
      <CSVReader
        onFileLoaded={fileLoadedHandler}
        inputId="csv-reader-input"
        cssClass="csv-reader-input"
        parserOptions={{ header: true, dynamicTyping: true, skipEmptyLines: true }}
      />
    </Container>
  );
};

export default ImportData;
