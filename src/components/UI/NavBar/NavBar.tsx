import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/store/user-context";
import AvatarMenu from "./AvatarMenu/AvatarMenu";
import SearchBar from "./SearchBar/SearchBar";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeChanger } from "@/store/theme-context";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useIsDevMode } from "@/store/dev-context";
import { red } from "@mui/material/colors";

const NavBar: React.FC = () => {
  //950px a töréspont ami alatt mobil nézet van (md breakpoint 900px-nél van)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(950));
  const themeChanger = useThemeChanger();
  const router = useRouter();

  const user = useUser();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchMode, setSearchMode] = useState(false);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleThemeChange = () => {
    themeChanger.setTheme(themeChanger.theme === "light" ? "dark" : "light");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: (theme) => useIsDevMode() ? red[400] : theme.palette.brandColor.main }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AnimatePresence mode="wait" initial={false}>
            {searchMode && isMobile ? (
              <motion.div
                key="searchBar"
                initial={{ opacity: 0.2, x: "-120%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-120%" }}
                transition={{ duration: 0.2 }}
                style={{ width: "100%", zIndex: 20 }}
              >
                <SearchBar
                  placeholder="Foglalás keresés..."
                  onSearchModeChange={setSearchMode}
                  searchMode={searchMode}
                />
              </motion.div>
            ) : (
              <motion.div
                key="navBar"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: "100%", zIndex: 20 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Link href="/">
                      <Typography variant="body1">Tuji-Booking</Typography>
                    </Link>
                    {/* <Typography>Foglalások: {reservationCtx.reservations.length}, Ügyfelek: {clientCtx.clients.length}</Typography> */}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <SearchBar
                      placeholder="Foglalás keresés..."
                      onSearchModeChange={setSearchMode}
                      searchMode={searchMode}
                    />
                    <Tooltip title={themeChanger.theme === "dark" ? "Világós mód" : "Sötét mód"}>
                      <IconButton
                        onClick={handleThemeChange}
                        sx={{ color: (theme) => theme.palette.brandColor.contrastText }}
                      >
                        {themeChanger.theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{ boxShadow: (theme) => theme.shadows[10], padding: 0 }}
                    >
                      <Avatar alt="Profil kép" src={user?.photoURL!} sx={{ width: 32, height: 32 }} />
                    </IconButton>
                    <AvatarMenu anchorEl={anchorElUser} onClose={handleUserMenuClose} />
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
