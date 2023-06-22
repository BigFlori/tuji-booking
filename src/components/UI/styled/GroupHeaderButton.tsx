import { CALENDAR_ITEM_HEIGHT } from "@/config/config";
import { styled } from "@mui/material";
import { Button, ButtonProps } from "@mui/material";

const GroupHeaderButton = styled(Button)<ButtonProps>(({ theme }) => ({
    display: "flex",
    //justifyContent: "center",
    alignItems: "center",
    height: CALENDAR_ITEM_HEIGHT,
    border: '1px solid' + theme.palette.grey[300],
    //transition: "all 0.3s",
    textTransform: "none",
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    borderRadius: 0,
    padding: 0,
    
}));

export default GroupHeaderButton;