import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  List,
  ListItem,
  Divider,
  alpha
} from '@mui/material';
import Report from '@/models/report-model';
import { useReportContext } from '@/store/report-context';
import EmptyReportState from './EmptyReportState';
import ReportTable from './ReportTable';
import { useGroupContext } from '@/store/group-context';
import { formatCurrency } from '@/utils/helpers';

interface ReportListProps {
  onCreateReport: () => void;
}

// Jelentések listáját megjelenítő komponens
const ReportList: React.FC<ReportListProps> = ({ onCreateReport }) => {
  const reportCtx = useReportContext();
  const groupCtx = useGroupContext();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const totalGroupCount = groupCtx.groups.length;
  
  // Jelentések rendezése létrehozás dátuma szerint (legújabb elöl)
  const sortedReports = useMemo(() => {
    return [...reportCtx.reports].sort((a, b) => 
      b.createdAt.unix() - a.createdAt.unix()
    );
  }, [reportCtx.reports]);
  
  // Jelentés részleteinek megjelenítése
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
  };
  
  // Ha nincs jelentés, akkor üres állapotot jelenítünk meg
  if (reportCtx.reports.length === 0) {
    return <EmptyReportState onCreateReport={onCreateReport} />;
  }
  
  return (
    <Box>
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