import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type{ HandHistory, SortConfig, HandHistorySortKey } from "../lib/types";
import { format } from "date-fns";
import { formatCurrency } from "../lib/currencyUtils";
import { Trash2, Type } from "lucide-react";
import SortableTableHead from "./SortableTableHead";

interface HandHistoryTableProps {
  hands: HandHistory[];
  onSort: (key: HandHistorySortKey) => void;
  sortConfig: SortConfig<HandHistorySortKey> | null;
  onReview: (hand: HandHistory) => void;
  onDelete: (hand: HandHistory) => void;
}

export const HandHistoryTable = ({ hands, onSort, sortConfig, onReview, onDelete }: HandHistoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableTableHead sortKey="date" onSort={onSort} sortConfig={sortConfig}>
            Date
          </SortableTableHead>
          <SortableTableHead sortKey="gameType" onSort={onSort} sortConfig={sortConfig}>
            Game
          </SortableTableHead>
          <SortableTableHead sortKey="stakes" onSort={onSort} sortConfig={sortConfig}>
            Stakes
          </SortableTableHead>
          <TableHead>Your Hand</TableHead>
          <SortableTableHead sortKey="result" onSort={onSort} sortConfig={sortConfig} align="right">
            Result
          </SortableTableHead>
          <TableHead className="w-[120px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hands.map((hand: HandHistory) => (
          <TableRow key={hand.id}>
            <TableCell className="text-muted-foreground">{format(new Date(hand.date), "dd MMM yyyy, p")}</TableCell>
            <TableCell>
              <Badge variant="outline">{hand.gameType}</Badge>
            </TableCell>
            <TableCell>{hand.stakes}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {hand.myHand.map((card, index) => (
                  <span key={index} className="font-mono border rounded px-1.5 py-0.5 text-sm bg-secondary text-secondary-foreground select-none">
                    {card}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell className={`text-right font-semibold ${hand.result > 0 ? "text-green-500" : hand.result < 0 ? "text-red-500" : "text-muted-foreground"}`}>
              {formatCurrency(hand.result)}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => onReview(hand)}>
                  Review
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(hand)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
