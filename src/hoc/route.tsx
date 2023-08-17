import LoginSkeleton from "@/components/Forms/login/LoginSkeleton";
import NavBar from "@/components/UI/NavBar/NavBar";
import PageTransition from "@/components/Page/PageTransition";
import { useAuthContext } from "@/store/user-context";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

export function withPublic<T>(Component: React.ComponentType<T>) {
  return function WithPublic(props: T) {
    const userCtx = useAuthContext();
    const { user, loading, error } = userCtx.userState;
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
        <PageTransition path={router.route}>
          <Component {...props!} />
        </PageTransition>
      </>
    );
  };
}

export function withProtected<T>(Component: React.ComponentType<T>) {
  return function WithProtected(props: T) {
    const userCtx = useAuthContext();
    const { user, loading, error } = userCtx.userState;

    const router = useRouter();

    if (loading && !user) {
      return <LoginSkeleton />;
    }

    if (!user || error) {
      router.replace("/login");
      return <LoginSkeleton />;
    }

    return (
      <>
        <NavBar />
        <PageTransition path={router.route}>
          <Component {...props!} />
        </PageTransition>
      </>
    );
  };
}
