import MonthSelectorButton from "@/components/UI/styled/MonthSelectorButton";
import { Box, Button, Menu, MenuItem, Theme, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

interface IMonthSelectorProps {
  activeMonth: number;
  jumpToId: (id: string) => void;
}

// Hónapnevek létrehozása magyar lokalizációval
const monthNames = Array.from(Array(12).keys()).map((month) => dayjs().locale("hu-hu").month(month).format("MMM"));

// Hónap választó komponens, ami lehetővé teszi a felhasználónak, hogy navigáljon a naptár hónapjai között
// Mobil nézeten legördülő menüt, asztali nézeten gombsort jelenít meg
const MonthSelector: React.FC<IMonthSelectorProps> = (props: IMonthSelectorProps) => {
  // 950px a töréspont ami alatt mobil nézet van (md breakpoint 900px-nél van)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(950));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Menü megnyitása
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Menü bezárása
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography fontSize={18} sx={{ paddingInline: 1 }}>
            {monthNames[props.activeMonth]}
          </Typography>
          <Button onClick={handleClick} variant="text" sx={(theme) => ({ color: theme.palette.brandColor.main })}>
            Hónapok
          </Button>
          <Menu id="month-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => props.jumpToId("today")}>Ma</MenuItem>
            {monthNames.map((monthName, index) => {
              return (
                <MenuItem
                  key={monthName}
                  onClick={() => props.jumpToId(index.toString())}
                  sx={{ textTransform: "capitalize" }}
                >
                  {monthName}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <MonthSelectorButton onClick={() => props.jumpToId("today")} size="small" variant="outlined">
            Ma
          </MonthSelectorButton>
          {monthNames.map((monthName, index) => {
            return (
              <MonthSelectorButton
                key={monthName}
                onClick={() => props.jumpToId(index.toString())}
                variant={`${props.activeMonth === index ? "contained" : "text"}`}
                size="small"
              >
                {monthName}
              </MonthSelectorButton>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default MonthSelector;
