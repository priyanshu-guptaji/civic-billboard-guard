import { useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Trophy, Star } from "lucide-react";
import { getCurrentBadge } from "@/lib/gamification";
import { useGamification } from "@/contexts/GamificationContext";

const Leaderboard = () => {
  const { users, currentUser, toggleStar } = useGamification();
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const handleToggleStar = useCallback((userId: string) => {
    toggleStar(userId);
  }, [toggleStar]);

  const getRankIcon = (index: number) => {
    return <span className="font-bold text-foreground w-6 text-center">{index + 1}</span>;
  };

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle className="flex items-center text-responsive-xl">
          <Trophy className="mr-2 h-5 w-5 text-primary" />
          Top Contributors
        </CardTitle>
        <CardDescription>
          Citizens with the most points earned from reporting verified violations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Rank</TableHead>
                <TableHead>Citizen</TableHead>
                <TableHead>Rank Badge</TableHead>
                <TableHead className="text-center">No. of Reports</TableHead>
                <TableHead className="text-center">Stars</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => {
                const badge = getCurrentBadge(user.points);
                const isTopThree = index < 3;
                const isCurrentUser = user.id === currentUser.id;
                const hasStarred = user.starredBy.includes(currentUser.id);
                
                return (
                  <TableRow key={user.id} className={isTopThree ? "bg-muted/30" : ""}>
                    <TableCell className="text-center font-medium">
                      <div className="flex justify-center items-center">
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`font-medium ${isTopThree ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {user.name}
                          {isCurrentUser && <Badge className="ml-2 text-xs">You</Badge>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit">
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {user.reportsCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium text-sm">{user.starredBy.length}</span>
                        <span
                          role="button"
                          tabIndex={isCurrentUser ? -1 : 0}
                          onClick={() => !isCurrentUser && handleToggleStar(user.id)}
                          onKeyDown={(e) => { if (!isCurrentUser && (e.key === 'Enter' || e.key === ' ')) handleToggleStar(user.id); }}
                          title={isCurrentUser ? "You cannot star yourself" : hasStarred ? "Unstar this contributor" : "Star this contributor"}
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors ${
                            isCurrentUser
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:bg-accent"
                          }`}
                        >
                          <Star
                            className="h-5 w-5 transition-colors"
                            fill={hasStarred ? "#eab308" : "none"}
                            stroke={hasStarred ? "#eab308" : "currentColor"}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {user.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
