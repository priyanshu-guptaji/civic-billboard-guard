import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  Download, 
  Sparkles, 
  Info,
  Scale,
  Wrench,
  AlertTriangle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface Preset {
  id: string;
  name: string;
  location: string;
  structureDamage: number; // 0 - 100
  tiltAngle: number;       // 0 - 45
  rustCoverage: number;     // 0 - 100
  brokenLighting: number;   // 0 - 10
  expiredPermit: boolean;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: "preset-1",
    name: "Weathered Unipole",
    location: "MG Road Overpass",
    structureDamage: 65,
    tiltAngle: 14,
    rustCoverage: 78,
    brokenLighting: 0,
    expiredPermit: true,
    description: "Old steel unipole structural hazard. Heavy structural fatigue, severe corrosion, and significant tilt detected near heavily populated walkway."
  },
  {
    id: "preset-2",
    name: "Commercial Neon Display",
    location: "Brigade Road Crossing",
    structureDamage: 15,
    tiltAngle: 1,
    rustCoverage: 10,
    brokenLighting: 7,
    expiredPermit: false,
    description: "Active advertising billboard. Multiple flickering and broken neon lighting modules creating electrical hazards during night operation."
  },
  {
    id: "preset-3",
    name: "Standard Retail Board",
    location: "Koramangala 80ft Road",
    structureDamage: 5,
    tiltAngle: 0,
    rustCoverage: 4,
    brokenLighting: 0,
    expiredPermit: false,
    description: "Newly installed standard frame. No signs of structural stress, corrosion, or tilt. Full operational permit active."
  }
];

