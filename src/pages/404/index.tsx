import { NextPage } from "next";
import React from "react";
import PageHead from "@/components/Page/PageHead";
import { Box, Typography } from "@mui/material";
import TujibuszLogo from "@/assets/tujibusz-logo-removebg-preview.png";
import TextButton from "@/components/UI/styled/LinkButton";
import Link from "next/link";

const NotFoundPage: NextPage = () => {
  return (
    <>
      <PageHead page="404" metaDescription="Oops! The page you are looking for does not exist." />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100dvh",
          gap: "1rem",
        }}
      >
        <img src={TujibuszLogo.src} alt="Tujibusz logo" width="200px" />
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          A keresett oldal nem található.
        </Typography>
        <Typography variant="h6" fontWeight="light" textAlign="center">
          Lehet, hogy elgépelte a címet, vagy az oldal nem létezik.
        </Typography>
        <Link href="/" style={{ marginTop: 20 }}>
          <TextButton color="primary" variant="button">
            Vissza a főoldalra
          </TextButton>
        </Link>
      </Box>
    </>
  );
};

export default NotFoundPage;
