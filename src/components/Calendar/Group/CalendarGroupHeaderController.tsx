import { CALENDAR_GROUP_WIDTH } from "@/utils/config";
import GroupHeaderButton from "../../UI/styled/GroupHeaderButton";
import MenuIcon from "@mui/icons-material/Menu";

interface ICalendarGroupHeaderControllerProps {
  isExpanded: boolean;
  toggleIsExpanded: () => void;
};

// Gomb a naptárcsoport kinyitott állapotának vezérlésére
const CalendarGroupHeaderController: React.FC<ICalendarGroupHeaderControllerProps> = (
  props: ICalendarGroupHeaderControllerProps
) => {
  return (
    <GroupHeaderButton
      sx={{
        borderBottom: "none",
        width: props.isExpanded ? CALENDAR_GROUP_WIDTH : CALENDAR_GROUP_WIDTH * 0.4,
        justifyContent: "center",
        paddingInline: 0,
      }}
      onClick={props.toggleIsExpanded}
    >
      <MenuIcon />
    </GroupHeaderButton>
  );
};

export default CalendarGroupHeaderController;
