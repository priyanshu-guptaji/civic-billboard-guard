import Navigation from "@/components/Navigation";
import Achievements from "@/components/Achievements";
import Leaderboard from "@/components/Leaderboard";
import { Users } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

const Community = () => {
  const { currentUser } = useGamification();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container-responsive py-responsive">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-responsive-3xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Users className="mr-3 h-8 w-8 text-primary" />
              Citizen Community
            </h1>
            <p className="text-muted-foreground text-responsive-lg leading-relaxed max-w-3xl mx-auto">
              Track your civic contributions, earn badges, and see how you rank among other city guardians.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Achievements (Takes up 1 column on large screens, or full width on small) */}
            <div className="lg:col-span-1 space-y-8 animate-scale-in">
              <Achievements points={currentUser.points} />
            </div>

            {/* Leaderboard (Takes up 2 columns on large screens) */}
            <div className="lg:col-span-2 animate-scale-in" style={{ animationDelay: "100ms" }}>
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
