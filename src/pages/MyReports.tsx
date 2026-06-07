import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ReportTimeline from "@/components/ReportTimeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, MapPin, Calendar } from "lucide-react";
import { useReports, ReportData } from "@/contexts/ReportsContext";

const MyReports = () => {
  const { reports } = useReports();
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (reports.length > 0 && !selectedReport) {
      setSelectedReport(reports[0]);
    } else if (reports.length > 0 && selectedReport) {
      // If the selected report is no longer in the list (e.g. data cleared), reset it
      if (!reports.find(r => r.id === selectedReport.id)) {
        setSelectedReport(reports[0]);
      }
    }
  }, [reports, selectedReport]);
const filteredReports = reports.filter((report) => {
  const matchesSearch =
    report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || report.status === statusFilter;

  return matchesSearch && matchesStatus;
});


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container-responsive py-responsive">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-responsive-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            My Reports
          </h1>
          <p className="text-muted-foreground text-responsive-lg leading-relaxed max-w-4xl">
            Track the status of your submitted violation reports in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Reports */}
          <Card className="lg:col-span-1 flex flex-col h-[600px]">
            <CardHeader>
  <CardTitle>History</CardTitle>
  <CardDescription>
    Select a report to view its timeline.
  </CardDescription>

  <input
    type="text"
    placeholder="Search reports..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full mt-3 px-3 py-2 rounded-md border bg-background"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full mt-2 px-3 py-2 rounded-md border bg-background"
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Under Review">Under Review</option>
    <option value="Resolved">Resolved</option>
  </select>
</CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center text-muted-foreground p-4">No reports found.</div>
                  ) : (
                filteredReports.map(report => (       
                      <div
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                          selectedReport?.id === report.id ? "bg-primary/5 border-primary shadow-sm" : "border-border bg-card"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm">{report.id}</span>
                          <Badge variant={report.status === "Resolved" ? "default" : "secondary"} className="text-[10px]">
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-foreground mb-1">
                          <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                          {report.location}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {report.date}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Timeline View */}
          <Card className="lg:col-span-2">
            {!selectedReport ? (
              <div className="h-full flex items-center justify-center text-muted-foreground p-8">
                Select a report to view details.
              </div>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{selectedReport.location}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{selectedReport.id}</span>
                        <span>•</span>
                        <span>{selectedReport.type}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={selectedReport.status === "Resolved" ? "default" : "outline"} className="text-sm px-3 py-1">
                      Status: {selectedReport.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="max-w-2xl mx-auto py-4">
                    <ReportTimeline 
                      currentStage={selectedReport.status} 
                      events={selectedReport.events} 
                    />
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyReports;
