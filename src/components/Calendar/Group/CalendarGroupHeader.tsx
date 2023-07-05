import { useState, useContext } from "react";
import { GroupContext } from "@/store/group-context";
import Typography from "@mui/material/Typography";
import Group from "@/models/group/group-model";
import { CALENDAR_GROUP_WIDTH } from "@/config/config";
import GroupHeaderButton from "../../UI/styled/GroupHeaderButton";
import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GroupState from "@/models/group/group-state-model";
import GroupType from "@/models/group/group-type-model";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import TaxiAlert from "@mui/icons-material/Person";
import AnimatedModal from "../../UI/Modal/AnimatedModal";
import GroupEditForm, { IGroupEditFormValues } from "../../Forms/GroupEditForm";
import { SubmitHandler } from "react-hook-form";

interface ICalendarGroupHeaderProps {
  isExpanded: boolean;
  toggleIsExpanded?: () => void;
  group: Group;
  isLast?: boolean;
};

const CalendarGroupHeader: React.FC<ICalendarGroupHeaderProps> = (props: ICalendarGroupHeaderProps) => {
  const groupCtx = useContext(GroupContext);

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
        return <DirectionsCarIcon />;
      case GroupType.HOUSE:
        return <HomeIcon />;
      case GroupType.DRIVER:
        return <TaxiAlert />;
      default:
        return <DirectionsCarIcon />;
    }
  };

  const submitHandler: SubmitHandler<IGroupEditFormValues> = (data) => {
    //console.log(data);

    const groupType = Object.values(GroupType).find((type) => type === data.type);
    const groupState = Object.values(GroupState).find((state) => state === data.state);

    if (!groupType || !groupState) {
      return;
    }

    const updatedGroup: Group = {
      ...props.group,
      title: data.title,
      type: groupType,
      state: groupState,
      description: data.description,
    };
    groupCtx.updateGroup(props.group.id, updatedGroup);
    setModalOpened(false);
  };

  const deleteHandler = () => {
    groupCtx.removeGroup(props.group.id);
    setModalOpened(false);
  };

  return (
    <>
      <GroupHeaderButton
        sx={(theme) => ({
          borderBottom: props.isLast ? "1px solid" + theme.palette.grey[300] : "none",
          width: props.isExpanded ? CALENDAR_GROUP_WIDTH : CALENDAR_GROUP_WIDTH * 0.4,
          justifyContent: props.isExpanded ? "space-between" : "center",
          paddingInline: props.isExpanded ? theme.spacing(1) : 0,
        })}
        onClick={handleGroupClick}
      >
        <Typography
          fontWeight={500}
          fontSize={props.isExpanded ? 14 : 10.5}
          //sx={{ transition: "font-size 0.3s" }}
        >
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
        <GroupEditForm
          group={props.group}
          onClose={handleModalClose}
          onSubmit={submitHandler}
          onDelete={deleteHandler}
         />
      </AnimatedModal>
    </>
  );
};

export default CalendarGroupHeader;
