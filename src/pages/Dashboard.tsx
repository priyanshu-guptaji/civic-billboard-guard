import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Camera,
  Activity,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Violation {
  location: string;
  type: string;
  status: string;
  severity: string;
  reported: string;
}

const Dashboard = () => {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null,
  );
  const [violationData, setViolationData] = useState([
    {
      location: "MG Road, Bangalore",
      type: "Unauthorized",
      status: "Pending",
      severity: "High",
      reported: "2 hours ago",
    },
    {
      location: "Brigade Road Junction",
      type: "Oversized",
      status: "In Progress",
      severity: "Medium",
      reported: "4 hours ago",
    },
    {
      location: "Commercial Street",
      type: "Safety Hazard",
      status: "Resolved",
      severity: "High",
      reported: "1 day ago",
    },
    {
      location: "Residency Road",
      type: "Inappropriate Content",
      status: "Under Review",
      severity: "Medium",
      reported: "3 hours ago",
    },
    {
      location: "UB City Mall",
      type: "Blocking Signals",
      status: "Pending",
      severity: "Critical",
      reported: "1 hour ago",
    },
  ]);
  const stats = {
    totalReports: 1247,
    activeViolations: 89,
    resolvedToday: 23,
    citizenReporters: 3456,
  };
  const severityData = [
    {
      name: "Critical",
      value: violationData.filter((v) => v.severity === "Critical").length,
    },
    {
      name: "High",
      value: violationData.filter((v) => v.severity === "High").length,
    },
    {
      name: "Medium",
      value: violationData.filter((v) => v.severity === "Medium").length,
    },
    {
      name: "Low",
      value: violationData.filter((v) => v.severity === "Low").length,
    },
  ];

  const statusData = [
    {
      status: "Pending",
      count: violationData.filter((v) => v.status === "Pending").length,
    },
    {
      status: "Under Review",
      count: violationData.filter((v) => v.status === "Under Review").length,
    },
    {
      status: "In Progress",
      count: violationData.filter((v) => v.status === "In Progress").length,
    },
    {
      status: "Resolved",
      count: violationData.filter((v) => v.status === "Resolved").length,
    },
  ];
  const totalViolations = violationData.length;

  const resolvedViolations = violationData.filter(
    (v) => v.status === "Resolved",
  ).length;

  const pendingViolations = violationData.filter(
    (v) => v.status === "Pending",
  ).length;

  const criticalViolations = violationData.filter(
    (v) => v.severity === "Critical",
  ).length;

  const resolutionRate = Math.round(
    (resolvedViolations / totalViolations) * 100,
  );
  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "default";
      case "In Progress":
        return "secondary";
      case "Pending":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      default:
        return "secondary";
    }
  };
  const markAsResolved = () => {
    if (!selectedViolation) return;

    const updatedViolations = violationData.map((violation) =>
      violation.location === selectedViolation.location
        ? { ...violation, status: "Resolved" }
        : violation,
    );

    setViolationData(updatedViolations);

    setSelectedViolation({
      ...selectedViolation,
      status: "Resolved",
    });

    toast.success("Violation marked as resolved successfully");
  };

  const updateViolationStatus = (newStatus: string) => {
    if (!selectedViolation) return;

    const updatedViolations = violationData.map((violation) =>
      violation.location === selectedViolation.location
        ? { ...violation, status: newStatus }
        : violation,
    );

    setViolationData(updatedViolations);

    setSelectedViolation({
      ...selectedViolation,
      status: newStatus,
    });

    toast.success(`Status changed to ${newStatus}`);
  };
  const generatePDFReport = () => {
    const doc = new jsPDF();

    const currentDate = new Date().toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 98, 255);
    doc.text("CivicGuard", 14, 18);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Violation Analytics Report", 14, 30);

    doc.setFontSize(10);
    doc.text(`Generated: ${currentDate}`, 14, 38);

    doc.setLineWidth(0.5);
    doc.line(14, 42, 195, 42);

    // Statistics
    doc.setFontSize(12);
    doc.text(`Total Reports: ${stats.totalReports}`, 14, 55);
    doc.text(`Active Violations: ${stats.activeViolations}`, 14, 63);
    doc.text(`Resolved Today: ${stats.resolvedToday}`, 14, 71);
    doc.text(`Citizen Reporters: ${stats.citizenReporters}`, 14, 79);

    // Analytics
    const highSeverityCount = violationData.filter(
      (v) => v.severity === "High" || v.severity === "Critical",
    ).length;

    const pendingCount = violationData.filter(
      (v) => v.status === "Pending",
    ).length;

    const resolvedCount = violationData.filter(
      (v) => v.status === "Resolved",
    ).length;

    const reportId = `CG-${Date.now().toString().slice(-6)}`;

    doc.setFillColor(245, 245, 245);
    doc.rect(14, 90, 180, 28, "F");

    doc.setFontSize(12);

    doc.text(`High/Critical Violations: ${highSeverityCount}`, 18, 100);

    doc.text(`Pending Cases: ${pendingCount}`, 18, 108);

    doc.text(`Resolved Cases: ${resolvedCount}`, 110, 100);

    doc.text(`Report ID: ${reportId}`, 110, 108);

    // Violations Table
    autoTable(doc, {
      startY: 125,

      head: [["Location", "Type", "Severity", "Status", "Reported"]],

      body: violationData.map((violation) => [
        violation.location,
        violation.type,
        violation.severity,
        violation.status,
        violation.reported,
      ]),

      headStyles: {
        fillColor: [41, 98, 255],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },

      styles: {
        fontSize: 10,
      },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(10);

      doc.text(
        "Generated by CivicGuard Authority Dashboard",
        14,
        pageHeight - 10,
      );

      doc.text(`Page ${i} of ${pageCount}`, 170, pageHeight - 10);
    }

    // Download
    doc.save("civicguard-violation-report.pdf");

    toast.success("PDF report downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container-responsive py-responsive">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-responsive-3xl font-bold text-foreground mb-2">
            Authority Dashboard
          </h1>
          <p className="text-muted-foreground text-responsive-lg leading-relaxed max-w-4xl">
            Monitor billboard compliance and manage violation reports across the
            city
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-responsive mb-8">
          <Card className="card-glass animate-scale-in">
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-primary mr-4" />
              <div>
                <div className="text-responsive-2xl font-bold text-gradient">
                  {stats.totalReports.toLocaleString()}
                </div>
                <div className="text-responsive-sm text-muted-foreground">
                  Total Reports
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <AlertTriangle className="h-8 w-8 text-warning mr-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.activeViolations}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Violations
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-success mr-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.resolvedToday}
                </div>
                <div className="text-sm text-muted-foreground">
                  Resolved Today
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-accent mr-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.citizenReporters.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Citizen Reporters
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Violations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Recent Violation Reports
                </CardTitle>
                <CardDescription>
                  Latest billboard violations reported by citizens and AI
                  detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violationData.map((violation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="font-medium text-foreground">
                            {violation.location}
                          </div>
                          <Badge
                            variant={getSeverityColor(violation.severity)}
                            className="text-xs"
                          >
                            {violation.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {violation.type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {violation.reported}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(violation.status)}>
                          {violation.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedViolation(violation)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start btn-glow" asChild>
                  <Link to="/risk-scoring">
                    <Activity className="h-4 w-4 mr-2 text-accent animate-pulse" />
                    AI Risk Assessment Tool
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Launch Field Inspector App
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={generatePDFReport}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Violation Map
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Reporters
                </Button>
              </CardContent>
            </Card>

            {/* Trending Violations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-warning" />
                  Trending Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      Unauthorized Billboards
                    </span>
                    <Badge variant="destructive">+15%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      Safety Hazards
                    </span>
                    <Badge variant="destructive">+8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      Oversized Displays
                    </span>
                    <Badge variant="secondary">-3%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      Blocking Signals
                    </span>
                    <Badge variant="destructive">+12%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Detection Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Detection Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Accuracy Rate
                    </span>
                    <span className="text-sm font-medium text-success">
                      94.7%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Photos Processed
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      2,347
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Auto-flagged
                    </span>
                    <span className="text-sm font-medium text-warning">
                      156
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Processing Time
                    </span>
                    <span className="text-sm font-medium text-accent">
                      2.3s avg
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard Summary Insights */}
        <div className="mt-8 mb-4">
          <h2 className="text-2xl font-bold">Analytics Overview</h2>

          <p className="text-muted-foreground">
            Quick insights derived from current violation reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">
                Resolution Rate
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-green-500">
                  {resolutionRate}%
                </div>

                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ↑ 5%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Pending Cases</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-yellow-500">
                  {pendingViolations}
                </div>

                <Badge variant="secondary">↓ 2</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">
                Critical Violations
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-red-500">
                  {criticalViolations}
                </div>

                <Badge variant="destructive">Alert</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">
                Total Violations
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-primary">
                  {totalViolations}
                </div>

                <Badge>Live</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Violations by Severity</CardTitle>
              <CardDescription>
                Distribution of reported violations by severity level
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {severityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Violations by Status</CardTitle>

              <CardDescription>
                Current distribution of violation statuses
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <XAxis dataKey="status" />

                    <YAxis />

                    <Tooltip />
                    <Legend />

                    <Bar
                      dataKey="count"
                      name="Violations"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Violation Heatmap Placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              City Violation Heatmap
            </CardTitle>
            <CardDescription>
              Geographic distribution of billboard violations across the city
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Interactive Map
                </h3>
                <p className="text-muted-foreground mb-4">
                  Real-time heatmap showing violation hotspots and enforcement
                  areas
                </p>
                <Button variant="outline">Launch Full Map View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Dialog
          open={!!selectedViolation}
          onOpenChange={() => setSelectedViolation(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Violation Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected violation report.
              </DialogDescription>
            </DialogHeader>

            {selectedViolation && (
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedViolation.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Violation Type
                    </p>
                    <p>{selectedViolation.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Severity</p>
                    <Badge>{selectedViolation.severity}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge>{selectedViolation.status}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Reported</p>
                    <p>{selectedViolation.reported}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/20">
                  <h4 className="font-medium mb-3">AI Assessment</h4>

                  <div className="flex justify-between text-sm">
                    <span>Detection Confidence</span>
                    <span className="font-semibold text-green-500">94%</span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span>Risk Level</span>
                    <span className="font-semibold text-red-500">
                      {selectedViolation.severity}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Description
                  </p>

                  <div className="rounded-md border p-3 text-sm">
                    Billboard reported for compliance review. Additional
                    inspection may be required.
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => updateViolationStatus("Under Review")}
                  >
                    Assign Review
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => updateViolationStatus("Escalated")}
                  >
                    Escalate
                  </Button>

                  <Button onClick={markAsResolved}>Mark Resolved</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
