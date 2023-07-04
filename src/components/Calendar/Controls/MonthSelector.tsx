import { Box, Button, Menu, MenuItem, Theme, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

interface IMonthSelectorProps {
  activeMonth: number;
  jumpToId: (id: string) => void;
}

const monthNames = Array.from(Array(12).keys()).map((month) => dayjs().locale("hu-hu").month(month).format("MMM"));

const MonthSelector: React.FC<IMonthSelectorProps> = (props: IMonthSelectorProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="h6" sx={{ paddingInline: 1 }}>
            {monthNames[props.activeMonth]}
          </Typography>
          <Button onClick={handleClick} variant="text">
            Hónapok
          </Button>
          <Menu id="month-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => props.jumpToId("today")}>Ma</MenuItem>
            {monthNames.map((monthName, index) => {
              return (
                <MenuItem key={monthName} onClick={() => props.jumpToId(index.toString())}>
                  {monthName}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={() => props.jumpToId("today")} size="small" variant="outlined">
            Ma
          </Button>
          {monthNames.map((monthName, index) => {
            return (
              <Button
                key={monthName}
                onClick={() => props.jumpToId(index.toString())}
                variant={`${props.activeMonth === index ? "contained" : "text"}`}
                size="small"
              >
                {monthName}
              </Button>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default MonthSelector;
