import { TableRow, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import Countdown from "./Countdown";
import type { Tournament } from "../lib/types";
import { Link } from "react-router-dom";
import { getTournamentStatusVariant } from "../lib/tournamentUtils";
import { formatCurrency, parseCurrency } from "../lib/currencyUtils";

interface TournamentRowProps {
  tournament: Tournament;
}

const TournamentRow = ({ tournament }: TournamentRowProps) => {
  const { dynamicStatus, parsedStartTime, lateRegEndDate } = tournament;

  const displayBuyIn = tournament.buyIn.toLowerCase() === 'free' ? 'Free' : formatCurrency(parseCurrency(tournament.buyIn));
  const displayPrizePool = formatCurrency(parseCurrency(tournament.prizePool));

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link to={`/admin/tournaments/${tournament.id}`} className="hover:underline">
          {tournament.name}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{tournament.gameType}</Badge>
      </TableCell>
      <TableCell>{displayBuyIn}</TableCell>
      <TableCell>{displayPrizePool}</TableCell>
      <TableCell>
        {parsedStartTime ? (
          <Countdown 
            targetDate={parsedStartTime} 
            status={dynamicStatus} 
            lateRegEndDate={lateRegEndDate}
          />
        ) : (
          <span className="text-muted-foreground">TBD</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={getTournamentStatusVariant(dynamicStatus)}>{dynamicStatus}</Badge>
      </TableCell>
      <TableCell>{`${tournament.players.length} / ${tournament.maxPlayers}`}</TableCell>
      <TableCell className="text-right">
        <Button asChild>
          <Link to={`/admin/tournaments/${tournament.id}`}>View Details</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TournamentRow;
