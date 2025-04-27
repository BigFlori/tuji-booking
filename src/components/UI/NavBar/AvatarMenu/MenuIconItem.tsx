import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useRouter } from "next/router";

interface IMenuIconItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// A menü ikon elem, amely egy ikont és szöveget tartalmaz
const MenuIconItem: React.FC<IMenuIconItemProps> = (props: IMenuIconItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
    if (props.href) {
      router.push(props.href);
    }
  };

  return (
    <MenuItem onClick={handleClick} disabled={props.disabled}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText>{props.text}</ListItemText>
    </MenuItem>
  );
};

export default MenuIconItem;
