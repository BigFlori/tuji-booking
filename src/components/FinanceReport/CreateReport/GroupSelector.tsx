import React, { useState } from 'react';
import { 
  Box,
  Chip,
  FormControl,
  FormGroup,
  FormLabel,
  Typography,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Collapse
} from '@mui/material';
import { useGroupContext } from '@/store/group-context';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupType from '@/models/group/group-type-model';
import Group from '@/models/group/group-model';
import HomeIcon from '@mui/icons-material/Home';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import PersonIcon from '@mui/icons-material/Person';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import PendingIcon from '@mui/icons-material/Pending';
import FilterListIcon from '@mui/icons-material/FilterList';

interface GroupSelectorProps {
  selectedGroups: string[];
  onSelectedGroupsChange: (groups: string[]) => void;
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

const GroupSelector: React.FC<GroupSelectorProps> = ({ selectedGroups, onSelectedGroupsChange }) => {
  const { groups } = useGroupContext();
  const [expanded, setExpanded] = useState(false);

  // Csoportok rendezése típus szerint
  const groupsByType = groups.reduce((acc, group) => {
    if (!acc[group.type]) {
      acc[group.type] = [];
    }
    acc[group.type].push(group);
    return acc;
  }, {} as Record<string, Group[]>);

  // Összes csoport kiválasztása
  const handleSelectAll = () => {
    onSelectedGroupsChange(groups.map(group => group.id));
  };

  // Összes kiválasztás törlése
  const handleClearAll = () => {
    onSelectedGroupsChange([]);
  };

  // Egyedi csoport kiválasztása/törlése
  const handleToggleGroup = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      onSelectedGroupsChange(selectedGroups.filter(id => id !== groupId));
    } else {
      onSelectedGroupsChange([...selectedGroups, groupId]);
    }
  };

  // Típus szerinti csoportok kiválasztása
  const handleSelectByType = (type: GroupType) => {
    const groupIdsOfType = groupsByType[type]?.map(group => group.id) || [];
    const alreadySelectedGroupIds = selectedGroups.filter(
      id => !groupIdsOfType.includes(id)
    );
    onSelectedGroupsChange([...alreadySelectedGroupIds, ...groupIdsOfType]);
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          mb: expanded ? 1 : 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Csoportok szűrése
          </Typography>
          <Chip 
            label={`${selectedGroups.length} / ${groups.length} kiválasztva`}
            size="small"
            color={selectedGroups.length > 0 ? "primary" : "default"}
            sx={{ ml: 2 }}
          />
        </Box>
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Csoportok megjelenítése"
          size="small"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Paper>

      <Collapse in={expanded}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              size="small" 
              startIcon={<CheckCircleIcon />} 
              onClick={handleSelectAll}
              variant="outlined"
            >
              Összes kiválasztása
            </Button>
            <Button 
              size="small" 
              startIcon={<CancelIcon />} 
              onClick={handleClearAll}
              variant="outlined"
              color="error"
            >
              Kiválasztás törlése
            </Button>
          </Box>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>Csoportok típus szerint</FormLabel>
            
            {/* Típus szerinti csoportosítás */}
            {Object.entries(groupsByType).map(([type, groupsOfType]) => (
              <Box key={type} sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1, 
                  pb: 0.5,
                  borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}>
                  {getGroupTypeIcon(type as GroupType)}
                  <Typography variant="subtitle2" sx={{ ml: 1 }}>
                    {type === GroupType.CAR ? 'Autók' : 
                     type === GroupType.HOUSE ? 'Szállások' :
                     type === GroupType.DRIVER ? 'Sofőrök' :
                     type === GroupType.CAR_WASH ? 'Autókozmetika' : 'Egyéb'}
                  </Typography>
                  <Button 
                    size="small"
                    onClick={() => handleSelectByType(type as GroupType)} 
                    sx={{ ml: 2 }}
                  >
                    Összes kiválasztása
                  </Button>
                </Box>
                
                <FormGroup>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {groupsOfType.map(group => (
                      <Tooltip key={group.id} title={group.description || ''}>
                        <Chip
                          icon={getGroupTypeIcon(group.type)}
                          label={group.title}
                          onClick={() => handleToggleGroup(group.id)}
                          color={selectedGroups.includes(group.id) ? "primary" : "default"}
                          variant={selectedGroups.includes(group.id) ? "filled" : "outlined"}
                          sx={{ mb: 1 }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </FormGroup>
              </Box>
            ))}
          </FormControl>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default GroupSelector;