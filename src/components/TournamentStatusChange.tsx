import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { getTournamentStatusVariant } from '../lib/tournamentUtils';
import { adminAPI } from '../utils/api';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

interface TournamentStatusChangeProps {
  tournamentId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled', description: 'Tournament is scheduled but not yet open for registration' },
  { value: 'registering', label: 'Registering', description: 'Tournament is open for player registration' },
  { value: 'running', label: 'Running', description: 'Tournament is currently in progress' },
  { value: 'completed', label: 'Completed', description: 'Tournament has finished' },
  { value: 'cancelled', label: 'Cancelled', description: 'Tournament has been cancelled' },
];

const TournamentStatusChange: React.FC<TournamentStatusChangeProps> = ({
  tournamentId,
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    console.log('🔄 Attempting to update tournament status:', {
      tournamentId,
      currentStatus,
      newStatus: selectedStatus
    });

    setIsLoading(true);
    try {
      console.log('📡 Making API call to update tournament status...');
      const response = await adminAPI.updateTournamentStatus(tournamentId, selectedStatus);
      console.log('✅ API call successful:', response);
      
      onStatusChange(selectedStatus);
      toast.success(`Tournament status updated to ${selectedStatus}`);
      setIsOpen(false);
    } catch (error: any) {
      console.error('❌ API call failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update tournament status';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <Badge variant={getTournamentStatusVariant(currentStatus)}>
            {currentStatusOption?.label || currentStatus}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Tournament Status</DialogTitle>
          <DialogDescription>
            Select a new status for this tournament. This will affect how players can interact with it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Tournament Status
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedStatus !== currentStatus && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Current:</strong> {currentStatusOption?.label}
              </p>
              <p className="text-sm">
                <strong>New:</strong> {statusOptions.find(opt => opt.value === selectedStatus)?.label}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusChange} 
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentStatusChange; 