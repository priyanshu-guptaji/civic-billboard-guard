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
import { Trophy, Medal, Award } from "lucide-react";
import { getCurrentBadge } from "@/lib/gamification";
import { useGamification } from "@/contexts/GamificationContext";

const Leaderboard = () => {
  const { users } = useGamification();
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
    }
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Rank</TableHead>
              <TableHead>Citizen</TableHead>
              <TableHead>Rank Badge</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user, index) => {
              const badge = getCurrentBadge(user.points);
              const isTopThree = index < 3;
              
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
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center w-fit">
                      <span className="mr-1">{badge.icon}</span>
                      {badge.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {user.points.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
