import React, { useState, useMemo } from 'react';
import { HandHistoryTable } from '../components/HandHistoryTable';
import { mockHandHistory } from '../lib/mockHandHistory';
import type { HandHistory, HandHistorySortKey, SortDirection, SortConfig } from '../lib/types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const HandHistoryPage: React.FC = () => {
  const [hands, setHands] = useState<HandHistory[]>(mockHandHistory);
  const [sortConfig, setSortConfig] = useState<SortConfig<HandHistorySortKey> | null>({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  const sortedHands = useMemo(() => {
    let sortableItems = [...hands];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [hands, sortConfig]);
  
  const filteredHands = sortedHands.filter(hand => 
    hand.gameType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hand.stakes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: HandHistorySortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleReview = (hand: HandHistory) => {
    toast.info(`Reviewing hand #${hand.id}`, {
      description: `Stakes: ${hand.stakes}, Result: ${hand.result > 0 ? `+` : ''}$${hand.result}`,
    });
  };
  
  const handleDelete = (hand: HandHistory) => {
    toast.warning(`Are you sure you want to delete hand #${hand.id}?`, {
      action: {
        label: 'Confirm',
        onClick: () => {
          setHands(hands.filter(h => h.id !== hand.id));
          toast.success(`Hand #${hand.id} has been deleted.`);
        },
      },
    });
  };
  
  const handleExport = () => {
    toast.success('Exporting hand history...', {
      description: 'Your hand history data has been exported successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold text-primary">Hand History</h1>
          <p className="text-muted-foreground">Review and analyze past hands.</p>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Search by game or stakes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <HandHistoryTable 
          hands={filteredHands} 
          onSort={handleSort} 
          sortConfig={sortConfig}
          onReview={handleReview}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default HandHistoryPage; 