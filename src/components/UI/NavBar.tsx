import { AppBar, Avatar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/store/user-context";
import SearchIcon from "@mui/icons-material/Search";
import AvatarMenu from "./AvatarMenu/AvatarMenu";

const NavBar: React.FC = () => {
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
          <Box>
            <Link href="/">
              <Typography variant="body1">Tuji-Booking</Typography>
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isOnCalendarPage && (
                <SearchIcon />
            )}
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
