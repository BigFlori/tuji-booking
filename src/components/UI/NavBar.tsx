import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase.config";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/store/user-context";
import MenuIconItem from "./MenuIconItem";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import SpacerLine from "./SpacerLine";

const NavBar: React.FC = () => {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const user = useUser();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="brandColor">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Link href="/">
              <Typography variant="body1">Tuji-Booking</Typography>
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleUserMenuOpen} sx={{ boxShadow: (theme) => theme.shadows[10], padding: 0 }}>
              <Avatar alt="Profil kép" src={user?.photoURL!} sx={{ width: 32, height: 32 }} />
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
              PaperProps={{
                sx: {
                  width: 220,
                },
              }}
            >
              <Box sx={{ padding: 1, display: "flex", gap: 1 }}>
                <Avatar alt="Profil kép" src={user?.photoURL!} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.displayName}
                  </Typography>
                  <Link href="/profile">
                    <Typography variant="body2" color="primary">
                      Profil szerkesztése
                    </Typography>
                  </Link>
                </Box>
              </Box>
              <SpacerLine sx={{ marginBlock: 1 }} />
              <MenuIconItem icon={<SettingsIcon />} text="Beállítások" href="/settings" />
              <MenuIconItem icon={<LogoutIcon />} text="Kijelentkezés" onClick={() => signOut()} />
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
