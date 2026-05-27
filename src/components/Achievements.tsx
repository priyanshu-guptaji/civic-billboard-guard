import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Target, Trophy } from "lucide-react";
import { getCurrentBadge, getNextBadge } from "@/lib/gamification";

interface AchievementsProps {
  points: number;
}

const Achievements = ({ points }: AchievementsProps) => {
  const currentBadge = getCurrentBadge(points);
  const nextBadge = getNextBadge(points);
  
  const progressPercentage = nextBadge 
    ? Math.min(100, Math.max(0, ((points - currentBadge.minPoints) / (nextBadge.minPoints - currentBadge.minPoints)) * 100))
    : 100;

  return (
    <Card className="card-glass border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-responsive-xl text-primary">
          <Trophy className="mr-2 h-6 w-6 text-warning" />
          Your Civic Achievements
        </CardTitle>
        <CardDescription>Keep reporting violations to earn points and rank up!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-4 rounded-full text-4xl shadow-inner">
              {currentBadge.icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Current Rank</p>
              <h3 className="text-2xl font-bold text-foreground">{currentBadge.name}</h3>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-medium">Total Points</p>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-warning to-primary">
              {points.toLocaleString()}
            </h3>
          </div>
        </div>

        {nextBadge ? (
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium flex items-center">
                <Target className="mr-1 h-4 w-4" /> Next Tier: <strong className="ml-1 text-foreground">{nextBadge.name} {nextBadge.icon}</strong>
              </span>
              <span className="font-bold text-primary">{nextBadge.minPoints - points} pts to go</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        ) : (
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex items-center text-sm text-success font-bold">
              <Award className="mr-2 h-4 w-4" /> Maximum Rank Achieved!
            </div>
            <Progress value={100} className="h-3 bg-success" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Achievements;
