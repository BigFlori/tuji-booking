import DateRangePicker from "@/components/UI/DateRangePicker/DateRangePicker";
import { fetchReservationsInPeriod } from "@/firebase/firestore-helpers/reservation/reservation-utils";
import Report, { GroupSummaryDictionary, Summary } from "@/models/report-model";
import PaymentState from "@/models/reservation/payment-state-model";
import { useReportContext } from "@/store/report-context";
import { useUser } from "@/store/user-context";
import { Box, Button } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateReport: React.FC = () => {
  const user = useUser();
  const reportCtx = useReportContext();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
  };

  const handleCreateReport = () => {
    if (!startDate || !endDate) {
      return;
    }
    fetchReservationsInPeriod(user!, startDate, endDate).then((reservations) => {
      const groupSummary: GroupSummaryDictionary = {};
      const summary: Summary = {
        notPaid: 0,
        depositPaid: 0,
        fullPaid: 0,
        blocked: 0,
        expenses: 0,
        balance: 0,
      };

      reservations.forEach((reservation) => {
        if (reservation.paymentState === PaymentState.CANCELLED) {
          return;
        }

        if (!groupSummary[reservation.groupId]) {
          groupSummary[reservation.groupId] = {
            notPaid: 0,
            depositPaid: 0,
            fullPaid: 0,
            blocked: 0,
            expenses: 0,
            balance: 0,
          };
        }

        if (reservation.paymentState === PaymentState.NOT_PAID) {
          groupSummary[reservation.groupId].notPaid += reservation.fullPrice;
          summary.notPaid += reservation.fullPrice;
        } else if (reservation.paymentState === PaymentState.DEPOSIT_PAID) {
          groupSummary[reservation.groupId].depositPaid += reservation.depositPrice;
          summary.depositPaid += reservation.depositPrice;
        } else if (reservation.paymentState === PaymentState.FULL_PAID) {
          groupSummary[reservation.groupId].fullPaid += reservation.fullPrice;
          summary.fullPaid += reservation.fullPrice;
        } else if (reservation.paymentState === PaymentState.BLOCKED) {
          groupSummary[reservation.groupId].blocked += reservation.fullPrice;
          summary.blocked += reservation.fullPrice;
        }
        groupSummary[reservation.groupId].expenses -= reservation.expenses;
        summary.expenses -= reservation.expenses;

        groupSummary[reservation.groupId].balance += reservation.fullPrice;
        groupSummary[reservation.groupId].balance -= reservation.expenses;
        summary.balance += reservation.fullPrice;
        summary.balance -= reservation.expenses;
      });

      const report: Report = {
        id: uuidv4(),
        title: "Jelentés",
        createdAt: dayjs(),
        period: {
          from: startDate,
          to: endDate,
        },
        groups: groupSummary,
        summary: summary,
      };
      reportCtx.addReport(report);
    });
  };

  return (
    <>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button variant="contained" color="success" onClick={handleCreateReport}>
          Jelentés készítése
        </Button>
      </Box>
    </>
  );
};

export default CreateReport;
