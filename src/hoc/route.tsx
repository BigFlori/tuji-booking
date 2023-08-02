import LoginSkeleton from "@/components/Forms/login/LoginSkeleton";
import { auth } from "@/firebase/firebase.config";
import { createInitialUser } from "@/firebase/firestore-helpers/utils";
import { Box } from "@mui/material";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
    const [isLoading, setIsLoading] = useState(false);

    const onUserChange = async (user: User | null) => {
      if (!user) return;
      setIsLoading(true);
      console.log("Create initial user");
      await createInitialUser(user, user.displayName).finally(() => {
        console.log("Initial user created");
        setIsLoading(false);
      });
    }

    const [user, loading, error] = useAuthState(auth, { onUserChanged: onUserChange });

    const router = useRouter();

    if(isLoading) {
      return <div>Töltés......!!!!!</div>;
    }

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
