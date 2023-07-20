import LoginSkeleton from "@/components/Forms/login/LoginSkeleton";
import { auth } from "@/firebase/firebase.config";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function withPublic<T>(Component: React.ComponentType<T>) {
  return function WithPublic(props: T) {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    if (loading) {
      return <Box>Loading...</Box>;
    }

    if (user && !error) {
      router.replace("/");
      return <Box>Redirecting...</Box>;
    }

    return (
      <>
        <Component {...props!} />
      </>
    );
  };
}

export function withProtected<T>(Component: React.ComponentType<T>) {
  return function WithProtected(props: T) {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    if (loading) {
      return <LoginSkeleton />;
    }

    if (!user || error) {
      router.replace("/login");
      return <LoginSkeleton />;
    }

    return (
      <>
        <Component {...props!} />
      </>
    );
  };
}
