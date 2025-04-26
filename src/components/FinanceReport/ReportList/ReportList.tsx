import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  ToggleButtonGroup, 
  ToggleButton,
  List,
  ListItem,
  Divider,
  alpha
} from '@mui/material';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewListIcon from '@mui/icons-material/ViewList';
import Report from '@/models/report-model';
import { useReportContext } from '@/store/report-context';
import EmptyReportState from './EmptyReportState';
import ReportCard from './ReportCard';
import ReportTable from './ReportTable';
import { useGroupContext } from '@/store/group-context';
import { formatCurrency } from '@/utils/helpers';

interface ReportListProps {
  onCreateReport: () => void;
}

const ReportList: React.FC<ReportListProps> = ({ onCreateReport }) => {
  const reportCtx = useReportContext();
  const groupCtx = useGroupContext();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const totalGroupCount = groupCtx.groups.length;
  
  // Jelentések rendezése létrehozás dátuma szerint (legújabb elöl)
  const sortedReports = useMemo(() => {
    return [...reportCtx.reports].sort((a, b) => 
      b.createdAt.unix() - a.createdAt.unix()
    );
  }, [reportCtx.reports]);
  
  // Handler for view mode toggle
  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>, 
    newMode: 'card' | 'list' | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  // Jelentés részleteinek megjelenítése
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
  };
  
  // Jelentés törlése
  const handleDeleteReport = (report: Report) => {
    reportCtx.removeReport(report.id);
    if (selectedReport?.id === report.id) {
      setSelectedReport(null);
    }
  };
  
  // Ha nincs jelentés, akkor üres állapotot jelenítünk meg
  if (reportCtx.reports.length === 0) {
    return <EmptyReportState onCreateReport={onCreateReport} />;
  }
  
  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          mb: 3
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="card" aria-label="card view">
            <ViewAgendaIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {viewMode === 'card' ? (
        // Kártya nézet
        <Grid container spacing={3}>
          {sortedReports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 2,
                bgcolor: selectedReport?.id === report.id ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                border: selectedReport?.id === report.id ? '1px solid' : 'none',
                borderColor: 'primary.main',
              }}>
                <ReportCard 
                  report={report} 
                  onViewDetails={handleViewDetails}
                  onDeleteReport={handleDeleteReport}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Lista nézet
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {sortedReports.map((report, index) => (
            <React.Fragment key={report.id}>
              <ListItem 
                sx={{ 
                  display: 'block', 
                  py: 2,
                  bgcolor: selectedReport?.id === report.id ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  '&:hover': {
                    bgcolor: selectedReport?.id === report.id 
                      ? (theme) => alpha(theme.palette.primary.main, 0.12)
                      : 'action.hover'
                  }
                }}
                onClick={() => handleViewDetails(report)}
                button
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {report.period.from.format('YYYY.MM.DD')} — {report.period.to.format('YYYY.MM.DD')}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="medium"
                    color={report.summary.balance >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(report.summary.balance)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Készült: {report.createdAt.format('YYYY.MM.DD HH:mm')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.selectedGroupIds?.length || 0}/{totalGroupCount} csoport
                  </Typography>
                </Box>
              </ListItem>
              {index < sortedReports.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
      
      {selectedReport && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Jelentés részletei
          </Typography>
          <ReportTable report={selectedReport} />
        </Box>
      )}
    </Box>
  );
};

export default ReportList;