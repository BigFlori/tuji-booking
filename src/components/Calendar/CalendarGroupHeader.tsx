import { useState, useContext, useRef } from "react";
import { GroupContext } from "@/store/group-context";
import Typography from "@mui/material/Typography";
import Group from "@/models/group/group-model";
import { CALENDAR_GROUP_WIDTH } from "@/config/config";
import MenuIcon from "@mui/icons-material/Menu";
import GroupHeaderButton from "../UI/styled/GroupHeaderButton";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import EditorModal from "../UI/EditorModal";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GroupState from "@/models/group/group-state-model";
import GroupType from "@/models/group/group-type-model";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import TaxiAlert from "@mui/icons-material/Person";

type CalendarGroupHeaderProps = {
  isExpanded: boolean;
  toggleIsExpanded?: () => void;
  group: Group;
  isLast?: boolean;
};

const CalendarGroupHeader: React.FC<CalendarGroupHeaderProps> = (props: CalendarGroupHeaderProps) => {
  const groupCtx = useContext(GroupContext);
  const [groupTitle, setGroupTitle] = useState(props.group.title);
  const [selectedGroupType, setSelectedGroupType] = useState<string>(props.group.type);
  const [selectedGroupState, setSelectedGroupState] = useState<string>(props.group.state);
  const [groupDescription, setGroupDescription] = useState(props.group.description);

  const [modalOpened, setModalOpened] = useState(false);

  const handleGroupClick = () => {
    setModalOpened(true);
  };

  const closeModalHandler = () => {
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

  const saveGroupHandler = () => {
    const groupType: GroupType | undefined = Object.values(GroupType).find((type) => type === selectedGroupType);

    const groupState: GroupState | undefined = Object.values(GroupState).find((state) => state === selectedGroupState);

    if (!selectedGroupType || !selectedGroupState) {
      return;
    }

    const updatedGroup: Group = {
      ...props.group,
      title: groupTitle,
      type: groupType!,
      state: groupState!,
      description: groupDescription,
    };
    groupCtx.updateGroup(props.group.id, updatedGroup);
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
          fontWeight={"bold"}
          fontSize={props.isExpanded ? 16 : 16 * 0.7}
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

      <EditorModal
        open={modalOpened}
        onClose={closeModalHandler}
        onSave={saveGroupHandler}
        title="Csoport szerkesztése"
      >
        <Box sx={{ borderBottom: "1px solid grey", marginBottom: 4 }}>
          <Typography variant="body1">Alapinformációk</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            id="group-title"
            label="Csoport neve"
            value={groupTitle}
            onChange={(event) => setGroupTitle(event.target.value.slice(0, 8))}
            fullWidth
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel id="group-type-select-label">Típus</InputLabel>
            <Select
              labelId="group-type-select-label"
              id="group-type-select"
              label="Típus"
              value={selectedGroupType}
              onChange={(event) => setSelectedGroupType(event.target.value)}
            >
              <MenuItem value="CAR">Autó</MenuItem>
              <MenuItem value="HOUSE">Lakás</MenuItem>
              <MenuItem value="DRIVER">Sofőr</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="group-state-select-label">Állapot</InputLabel>
            <Select
              labelId="group-state-select-label"
              id="group-state-select"
              label="Állapot"
              value={selectedGroupState}
              onChange={(event) => setSelectedGroupState(event.target.value)}
            >
              <MenuItem value="ACTIVE">Aktív</MenuItem>
              <MenuItem value="SOLD">Eladva</MenuItem>
              <MenuItem value="IN_SERVICE">Szervízben</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="group-description"
            label="Leírás"
            fullWidth
            multiline
            rows={4}
            size="small"
            value={groupDescription}
            onChange={(event) => setGroupDescription(event.target.value)}
          />
        </Box>
      </EditorModal>
    </>
  );
};

export default CalendarGroupHeader;
