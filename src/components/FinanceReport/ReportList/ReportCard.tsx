import React, { useState } from "react";
import { Box, Card, Typography, IconButton, Chip, Menu, MenuItem, Button, alpha, Avatar, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DownloadIcon from "@mui/icons-material/Download";
import CompareIcon from "@mui/icons-material/Compare";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PersonIcon from "@mui/icons-material/Person";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import GroupType from "@/models/group/group-type-model";
import Report from "@/models/report-model";
import { useGroupContext } from "@/store/group-context";
import { formatCurrency } from "@/utils/helpers";

// Mini chart component for the report card
const MiniChart: React.FC<{ isPositive: boolean }> = ({ isPositive }) => {
  const height = 40;
  const width = 120;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={isPositive ? "positiveGradient" : "negativeGradient"} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? "#4CAF50" : "#F44336"} stopOpacity="0.8" />
          <stop offset="100%" stopColor={isPositive ? "#4CAF50" : "#F44336"} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Line chart */}
      <path
        d={`M0,${height} L10,${height * 0.8} L20,${height * 0.6} L30,${isPositive ? height * 0.4 : height * 0.7} L40,${
          isPositive ? height * 0.3 : height * 0.9
        } L50,${isPositive ? height * 0.2 : height * 0.5} L60,${isPositive ? height * 0.1 : height * 0.7} L70,${
          isPositive ? height * 0.15 : height * 0.6
        } L80,${isPositive ? height * 0.05 : height * 0.8} L90,${isPositive ? height * 0.1 : height * 0.4} L100,${
          isPositive ? height * 0.2 : height * 0.5
        } L110,${isPositive ? height * 0.1 : height * 0.7} L120,${isPositive ? height * 0.05 : height * 0.8}`}
        stroke={isPositive ? "#4CAF50" : "#F44336"}
        strokeWidth="2"
        fill="none"
      />

      {/* Area under the line */}
      <path
        d={`M0,${height} L10,${height * 0.8} L20,${height * 0.6} L30,${isPositive ? height * 0.4 : height * 0.7} L40,${
          isPositive ? height * 0.3 : height * 0.9
        } L50,${isPositive ? height * 0.2 : height * 0.5} L60,${isPositive ? height * 0.1 : height * 0.7} L70,${
          isPositive ? height * 0.15 : height * 0.6
        } L80,${isPositive ? height * 0.05 : height * 0.8} L90,${isPositive ? height * 0.1 : height * 0.4} L100,${
          isPositive ? height * 0.2 : height * 0.5
        } L110,${isPositive ? height * 0.1 : height * 0.7} L120,${
          isPositive ? height * 0.05 : height * 0.8
        } L120,${height} L0,${height}`}
        fill={`url(#${isPositive ? "positiveGradient" : "negativeGradient"})`}
        opacity="0.2"
      />
    </svg>
  );
};

const getGroupIcon = (type: GroupType) => {
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
      return <AirportShuttleIcon fontSize="small" />;
  }
};

interface ReportCardProps {
  report: Report;
  onViewDetails: (report: Report) => void;
  onDeleteReport?: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onViewDetails, onDeleteReport }) => {
  const [favorite, setFavorite] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const groupCtx = useGroupContext();

  const dateRange = `${report.period.from.format("YYYY.MM.DD")} — ${report.period.to.format("YYYY.MM.DD")}`;
  const createdAt = report.createdAt.format("YYYY.MM.DD HH:mm");
  const formattedBalance = formatCurrency(report.summary.balance);

  const isPositive = report.summary.balance >= 0;

  const selectedGroupCount = report.selectedGroupIds?.length || 0;
  const totalGroupCount = groupCtx.groups.length;

  const groupsToDisplay = groupCtx.groups.filter((group) => report.selectedGroupIds?.includes(group.id));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const handleViewDetails = () => {
    onViewDetails(report);
  };

  const handleDelete = () => {
    if (onDeleteReport) {
      onDeleteReport(report);
    }
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="subtitle1" fontWeight="medium">
              {dateRange}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={toggleFavorite}>
              {favorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
            </IconButton>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Exportálás
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <CompareIcon fontSize="small" sx={{ mr: 1 }} /> Összehasonlítás
              </MenuItem>
              {onDeleteReport && (
                <MenuItem onClick={handleDelete}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Törlés
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Készült: {createdAt}
        </Typography>
      </Box>

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <MiniChart isPositive={isPositive} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={isPositive ? "success.main" : "error.main"}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {isPositive ? <TrendingUpIcon sx={{ mr: 0.5 }} /> : <TrendingDownIcon sx={{ mr: 0.5 }} />}
            {formattedBalance}
          </Typography>

          <Chip
            label={`${selectedGroupCount}/${totalGroupCount} csoport`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: "wrap" }}>
          {groupsToDisplay.map((group) => (
            <Avatar
              key={group.id}
              sx={{
                width: 24,
                height: 24,
                bgcolor: "primary.main",
                fontSize: 14,
              }}
            >
              {React.cloneElement(getGroupIcon(group.type), { sx: { fontSize: 14 } })}
            </Avatar>
          ))}

          {Array.from({ length: Math.max(0, totalGroupCount - selectedGroupCount) }).map((_, i) => (
            <Avatar
              key={`empty-${i}`}
              sx={{
                width: 24,
                height: 24,
                bgcolor: (theme) => alpha(theme.palette.action.disabled, 0.3),
                fontSize: 14,
              }}
            >
              {React.cloneElement(getGroupIcon(GroupType.OTHER), {
                sx: { fontSize: 14, opacity: 0.5 },
              })}
            </Avatar>
          ))}
        </Stack>
      </Box>

      <Button
        fullWidth
        endIcon={<ExpandMoreIcon />}
        onClick={handleViewDetails}
        sx={{
          borderRadius: 0,
          py: 1,
          justifyContent: "space-between",
          px: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        Részletek
      </Button>
    </Card>
  );
};

export default ReportCard;
