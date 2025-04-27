import DateRangePicker from "@/components/UI/DateRangePicker/DateRangePicker";
import { fetchReservationsInPeriod } from "@/firebase/firestore-helpers/reservation/reservation-utils";
import Report, { GroupSummaryDictionary, Summary } from "@/models/report-model";
import PaymentState from "@/models/reservation/payment-state-model";
import { useGroupContext } from "@/store/group-context";
import { useReportContext } from "@/store/report-context";
import { useUser } from "@/store/user-context";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GroupSelector from "./GroupSelector";

// Jelentés létrehozása funkció
const CreateReport: React.FC = () => {
  const user = useUser();
  const reportCtx = useReportContext();
  const groupCtx = useGroupContext();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(groupCtx.groups.map(group => group.id));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    setError(null);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
    setError(null);
  };

  const handleSelectedGroupsChange = (groupIds: string[]) => {
    setSelectedGroups(groupIds);
    setError(null);
  };

  const validateInputs = (): boolean => {
    // Ellenőrizzük, hogy a dátumok nem null értékek
    if (!startDate || !endDate) {
      setError("Kérjük, adja meg a kezdő és záró dátumot!");
      return false;
    }

    // Ellenőrizzük, hogy a dátumok valós dayjs objektumok
    if (!dayjs.isDayjs(startDate) || !dayjs.isDayjs(endDate)) {
      setError("Érvénytelen dátumformátum!");
      return false;
    }

    // Ellenőrizzük, hogy a dátumok érvényesek
    if (!startDate.isValid() || !endDate.isValid()) {
      setError("Érvénytelen dátum!");
      return false;
    }

    // Ellenőrizzük, hogy a kezdő dátum nem későbbi, mint a záró dátum
    if (startDate.isAfter(endDate)) {
      setError("A kezdő dátum nem lehet későbbi, mint a záró dátum!");
      return false;
    }

    // Ellenőrizzük, hogy legalább egy csoport ki van választva
    if (selectedGroups.length === 0) {
      setError("Kérjük, válasszon ki legalább egy csoportot!");
      return false;
    }

    return true;
  };

  // Jelentés létrehozása
  const handleCreateReport = async () => {
    // Ellenőrizzük a bemeneti értékeket és a felhasználót
    if (!validateInputs() || !user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Foglalások lekérése a megadott időszakra és csoportokra
      const reservations = await fetchReservationsInPeriod(
        user, 
        startDate!, 
        endDate!, 
        selectedGroups
      );

      const groupSummary: GroupSummaryDictionary = {};
      const summary: Summary = {
        notPaid: 0,
        depositPaid: 0,
        fullPaid: 0,
        blocked: 0,
        expenses: 0,
        balance: 0,
      };

      // A kiválasztott csoportokat inicializáljuk
      selectedGroups.forEach(groupId => {
        groupSummary[groupId] = {
          notPaid: 0,
          depositPaid: 0,
          fullPaid: 0,
          blocked: 0,
          expenses: 0,
          balance: 0,
        };
      });

      // A foglalások feldolgozása és a jelentés összegzése
      reservations.forEach((reservation) => {
        if (reservation.paymentState === PaymentState.CANCELLED) {
          return;
        }

        if (reservation.paymentState === PaymentState.NOT_PAID) {
          groupSummary[reservation.groupId].notPaid += reservation.fullPrice;
          summary.notPaid += reservation.fullPrice;
        } else if (reservation.paymentState === PaymentState.DEPOSIT_PAID) {
          groupSummary[reservation.groupId].depositPaid += reservation.fullPrice;
          summary.depositPaid += reservation.fullPrice;
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
        createdAt: dayjs(),
        period: {
          from: startDate!,
          to: endDate!,
        },
        groups: groupSummary,
        summary: summary,
        selectedGroupIds: selectedGroups,
      };
      
      reportCtx.addReport(report);

      // Sikeres jelentés létrehozása után töröljük a hibaüzenetet
      setError(null);
    } catch (error) {
      console.error("Hiba a jelentés készítése során:", error);
      setError("Hiba történt a jelentés készítése során. Kérjük, próbálja újra később.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          color: theme => theme.palette.text.secondary
        }}
      >
        A dátum választók segítségével add meg mely időszakról szeretnél jelentést készíteni!
      </Typography>
      
      <GroupSelector 
        selectedGroups={selectedGroups} 
        onSelectedGroupsChange={handleSelectedGroupsChange} 
      />
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: 4
        }}
      >
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleCreateReport}
          disabled={isLoading}
          sx={{ 
            minWidth: 200,
            position: 'relative',
            '& .MuiCircularProgress-root': {
              position: 'absolute',
              left: '50%',
              marginLeft: '-12px'
            }
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} color="inherit" />
              <Typography sx={{ visibility: 'hidden' }}>JELENTÉS KÉSZÍTÉSE</Typography>
            </>
          ) : (
            "JELENTÉS KÉSZÍTÉSE"
          )}
        </Button>
      </Box>
    </>
  );
};

export default CreateReport;