import Head from "next/head";
import { Inter } from "next/font/google";
import Calendar from "@/components/Calendar/Calendar";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import { ReservationContext } from "@/store/reservation-context";
import { auth } from "@/firebase/firebase.config";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { withProtected } from "@/hoc/route";
import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth);
  return (
    <>
      <Head>
        <title>Tuji-Booking</title>
        <meta name="description" content="Tuji-booking foglalási felülete" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="body1">Hello {user?.displayName}</Typography>
      <Button onClick={() => signOut()}>Kijelentkezés</Button>
      <Calendar />
    </>
  );
}

export default withProtected(Home);
