import { AppBar, Avatar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/store/user-context";
import AvatarMenu from "./AvatarMenu/AvatarMenu";
import { useReservationContext } from "@/store/reservation-context";
import { useClientContext } from "@/store/client-context";
import { sumDuplicates } from "@/utils/helpers";

const NavBar: React.FC = () => {
  const reservationCtx = useReservationContext();
  const clientCtx = useClientContext();

  //const clientIds = clientCtx.clients.map(client => client.id);
  //const duplicateCounter = sumDuplicates(clientIds);

  const router = useRouter();
  
  const user = useUser();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const isOnCalendarPage = router.pathname === "/";

  return (
    <AppBar position="static" color="brandColor">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{display: 'flex', gap: 2}}>
            <Link href="/">
              <Typography variant="body1">Tuji-Booking</Typography>
            </Link>
            <Typography>Foglalások: {reservationCtx.reservations.length}, Ügyfelek: {clientCtx.clients.length}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* {isOnCalendarPage && (
                <SearchBar placeholder="Foglalás keresés..." />
            )} */}
            <IconButton onClick={handleUserMenuOpen} sx={{ boxShadow: (theme) => theme.shadows[10], padding: 0 }}>
              <Avatar alt="Profil kép" src={user?.photoURL!} sx={{ width: 32, height: 32 }} />
            </IconButton>
            <AvatarMenu anchorEl={anchorElUser} onClose={handleUserMenuClose} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
