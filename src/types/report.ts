import { ReportStage, TimelineEvent } from "@/components/ReportTimeline";
export interface ReportData {
  id: string;
  location: string;
  type: string;
  date: string;
  status: ReportStage;
  points?: number;
  events: TimelineEvent[];
}