export default function RiskScoring() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States for Risk Factors
  const [structureDamage, setStructureDamage] = useState<number>(35);
  const [tiltAngle, setTiltAngle] = useState<number>(5);
  const [rustCoverage, setRustCoverage] = useState<number>(20);
  const [brokenLighting, setBrokenLighting] = useState<number>(2);
  const [expiredPermit, setExpiredPermit] = useState<boolean>(false);

  const [activePreset, setActivePreset] = useState<string>("custom");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);

  // Load Preset
  const applyPreset = (preset: Preset) => {
    setIsScanning(true);
    setScanProgress(0);
    setActivePreset(preset.id);
    
    // Simulate AI scanning speed
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setStructureDamage(preset.structureDamage);
        setTiltAngle(preset.tiltAngle);
        setRustCoverage(preset.rustCoverage);
        setBrokenLighting(preset.brokenLighting);
        setExpiredPermit(preset.expiredPermit);
        toast({
          title: "AI Analysis Complete",
          description: `Loaded report presets for ${preset.name} successfully.`,
        });
      }
    }, 80);
  };

  // Calculate Risk Score
  const calculateScore = (): number => {
    // Weights
    const wDamage = structureDamage * 0.35;
    const wTilt = (tiltAngle / 45) * 100 * 0.25;
    const wRust = rustCoverage * 0.15;
    const wLighting = (brokenLighting / 10) * 100 * 0.15;
    const wPermit = expiredPermit ? 10 : 0;
    
    return Math.min(100, Math.round(wDamage + wTilt + wRust + wLighting + wPermit));
  };

  const riskScore = calculateScore();

  // Get Risk Level & Colors
  const getRiskClassification = (score: number) => {
    if (score > 70) {
      return {
        label: "Dangerous",
        color: "text-red-500 bg-red-500/10 border-red-500/30",
        badgeColor: "bg-red-500 text-white hover:bg-red-600",
        fillColor: "#ef4444",
        action: "Urgent enforcement dispatch & immediate removal ticket.",
        icon: <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse" />
      };
    } else if (score >= 35) {
      return {
        label: "Medium Risk",
        color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
        badgeColor: "bg-yellow-500 text-black hover:bg-yellow-600",
        fillColor: "#eab308",
        action: "Issue structural compliance notice. Schedule inspection within 7 days.",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />
      };
    } else {
      return {
        label: "Safe",
        color: "text-green-500 bg-green-500/10 border-green-500/30",
        badgeColor: "bg-green-500 text-white hover:bg-green-600",
        fillColor: "#22c55e",
        action: "No immediate threat. Scheduled for routine annual check.",
        icon: <ShieldCheck className="h-6 w-6 text-green-500" />
      };
    }
  };

  const riskClass = getRiskClassification(riskScore);

  // Generate compliance chart data
  const chartData = [
    { name: "Structure Damage", value: Math.round(structureDamage * 0.35), full: 35, color: "#f97316" },
    { name: "Tilt Stress", value: Math.round((tiltAngle / 45) * 25), full: 25, color: "#8b5cf6" },
    { name: "Rust / Corrosion", value: Math.round(rustCoverage * 0.15), full: 15, color: "#ef4444" },
    { name: "Broken Lighting", value: Math.round(brokenLighting * 1.5), full: 15, color: "#3b82f6" },
    { name: "Expired Permit", value: expiredPermit ? 10 : 0, full: 10, color: "#ec4899" }
  ];

  // Draw simulated billboard on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 10;

    // Apply tilt
    ctx.save();
    ctx.translate(centerX, centerY);
    const rad = (tiltAngle * Math.PI) / 180;
    ctx.rotate(rad);

    // Draw Support Pole
    ctx.fillStyle = "#475569";
    ctx.fillRect(-15, 0, 30, 100);

    // Draw Pole Rust/Cracks
    if (rustCoverage > 20) {
      ctx.fillStyle = "#854d0e";
      for (let i = 0; i < rustCoverage / 10; i++) {
        ctx.fillRect(-12 + Math.random() * 14, 5 + i * 15, 6, 8);
      }
    }

    // Draw Billboard Board Frame
    ctx.lineWidth = 6;
    ctx.strokeStyle = structureDamage > 40 ? "#f97316" : "#3b4f68";
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-120, -120, 240, 120);
    ctx.strokeRect(-120, -120, 240, 120);

    // Draw Structural Cracks on Board
    if (structureDamage > 10) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Crack 1
      ctx.moveTo(-100, -100);
      ctx.lineTo(-80, -90);
      if (structureDamage > 40) {
        ctx.lineTo(-70, -105);
        ctx.lineTo(-50, -95);
      }
      // Crack 2
      if (structureDamage > 30) {
        ctx.moveTo(80, -50);
        ctx.lineTo(60, -70);
        ctx.lineTo(50, -65);
      }
      ctx.stroke();
    }

    // Draw Rust Marks
    if (rustCoverage > 5) {
      ctx.fillStyle = "#b45309";
      for (let i = 0; i < rustCoverage / 6; i++) {
        const rx = -110 + (i * 37) % 210;
        const ry = -115 + (i * 19) % 110;
        ctx.beginPath();
        ctx.arc(rx, ry, 3 + (i % 5), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Content representation
    ctx.fillStyle = "#334155";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MUNICIPAL AD BOARD", 0, -60);

    // Draw lighting bulbs at the top
    const totalBulbs = 6;
    const startX = -100;
    const step = 40;

    for (let i = 0; i < totalBulbs; i++) {
      const bx = startX + i * step;
      const by = -135;

      // Bulb frame
      ctx.fillStyle = "#64748b";
      ctx.fillRect(bx - 3, by, 6, 8);

      // Bulb glass (yellow if working, gray if broken)
      const isBroken = i < Math.floor(brokenLighting * 0.6);
      ctx.beginPath();
      ctx.arc(bx, by - 4, 6, 0, Math.PI * 2);
      ctx.fillStyle = isBroken ? "#475569" : "#fef08a";
      ctx.fill();

      // Light glow if working
      if (!isBroken) {
        ctx.beginPath();
        ctx.arc(bx, by - 4, 12, 0, Math.PI * 2);
        const bulbGlow = ctx.createRadialGradient(bx, by - 4, 2, bx, by - 4, 12);
        bulbGlow.addColorStop(0, "rgba(253, 224, 71, 0.4)");
        bulbGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
        ctx.fillStyle = bulbGlow;
        ctx.fill();
      }
    }

    ctx.restore();

    // AI overlay scanning line and diagnostics (Draw outside saved rotate matrix)
    if (isScanning) {
      const scanY = (scanProgress / 100) * canvas.height;
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Scanning glow
      ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
      ctx.fillRect(0, 0, canvas.width, scanY);
    } else {
      // Diagnostic Bounding Boxes & Info Overlay
      ctx.strokeStyle = riskClass.fillColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // AI Bounding Box Label
      ctx.fillStyle = riskClass.fillColor;
      ctx.fillRect(10, 10, 140, 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px monospace";
      ctx.fillText(`DETECTION: ${riskClass.label}`, 80, 24);

      // Diagnostic text in corner
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`TILT ANGLE: ${tiltAngle}°`, 20, canvas.height - 70);
      ctx.fillText(`RUST COVER: ${rustCoverage}%`, 20, canvas.height - 50);
      ctx.fillText(`STRUCT FATIGUE: ${structureDamage}%`, 20, canvas.height - 30);
      
      ctx.textAlign = "right";
      ctx.fillText(`FLICKER RATE: ${brokenLighting * 10}%`, canvas.width - 20, canvas.height - 70);
      ctx.fillText(`PERMIT TICKET: ${expiredPermit ? "EXPIRED" : "ACTIVE"}`, canvas.width - 20, canvas.height - 50);
      ctx.fillText(`AI CONFIDENCE: 98.4%`, canvas.width - 20, canvas.height - 30);
    }

  }, [structureDamage, tiltAngle, rustCoverage, brokenLighting, expiredPermit, isScanning, scanProgress, riskClass]);

  // Export Citation Safety Ticket
  const exportTicket = () => {
    const ticketId = `AI-CITE-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleString();
    const content = `========================================================
CIVICGUARD AI BILLBOARD COMPLIANCE & SAFETY TICKET
========================================================
Ticket Reference : ${ticketId}
Generated Date   : ${dateStr}
AI Safety Status : ${riskClass.label.toUpperCase()}
Total Risk Score : ${riskScore} / 100
--------------------------------------------------------
RISK CRITERIA ANALYSIS BREAKDOWN:
--------------------------------------------------------
1. Structural Frame Fatigue : ${structureDamage}%
2. Deflection / Tilt Stress : ${tiltAngle} degrees
3. Surface Rust & Corrosion : ${rustCoverage}%
4. Electrical & Bulb Failure: ${brokenLighting} / 10 broken
5. Active Legal Permit      : ${expiredPermit ? "EXPIRED / MISSING" : "VERIFIED & VALID"}
--------------------------------------------------------
ENFORCEMENT COMMAND ACTIONS REQUIRED:
--------------------------------------------------------
Classification Level: ${riskClass.label}
Enforcement Order   : ${riskClass.action}
Enforcement Team    : ${riskScore > 70 ? "Civil Structural Response Force" : "Municipal Maintenance Crew"}
--------------------------------------------------------
Verified by CivicGuard Automated Inspection Engine v1.0
========================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `billboard-safety-ticket-${ticketId}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Citation Exported",
      description: "Billboard safety inspection ticket downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container-responsive py-responsive">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary animate-pulse" />
                AI Risk Scoring & Classification
              </h1>
              <p className="text-muted-foreground text-responsive-lg leading-relaxed max-w-2xl">
                Assess billboard structures instantly. Run AI evaluations, calibrate danger factors, and prioritize regulatory enforcement.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button size="sm" onClick={exportTicket} disabled={isScanning}>
                <Download className="h-4 w-4 mr-2" />
                Export Safety Ticket
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-responsive">
            
            {/* Visualizer & Gauge Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Canvas Visualizer */}
              <Card className="card-glass border-slate-700/40 overflow-hidden relative">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-sky-400" />
                        AI Vision Scanner Simulator
                      </CardTitle>
                      <CardDescription>Visualizing structural stress, tilt deflection, and rust regions</CardDescription>
                    </div>
                    {isScanning && (
                      <Badge variant="secondary" className="bg-sky-500/10 text-sky-400 animate-pulse">
                        Scanning Image...
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex justify-center bg-slate-950">
                  <canvas 
                    ref={canvasRef} 
                    width={520} 
                    height={320} 
                    className="w-full h-auto aspect-video max-w-full block"
                  />
                </CardContent>
              </Card>

              {/* Presets Selection */}
              <Card className="card-glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-semibold">Standard Billboard Presets</CardTitle>
                  <CardDescription>Select a sample case file to load historical AI diagnostics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p)}
                        disabled={isScanning}
                        className={`text-left p-3 border rounded-lg hover:border-primary/50 transition-all ${
                          activePreset === p.id 
                            ? "bg-primary/5 border-primary shadow-sm" 
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="font-semibold text-xs text-foreground flex items-center justify-between mb-1">
                          <span>{p.name}</span>
                          <Badge 
                            variant="outline" 
                            className="text-[9px] px-1.5 py-0"
                          >
                            {p.id === "preset-1" ? "🔴 Dangerous" : p.id === "preset-2" ? "🟡 Medium" : "🟢 Safe"}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configurator & Score Analytics Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Score Display Card */}
              <Card className="card-glass border-slate-700/40">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    
                    {/* Semi-circular Gauge */}
                    <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
                      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-180" viewBox="0 0 100 50">
                        {/* Background track */}
                        <path 
                          d="M 10 50 A 40 40 0 0 1 90 50" 
                          fill="none" 
                          stroke="rgba(255, 255, 255, 0.08)" 
                          strokeWidth="8"
                          strokeLinecap="round" 
                        />
                        {/* Colored progress bar */}
                        <path 
                          d="M 10 50 A 40 40 0 0 1 90 50" 
                          fill="none" 
                          stroke={riskClass.fillColor} 
                          strokeWidth="8" 
                          strokeLinecap="round"
                          strokeDasharray="126" 
                          strokeDashoffset={126 - (126 * riskScore) / 100}
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      
                      {/* Gauge labels */}
                      <div className="absolute bottom-1 flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-foreground">{riskScore}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Risk Index</span>
                      </div>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        {riskClass.icon}
                        <Badge className={`${riskClass.badgeColor} px-3 py-1 font-bold text-xs uppercase`}>
                          {riskClass.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground max-w-sm px-4">
                        <strong>Action Order: </strong>{riskClass.action}
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Calibration Form */}
              <Card className="card-glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Fine-Tune Calibration Suite
                  </CardTitle>
                  <CardDescription>Manually override parameters to test compliance calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  
                  {/* Slider: Structural Damage */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-foreground flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-orange-500" />
                        Structure Fatigue / Cracks
                      </label>
                      <span className="font-medium text-orange-500">{structureDamage}%</span>
                    </div>
                    <Slider
                      value={[structureDamage]}
                      max={100}
                      step={1}
                      onValueChange={(val) => {
                        setStructureDamage(val[0]);
                        setActivePreset("custom");
                      }}
                      disabled={isScanning}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider: Billboard Tilt */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-foreground flex items-center gap-1.5">
                        <Scale className="h-3.5 w-3.5 text-violet-500" />
                        Billboard Tilt Deflection
                      </label>
                      <span className="font-medium text-violet-500">{tiltAngle}°</span>
                    </div>
                    <Slider
                      value={[tiltAngle]}
                      max={45}
                      step={1}
                      onValueChange={(val) => {
                        setTiltAngle(val[0]);
                        setActivePreset("custom");
                      }}
                      disabled={isScanning}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider: Rust Coverage */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-foreground flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                        Rust Coverage & Oxidation
                      </label>
                      <span className="font-medium text-red-500">{rustCoverage}%</span>
                    </div>
                    <Slider
                      value={[rustCoverage]}
                      max={100}
                      step={1}
                      onValueChange={(val) => {
                        setRustCoverage(val[0]);
                        setActivePreset("custom");
                      }}
                      disabled={isScanning}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Slider: Broken Lighting */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-foreground flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5 text-blue-500" />
                        Broken Lighting Nodes
                      </label>
                      <span className="font-medium text-blue-500">{brokenLighting} / 10 flickering</span>
                    </div>
                    <Slider
                      value={[brokenLighting]}
                      max={10}
                      step={1}
                      onValueChange={(val) => {
                        setBrokenLighting(val[0]);
                        setActivePreset("custom");
                      }}
                      disabled={isScanning}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Toggle: Expired Permit */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-foreground">Expired Municipal Permit</label>
                      <p className="text-[10px] text-muted-foreground">Adds safety penalty if illegal or expired</p>
                    </div>
                    <Switch
                      checked={expiredPermit}
                      onCheckedChange={(checked) => {
                        setExpiredPermit(checked);
                        setActivePreset("custom");
                      }}
                      disabled={isScanning}
                    />
                  </div>

                </CardContent>
              </Card>

              {/* Recharts Analytics Breakdown */}
              <Card className="card-glass border-slate-700/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Weighted Risk Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 35]} hide />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: "#1e293b", borderColor: "#475569", borderRadius: "6px", fontSize: "10px" }}
                        formatter={(value) => [`${value} pts`, "Weight"]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10}>
                        {chartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
