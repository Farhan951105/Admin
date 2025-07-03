import { Table, TableBody, TableHead, TableHeader, TableRow } from "../components/ui/table";
import SortableTableHead from "./SortableTableHead";
import TournamentRow from "./TournamentRow";
import type { Tournament, TournamentSortKey, SortConfig } from "../lib/types";

type TournamentListProps = {
  tournaments: Tournament[];
  sortConfig: SortConfig<TournamentSortKey> | null;
  onSort: (key: TournamentSortKey) => void;
};

const TournamentList = ({ tournaments, sortConfig, onSort }: TournamentListProps) => {

  if (tournaments.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No tournaments found matching your criteria.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableTableHead sortKey="name" sortConfig={sortConfig} onSort={onSort}>
            Tournament
          </SortableTableHead>
          <SortableTableHead sortKey="gameType" sortConfig={sortConfig} onSort={onSort}>
            Game
          </SortableTableHead>
          <SortableTableHead sortKey="buyIn" sortConfig={sortConfig} onSort={onSort}>
            Buy-in
          </SortableTableHead>
          <SortableTableHead sortKey="prizePool" sortConfig={sortConfig} onSort={onSort}>
            Prize Pool
          </SortableTableHead>
          <SortableTableHead sortKey="startTime" sortConfig={sortConfig} onSort={onSort}>
            Starts In
          </SortableTableHead>
          <SortableTableHead sortKey="status" sortConfig={sortConfig} onSort={onSort}>
            Status
          </SortableTableHead>
          <SortableTableHead sortKey="players" sortConfig={sortConfig} onSort={onSort}>
            Players
          </SortableTableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tournaments.map((tournament) => (
          <TournamentRow
            key={tournament.id}
            tournament={tournament}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default TournamentList;
