import { useState } from "react";
import Typography from "@mui/material/Typography";
import Group from "@/models/group/group-model";
import { CALENDAR_GROUP_WIDTH } from "@/utils/config";
import GroupHeaderButton from "../../UI/styled/GroupHeaderButton";
import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GroupState from "@/models/group/group-state-model";
import AnimatedModal from "../../UI/Modal/AnimatedModal";
import EditGroupApollo from "@/components/Forms/edit-group/EditGroupApollo";
import GroupType from "@/models/group/group-type-model";
import HomeIcon from '@mui/icons-material/Home';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import PersonIcon from '@mui/icons-material/Person';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import PendingIcon from '@mui/icons-material/Pending';

interface ICalendarGroupHeaderProps {
  isExpanded: boolean;
  toggleIsExpanded?: () => void;
  group: Group;
}

// Segédfunkció a csoport típus ikonjának megjelenítéséhez
const getGroupTypeIcon = (type: GroupType) => {
  switch (type) {
    case GroupType.CAR:
      return <AirportShuttleIcon fontSize="small" />;
    case GroupType.HOUSE:
      return <HomeIcon fontSize="small" />;
    case GroupType.DRIVER:
      return <PersonIcon fontSize="small" />;
    case GroupType.CAR_WASH:
      return <LocalCarWashIcon fontSize="small" />;
    default:
      return <PendingIcon fontSize="small" />;
  }
};

// Csoport fejléc komponens, ami megjeleníti a csoport nevét, állapotát és típusának ikonját
const CalendarGroupHeader: React.FC<ICalendarGroupHeaderProps> = (props: ICalendarGroupHeaderProps) => {
  const [modalOpened, setModalOpened] = useState(false);
  
  const handleGroupClick = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  return (
    <>
      <GroupHeaderButton
        sx={(theme) => ({
          borderBottom: "none",
          width: props.isExpanded ? CALENDAR_GROUP_WIDTH : CALENDAR_GROUP_WIDTH * 0.4,
          justifyContent: props.isExpanded ? "space-between" : "center",
          paddingInline: props.isExpanded ? theme.spacing(1) : 0,
          textAlign: props.isExpanded ? "left" : "center",
        })}
        onClick={handleGroupClick}
      >
        <Typography fontWeight={500} fontSize={props.isExpanded ? 14 : 10.5}>
          {props.group.title}
        </Typography>
        {props.isExpanded && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {getGroupTypeIcon(props.group.type)}
            {props.group.state === GroupState.ACTIVE ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
          </Box>
        )}
      </GroupHeaderButton>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <EditGroupApollo group={props.group} onClose={handleModalClose} />
      </AnimatedModal>
    </>
  );
};

export default CalendarGroupHeader;
