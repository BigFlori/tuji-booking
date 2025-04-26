import NavBar from "@/components/UI/NavBar/NavBar";
import PageTransition from "@/components/Page/PageTransition";
import { useAuthContext } from "@/store/user-context";
import { useRouter } from "next/router";
import React from "react";
import ClientContextProvider from "@/store/client-context";
import ReservationContextProvider from "@/store/reservation-context";
import GroupContextProvider from "@/store/group-context";
import LoadingScreen from "@/components/UI/LoadingScreen";

// Publikus útvonalakhoz, ahol nem bejelentkezett felhasználókat várunk
export function withPublic<T>(Component: React.ComponentType<T>) {
  return function WithPublic(props: T) {
    const userCtx = useAuthContext();
    const { user, loading, error } = userCtx.userState;
    const router = useRouter();

    // Betöltés közben
    if (loading) {
      return <LoadingScreen />;
    }

    // Ha már betöltött de van felhasználó vagy hiba történt, akkor átirányítjuk a főoldalra
    if (user && !error) {
      router.replace("/");
      return <LoadingScreen />;
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

// Védett útvonalakhoz, ahol bejelentkezett felhasználókat várunk
export function withProtected<T>(Component: React.ComponentType<T>) {
  return function WithProtected(props: T) {
    const userCtx = useAuthContext();
    const { user, loading, error } = userCtx.userState;

    const router = useRouter();

    // Betöltés közben
    if (loading && !user) {
      return <LoadingScreen />;
    }

    // Ha már betöltött de nincs felhasználó vagy hiba történt, akkor átirányítjuk a bejelentkezéshez
    if (!user || error) {
      router.replace("/login");
      return <LoadingScreen />;
    }

    return (
      <ClientContextProvider>
        <ReservationContextProvider>
          <GroupContextProvider>
            <NavBar />
            <PageTransition path={router.route}>
              <Component {...props!} />
            </PageTransition>
          </GroupContextProvider>
        </ReservationContextProvider>
      </ClientContextProvider>
    );
  };
}
