import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase.config";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NavBar: React.FC = () => {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="appBarBg">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Link href="/" className="disable-default-link">
              <Typography variant="body1">Tuji-Booking</Typography>
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user?.displayName && <Typography variant="body1">Üdv, {user?.displayName}</Typography>}
            <IconButton onClick={handleUserMenuOpen} sx={{ boxShadow: (theme) => theme.shadows[10], padding: 0 }}>
              <Avatar alt="Profil kép" src={user!.photoURL!} />
            </IconButton>
            <Menu
              open={Boolean(anchorElUser)}
              onClose={handleUserMenuClose}
              keepMounted
              anchorEl={anchorElUser}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={() => router.push("/settings")}>Beállítások</MenuItem>
              <MenuItem onClick={() => signOut()}>Kijelentkezés</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
