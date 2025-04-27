import React from 'react';
import { Box, Typography, Button, Paper, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface EmptyReportStateProps {
  onCreateReport: () => void;
}

// Üres állapot megjelenítése, ha még nincsenek jelentések
const EmptyReportState: React.FC<EmptyReportStateProps> = ({ onCreateReport }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      py: 6,
      px: 4
    }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Még nincsenek jelentéseid
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ maxWidth: 500, mb: 2 }}
      >
        A pénzügyi jelentések segítenek nyomon követni a bevételeket és kiadásokat 
        időszakonként és csoportonként lebontva. Készítsd el első jelentésed most!
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mb: 4, fontStyle: 'italic' }}
      >
        A jelentések csak ideiglenesen tárolódnak, nem kerülnek mentésre az adatbázisba.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={onCreateReport}
        sx={{ mb: 4 }}
        size="large"
      >
        Első jelentés létrehozása
      </Button>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          maxWidth: 500,
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <LightbulbIcon 
            color="primary" 
            sx={{ mr: 1, opacity: 0.7, fontSize: 20, mt: 0.5 }} 
          />
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="medium">
              Tipp a hatékony használathoz
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A jelentésekkel könnyedén azonosíthatod a legjövedelmezőbb csoportokat és 
              időszakokat. Negyedévente készített jelentésekkel átfogó képet kaphatsz a 
              pénzügyi teljesítményről. A jelentések nem kerülnek mentésre az adatbázisba.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmptyReportState;