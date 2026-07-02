import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, BarChart3, Users, CheckCircle, AlertTriangle, Brain, Eye, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-billboard.jpg";

const Index = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI Detection",
      description: "Advanced machine learning models detect size violations, structural damage, and inappropriate content automatically."
    },
    {
      icon: <Eye className="h-8 w-8 text-accent" />,
      title: "AR Verification",
      description: "Real-time augmented reality overlay shows authorization status when scanning billboards with your phone."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-success" />,
      title: "Citizen Reporting",
      description: "Easy mobile reporting with automatic geolocation, timestamping, and gamification to encourage participation."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-warning" />,
      title: "Authority Dashboard",
      description: "Comprehensive analytics, violation heatmaps, and real-time monitoring tools for municipal authorities."
    }
  ];

  const benefits = [
    { icon: <CheckCircle className="h-6 w-6 text-success" />, text: "Reduce unauthorized billboards by 70%" },
    { icon: <CheckCircle className="h-6 w-6 text-success" />, text: "Improve road safety and compliance" },
    { icon: <CheckCircle className="h-6 w-6 text-success" />, text: "Enable data-driven enforcement" },
    { icon: <CheckCircle className="h-6 w-6 text-success" />, text: "Engage citizens in civic participation" },
  ];

  const stats = [
    { number: "94.7%", label: "AI Accuracy", sublabel: "in violation detection" },
    { number: "2.3s", label: "Processing", sublabel: "average response time" },
    { number: "3,456", label: "Citizens", sublabel: "actively reporting" },
    { number: "89%", label: "Resolution", sublabel: "rate for violations" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Smart city billboard compliance monitoring with AR and AI technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70"></div>
        </div>
        <div className="relative container-responsive">
          <div className="max-w-5xl mx-auto text-center text-white animate-fade-in-up">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Shield className="h-4 w-4 mr-2" />
              AI-Powered Civic Enforcement
            </Badge>
            <h1 className="text-responsive-3xl font-bold mb-6 leading-tight">
              Billboard Compliance
              <span className="block text-gradient bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                & Enforcement Solution
              </span>
            </h1>
            <p className="text-responsive-lg mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Transform urban compliance with AI detection, AR verification, and citizen-powered reporting 
              for safer, compliant cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 btn-glow hover:scale-105 transition-all duration-300">
                <Link to="/report">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Reporting
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link to="/dashboard">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-responsive bg-gradient-secondary">
        <div className="container-responsive">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-responsive">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in card-glass p-6 rounded-xl">
                <div className="text-responsive-3xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="font-medium text-foreground text-responsive-base">{stat.label}</div>
                <div className="text-responsive-sm text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-responsive">
        <div className="container-responsive">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-responsive-3xl font-bold text-foreground mb-4">
              Advanced Technology Stack
            </h2>
            <p className="text-responsive-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Combining cutting-edge AI, AR, and civic technology to revolutionize billboard compliance monitoring
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="card-glass border-border hover:shadow-glow transition-all duration-300 animate-scale-in">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-gradient-secondary rounded-xl shadow-card">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-responsive-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-responsive-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 text-destructive mr-3" />
                The Problem
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>Unauthorized billboards pose significant risks to Indian cities:</p>
                <ul className="space-y-2 pl-4">
                  <li>• <strong>Road Safety Risks:</strong> Blocking traffic signals and dangerous placements</li>
                  <li>• <strong>Structural Hazards:</strong> Old and damaged hoardings threatening public safety</li>
                  <li>• <strong>Legal Violations:</strong> Frequent violations of municipal regulations</li>
                  <li>• <strong>Weak Enforcement:</strong> Limited manpower and slow manual checking processes</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-success mr-3" />
                Our Solution
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {benefit.icon}
                    <span className="text-muted-foreground">{benefit.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/report">
                    Get Started Today
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple three-step process for citizens and authorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Capture & Report</h3>
              <p className="text-muted-foreground">
                Citizens photograph billboard violations using the mobile app with automatic geolocation and timestamping.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">AI Analysis</h3>
              <p className="text-muted-foreground">
                Advanced AI models analyze photos for size violations, structural damage, and content appropriateness in real-time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Authority Action</h3>
              <p className="text-muted-foreground">
                Municipal authorities receive detailed reports with violation analysis and take appropriate enforcement action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your City?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of citizens and municipal authorities already using CivicGuard 
            to create safer, more compliant urban environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/report">
                <Users className="h-5 w-5 mr-2" />
                Join as Citizen Reporter
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/dashboard">
                <Shield className="h-5 w-5 mr-2" />
                Authority Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CivicGuard</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by AI • Built for safer cities • © 2025 CivicGuard
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;