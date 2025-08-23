import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock, Upload, Award, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Report = () => {
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
      toast({
        title: "Report Submitted Successfully!",
        description: "Your billboard violation report has been received and is being processed by AI.",
      });
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Report Billboard Violation
            </h1>
            <p className="text-muted-foreground text-lg">
              Help keep our city safe and compliant by reporting unauthorized or problematic billboards
            </p>
          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center p-4">
                <Award className="h-8 w-8 text-warning mr-3" />
                <div>
                  <div className="text-2xl font-bold text-foreground">247</div>
                  <div className="text-sm text-muted-foreground">Your Points</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Zap className="h-8 w-8 text-success mr-3" />
                <div>
                  <div className="text-2xl font-bold text-foreground">12</div>
                  <div className="text-sm text-muted-foreground">Reports This Month</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Badge variant="secondary" className="text-sm">
                  🥈 Silver Reporter
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reporting Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  Submit Report
                </CardTitle>
                <CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-accent" />
                  Quick AR Verification
                </CardTitle>
                <CardDescription>
                  Instantly check if a billboard is authorized using your camera
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/10 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">AR Scanner</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Point your camera at any billboard to see its authorization status in real-time
                  </p>
                  <Button variant="default" className="w-full">
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
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Your Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 1, location: "MG Road, Bangalore", status: "Under Review", type: "Unauthorized", points: 25 },
                  { id: 2, location: "Brigade Road Junction", status: "Resolved", type: "Oversized", points: 30 },
                  { id: 3, location: "Commercial Street", status: "Verified", type: "Safety Hazard", points: 40 },
                ].map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
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