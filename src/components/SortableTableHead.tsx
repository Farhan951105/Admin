import { TableHead } from "./ui/table";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

type SortDirection = "asc" | "desc";

interface SortConfigForProps {
  key: string;
  direction: SortDirection;
}

interface SortableTableHeadProps {
  onSort: (key: any) => void;
  sortConfig: SortConfigForProps | null;
  sortKey: string;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

const SortableTableHead = ({ onSort, sortConfig, sortKey, children, align = 'left' }: SortableTableHeadProps) => {
  const alignmentClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
  }[align];

  const getSortIcon = () => {
    if (!sortConfig || sortConfig.key !== sortKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 inline-block opacity-50" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4 inline-block" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4 inline-block" />;
  };

  return (
    <TableHead className="p-0">
      <Button variant="ghost" onClick={() => onSort(sortKey)} className={`w-full h-full px-4 py-3 ${alignmentClass}`}>
        {children}
        {getSortIcon()}
      </Button>
    </TableHead>
  );
};

export default SortableTableHead;
