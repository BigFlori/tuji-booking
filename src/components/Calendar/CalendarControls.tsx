import { useEffect, useState } from "react";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";

type CalendarControlsProps = {
  year: number;
  activeMonth: number;
  increaseYear: () => void;
  decreaseYear: () => void;
};

const monthNames = Array.from(Array(12).keys()).map((month) =>
  dayjs().locale("hu-hu").month(month).format("MMM")
);

const foldMonthsAt = 1200;

const CalendarControls: React.FC<CalendarControlsProps> = (
  props: CalendarControlsProps
) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > foldMonthsAt);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const jumpToId = (id: string) => {
    const monthElement = document.getElementById(id);
    if (monthElement) {
      monthElement.scrollIntoView({
        behavior: "auto",
        block: id === "today" ? "center" : "start",
        inline: id === "today" ? "center" : "start",
      });
    }
  };

  const nextYear = () => {
    props.increaseYear();
    jumpToId("0");
  };

  const prevYear = () => {
    props.decreaseYear();
    jumpToId("11");
  };

  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={prevYear}>
          <ArrowBackIosNew />
        </IconButton>
        <Typography variant='h5'>{props.year}</Typography>
        <IconButton onClick={nextYear}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
      {isDesktop ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box>
            <Button onClick={() => jumpToId("today")}>Ma</Button>
          </Box>
          {monthNames.map((monthName, index) => {
            return (
              <Button
                key={monthName}
                onClick={() => jumpToId(index.toString())}
                variant={`${
                  props.activeMonth === index ? "contained" : "outlined"
                }`}
              >
                {monthName}
              </Button>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant='h6'>{monthNames[props.activeMonth]}</Typography>
          <Button onClick={handleClick} variant='outlined'>
            Hónapok
          </Button>
          <Menu
            id='month-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => jumpToId("today")}>Ma</MenuItem>
            {monthNames.map((monthName, index) => {
              return (
                <MenuItem
                  key={monthName}
                  onClick={() => jumpToId(index.toString())}
                >
                  {monthName}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default CalendarControls;
