import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock, Upload, Award, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { POINT_STRUCTURE, getCurrentBadge } from "@/lib/gamification";
import { useGamification } from "@/contexts/GamificationContext";
import { useReports } from "@/contexts/ReportsContext";

const Report = () => {
  const { currentUser, reportsCount, addPoints } = useGamification();
  const { reports, addReport } = useReports();
  const userPoints = currentUser.points;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    violationType: "",
    photo: null as File | null
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const typeLabel = violationTypes.find(t => t.id === formData.violationType)?.label || "Unauthorized Billboard";
      addReport({
        location: formData.location,
        type: typeLabel,
      });

      toast({
        title: `+${POINT_STRUCTURE.SUBMIT_REPORT} Points earned!`,
        description: "Your billboard violation report has been received and is being processed by AI.",
      });
      addPoints(POINT_STRUCTURE.SUBMIT_REPORT);
      setIsSubmitting(false);
      setFormData({ location: "", description: "", violationType: "", photo: null });
    }, 2000);
  };

  const violationTypes = [
    { id: "unauthorized", label: "Unauthorized Billboard", icon: "🚫" },
    { id: "oversized", label: "Oversized/Wrong Dimensions", icon: "📏" },
    { id: "damaged", label: "Damaged Structure", icon: "⚠️" },
    { id: "obscene", label: "Inappropriate Content", icon: "🔞" },
    { id: "blocking", label: "Blocks Traffic Signals", icon: "🚦" },
    { id: "unsafe", label: "Safety Hazard", icon: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container-responsive py-responsive">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-responsive-3xl font-bold text-foreground mb-4">
              Report Billboard Violation
            </h1>
            <p className="text-muted-foreground text-responsive-lg leading-relaxed max-w-3xl mx-auto">
              Help keep our city safe and compliant by reporting unauthorized or problematic billboards
            </p>
          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-responsive mb-8">
            <Card className="card-glass">
              <CardContent className="flex items-center p-responsive">
                <Award className="h-8 w-8 text-warning mr-3" />
                <div>
                  <div className="text-responsive-2xl font-bold text-gradient">{userPoints}</div>
                  <div className="text-responsive-sm text-muted-foreground">Your Points</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-glass">
              <CardContent className="flex items-center p-responsive">
                <Zap className="h-8 w-8 text-success mr-3" />
                <div>
                  <div className="text-responsive-2xl font-bold text-gradient">{reportsCount}</div>
                  <div className="text-responsive-sm text-muted-foreground">Reports This Month</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-glass">
              <CardContent className="flex items-center justify-center p-responsive">
                <Badge variant="secondary" className="text-responsive-sm bg-gradient-secondary">
                  {getCurrentBadge(userPoints).icon} {getCurrentBadge(userPoints).name}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive">
            {/* Reporting Form */}
            <Card className="card-glass animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center text-responsive-xl">
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  Submit Report
                </CardTitle>
                <CardDescription className="text-responsive-base">
                  Fill out the details and upload a photo of the billboard violation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Enter location or address"
                        className="pl-10"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Violation Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {violationTypes.map((type) => (
                        <Button
                          key={type.id}
                          type="button"
                          variant={formData.violationType === type.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFormData({...formData, violationType: type.id})}
                          className="justify-start text-xs"
                        >
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="photo">Photo Evidence</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload photo of the billboard violation
                      </p>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, photo: e.target.files?.[0] || null})}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('photo')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Additional Details</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the violation and any safety concerns..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing with AI..." : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick AR Scan */}
            <Card className="card-glass animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center text-responsive-xl">
                  <Zap className="h-5 w-5 mr-2 text-accent" />
                  Quick AR Verification
                </CardTitle>
                <CardDescription className="text-responsive-base">
                  Instantly check if a billboard is authorized using your camera
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="hero-gradient rounded-xl p-6 text-center card-glass">
                  <Camera className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2 text-responsive-lg">AR Scanner</h3>
                  <p className="text-responsive-sm text-muted-foreground mb-4">
                    Point your camera at any billboard to see its authorization status in real-time
                  </p>
                  <Button variant="default" className="w-full btn-glow">
                    Launch AR Scanner
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">How it works:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Open AR scanner with your camera
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Point at billboard to scan
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      See authorization status instantly
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Report violations with one tap
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Your Recent Reports
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/my-reports">View All & Track</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.slice(0, 3).map((report) => (
                  <Link key={report.id} to="/my-reports" className="block">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div>
                        <div className="font-medium text-foreground">{report.location}</div>
                        <div className="text-sm text-muted-foreground">{report.type}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={report.status === "Resolved" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                        <div className="text-sm text-warning font-medium">+{report.points} pts</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;