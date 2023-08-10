import { Avatar, Box, Menu, Typography } from "@mui/material";
import Link from "next/link";
import SpacerLine from "../SpacerLine";
import MenuIconItem from "./MenuIconItem";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "@/store/user-context";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase.config";

interface IAvatarMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const AvatarMenu: React.FC<IAvatarMenuProps> = (props) => {
  const user = useUser();
  const [signOut] = useSignOut(auth);
  return (
    <Menu
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
      keepMounted
      anchorEl={props.anchorEl}
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
  );
};

export default AvatarMenu;
