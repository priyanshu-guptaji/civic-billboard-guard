import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Camera, Activity } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const violationData = [
    { location: "MG Road, Bangalore", type: "Unauthorized", status: "Pending", severity: "High", reported: "2 hours ago" },
    { location: "Brigade Road Junction", type: "Oversized", status: "In Progress", severity: "Medium", reported: "4 hours ago" },
    { location: "Commercial Street", type: "Safety Hazard", status: "Resolved", severity: "High", reported: "1 day ago" },
    { location: "Residency Road", type: "Inappropriate Content", status: "Under Review", severity: "Medium", reported: "3 hours ago" },
    { location: "UB City Mall", type: "Blocking Signals", status: "Pending", severity: "Critical", reported: "1 hour ago" },
  ];

  const stats = {
    totalReports: 1247,
    activeViolations: 89,
    resolvedToday: 23,
    citizenReporters: 3456
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "default";
      case "In Progress": return "secondary";
      case "Pending": return "destructive";
      default: return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      default: return "secondary";
    }
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
            Monitor billboard compliance and manage violation reports across the city
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-responsive mb-8">
          <Card className="card-glass animate-scale-in">
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-primary mr-4" />
              <div>
                <div className="text-responsive-2xl font-bold text-gradient">{stats.totalReports.toLocaleString()}</div>
                <div className="text-responsive-sm text-muted-foreground">Total Reports</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <AlertTriangle className="h-8 w-8 text-warning mr-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.activeViolations}</div>
                <div className="text-sm text-muted-foreground">Active Violations</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-success mr-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.resolvedToday}</div>
                <div className="text-sm text-muted-foreground">Resolved Today</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-accent mr-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.citizenReporters.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Citizen Reporters</div>
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
                  Latest billboard violations reported by citizens and AI detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violationData.map((violation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="font-medium text-foreground">{violation.location}</div>
                          <Badge variant={getSeverityColor(violation.severity)} className="text-xs">
                            {violation.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">{violation.type}</div>
                        <div className="text-xs text-muted-foreground">{violation.reported}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(violation.status)}>
                          {violation.status}
                        </Badge>
                        <Button variant="outline" size="sm">
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
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Button variant="ghost" className="p-0 h-auto w-full justify-start font-normal">
                    <Camera className="h-4 w-4 mr-2" />
                    Launch Field Inspector App
                  </Button>
                </Button>
                <Button variant="outline" className="w-full justify-start">
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
                    <span className="text-sm text-foreground">Unauthorized Billboards</span>
                    <Badge variant="destructive">+15%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Safety Hazards</span>
                    <Badge variant="destructive">+8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Oversized Displays</span>
                    <Badge variant="secondary">-3%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Blocking Signals</span>
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
                    <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                    <span className="text-sm font-medium text-success">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Photos Processed</span>
                    <span className="text-sm font-medium text-foreground">2,347</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Auto-flagged</span>
                    <span className="text-sm font-medium text-warning">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processing Time</span>
                    <span className="text-sm font-medium text-accent">2.3s avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                <h3 className="text-lg font-medium text-foreground mb-2">Interactive Map</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time heatmap showing violation hotspots and enforcement areas
                </p>
                <Button variant="outline">
                  Launch Full Map View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;