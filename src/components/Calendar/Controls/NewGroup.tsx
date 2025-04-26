import AnimatedModal from "@/components/UI/Modal/AnimatedModal";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateGroupApollo from "@/components/Forms/create-group/CreateGroupApollo";
import GroupHeaderButton from "@/components/UI/styled/GroupHeaderButton";
import { CALENDAR_GROUP_WIDTH } from "@/utils/config";

interface ICalendarGroupHeaderProps {
  isExpanded: boolean;
}

// Új csoport létrehozó gomb, amely modális ablakot nyit az űrlappal
const NewGroup: React.FC<ICalendarGroupHeaderProps> = (props: ICalendarGroupHeaderProps) => {
  const [modalOpened, setModalOpened] = useState(false);

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  return (
    <>
      <GroupHeaderButton
        sx={(theme) => ({
          borderBottom: "1px solid" + theme.palette.calendarBorder.main,
          width: props.isExpanded ? CALENDAR_GROUP_WIDTH : CALENDAR_GROUP_WIDTH * 0.4,
          justifyContent: "center",
          paddingInline: 0,
        })}
        onClick={handleModalOpen}
      >
        <Typography
          fontWeight={500}
          fontSize={props.isExpanded ? 14 : 10.5}
          alignItems="center"
          display="flex"
          gap={0.4}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Új csoport
        </Typography>
      </GroupHeaderButton>
      <AnimatedModal open={modalOpened} onClose={handleModalClose}>
        <CreateGroupApollo onClose={handleModalClose} />
      </AnimatedModal>
    </>
  );
};

export default NewGroup;
