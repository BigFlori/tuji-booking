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
import PageHead from "@/components/UI/PageHead";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth);
  return (
    <>
      <PageHead />
      <Typography variant="body1">Hello {user?.displayName} ({user?.uid})</Typography>
      <Button onClick={() => signOut()}>Kijelentkezés</Button>
      <Calendar />
    </>
  );
}

export default withProtected(Home);
