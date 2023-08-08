import { useState } from "react";
import Typography from "@mui/material/Typography";
import Group from "@/models/group/group-model";
import { CALENDAR_GROUP_WIDTH } from "@/utils/config";
import GroupHeaderButton from "../../UI/styled/GroupHeaderButton";
import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GroupState from "@/models/group/group-state-model";
import GroupType from "@/models/group/group-type-model";
import HomeIcon from "@mui/icons-material/Home";
import TaxiAlert from "@mui/icons-material/Person";
import AnimatedModal from "../../UI/Modal/AnimatedModal";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import OtherIcon from "@mui/icons-material/Pending";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import EditGroupApollo from "@/components/Forms/edit-group/EditGroupApollo";

interface ICalendarGroupHeaderProps {
  isExpanded: boolean;
  toggleIsExpanded?: () => void;
  group: Group;
}

const CalendarGroupHeader: React.FC<ICalendarGroupHeaderProps> = (props: ICalendarGroupHeaderProps) => {
  const [modalOpened, setModalOpened] = useState(false);

  const handleGroupClick = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const getIcon = () => {
    switch (props.group.type) {
      case GroupType.CAR:
        return <AirportShuttleIcon />;
      case GroupType.HOUSE:
        return <HomeIcon />;
      case GroupType.DRIVER:
        return <TaxiAlert />;
      case GroupType.CAR_WASH:
        return <LocalCarWashIcon />;
      case GroupType.OTHER:
        return <OtherIcon />;
      default:
        return <OtherIcon />;
    }
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
            {getIcon()}
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
