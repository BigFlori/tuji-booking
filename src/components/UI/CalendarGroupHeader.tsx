import { useState } from "react";
import Typography from "@mui/material/Typography";
import Group from "@/models/group-model";
import { CALENDAR_GROUP_WIDTH } from "@/config/config";
import MenuIcon from "@mui/icons-material/Menu";
import GroupHeaderButton from "./styled/GroupHeaderButton";
import { Box, Modal, Theme, useMediaQuery } from "@mui/material";
import FullScreenModal from "./styled/FullScreenModal";

type CalendarGroupHeaderProps = {
  isExpanded: boolean;
  toggleIsExpanded?: () => void;
  group?: Group;
  isLast?: boolean;
};

const CalendarGroupHeader: React.FC<CalendarGroupHeaderProps> = (props: CalendarGroupHeaderProps) => {
  //const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [modalOpened, setModalOpened] = useState(false);

  const handleGroupClick = () => {
    if (!props.group) {
      props.toggleIsExpanded?.();
    } else {
      setModalOpened(true);
    }
  };

  const closeModalHandler = () => {
    setModalOpened(false);
  };

  return (
    <>
      <GroupHeaderButton
        sx={(theme) => ({
          borderBottom: props.isLast ? "1px solid" + theme.palette.grey[300] : "none",
          width: props.isExpanded ? CALENDAR_GROUP_WIDTH : CALENDAR_GROUP_WIDTH * 0.4,
        })}
        onClick={handleGroupClick}
      >
        {props.group ? (
          <Typography
            fontWeight={"bold"}
            fontSize={props.isExpanded ? 16 : 16 * 0.8}
            sx={{ transition: "font-size 0.3s" }}
          >
            {props.group.title}
          </Typography>
        ) : (
          <MenuIcon />
        )}
      </GroupHeaderButton>
      <FullScreenModal open={modalOpened} onClose={closeModalHandler}>
        <Box className="modal-content">as</Box>
      </FullScreenModal>
    </>
  );
};

export default CalendarGroupHeader;
