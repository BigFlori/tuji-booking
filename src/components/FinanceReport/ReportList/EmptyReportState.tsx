import React from 'react';
import { Box, Typography, Button, Paper, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

// SVG Illusztráció a pénzügyi jelentésekhez
const ReportIllustration: React.FC = () => (
  <svg width="200" height="150" viewBox="0 0 200 150">
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2196F3" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#2196F3" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <rect x="30" y="20" width="140" height="100" rx="5" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2"/>
    <rect x="45" y="35" width="110" height="15" rx="2" fill="#e0e0e0"/>
    <rect x="45" y="60" width="70" height="8" rx="2" fill="#e0e0e0"/>
    <rect x="45" y="75" width="90" height="8" rx="2" fill="#e0e0e0"/>
    <rect x="45" y="90" width="50" height="8" rx="2" fill="#e0e0e0"/>
    
    {/* Chart elements */}
    <path d="M40,110 L50,90 L60,95 L70,80 L80,70 L90,65 L100,55 L110,60 L120,50 L130,55 L140,45 L150,55 L160,40" 
          stroke="#2196F3" 
          strokeWidth="3" 
          fill="none"/>
    <path d="M40,110 L50,90 L60,95 L70,80 L80,70 L90,65 L100,55 L110,60 L120,50 L130,55 L140,45 L150,55 L160,40 L160,110 L40,110" 
          fill="url(#chartGradient)"/>
    
    {/* Add icon */}
    <circle cx="150" cy="40" r="15" fill="#4CAF50"/>
    <line x1="150" y1="33" x2="150" y2="47" stroke="white" strokeWidth="2"/>
    <line x1="143" y1="40" x2="157" y2="40" stroke="white" strokeWidth="2"/>
  </svg>
);

interface EmptyReportStateProps {
  onCreateReport: () => void;
}

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
      <Box sx={{ mb: 3 }}>
        <ReportIllustration />
      </Box>
      
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