import { deleteReportDb, fetchReports, saveReportDb } from "@/firebase/firestore-helpers/utils";
import Report from "@/models/report-model";
import React from "react";
import { useUser } from "./user-context";

interface IReportContextObject {
  reports: Report[];
  loadReports: () => void;
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  removeReport: (id: string) => void;
  updateReport: (id: string, report: Report) => void;
  getReport: (id: string) => Report | undefined;
}

export const ReportContext = React.createContext<IReportContextObject>({
  reports: [],
  loadReports: () => {},
  setReports: () => {},
  addReport: () => {},
  removeReport: () => {},
  updateReport: () => {},
  getReport: () => undefined,
});

export const useReportContext = () => {
  return React.useContext(ReportContext);
};

const ReportContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [reports, setReports] = React.useState<Report[]>([]);
  const user = useUser();

  //Loading reports
  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    if (!user) {
      setReports([]);
      return;
    }

    fetchReports(user).then((reports) => {
      setReports(reports);
    });
  };

  const saveReport = async (report: Report) => {
    if (!user) {
      return;
    }
    saveReportDb(user, report);
  }

  const deleteReport = async (id: string) => {
    if (!user) {
      return;
    }
    deleteReportDb(user, id);
  }

  const addReport = (report: Report) => {
    setReports((prevReports) => [report, ...prevReports]);
    saveReport(report);
  };

  const removeReport = (id: string) => {
    setReports((prevReports) => prevReports.filter((report) => report.id !== id));
    deleteReport(id);
  };

  const updateReport = (id: string, report: Report) => {
    setReports((prevReports) => {
      const updatedReports = [...prevReports];
      const index = updatedReports.findIndex((report) => report.id === id);
      updatedReports[index] = report;
      return updatedReports;
    });
    saveReport(report);
  };

  const getReport = (id: string) => {
    return reports.find((report) => report.id === id);
  };

  const contextValue: IReportContextObject = {
    reports,
    loadReports,
    setReports,
    addReport,
    removeReport,
    updateReport,
    getReport,
  };

  return <ReportContext.Provider value={contextValue}>{props.children}</ReportContext.Provider>;
};

export default ReportContextProvider;
