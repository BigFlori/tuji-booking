import { Dayjs } from "dayjs";

export default interface Report {
  id: string;
  title: string;
  createdAt: Dayjs;
  period: Period;
  groups: GroupSummaryDictionary;
  summary: Summary;
}

interface Period {
  from: Dayjs;
  to: Dayjs;
}

export interface Summary {
  notPaid: number;
  depositPaid: number;
  fullPaid: number;
  blocked: number;
  expenses: number;
  balance: number;
}

export interface GroupSummaryDictionary {
  [key: string]: Summary;
}

