import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../utils/api';
import type { Tournament, TournamentSortKey, SortConfig } from '../lib/types';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import TournamentList from '../components/TournamentList';
import { Toaster } from '../components/ui/sonner';
import CreateTournamentModal from '../components/CreateTournamentModal';
import type { Tournament as ApiTournament } from '../types';

const mapApiToUi = (t: ApiTournament): Tournament => {
  const statusMap: Record<ApiTournament['status'], Tournament['dynamicStatus']> = {
    scheduled: 'upcoming',
    registering: 'registering',
    running: 'active',
    completed: 'completed',
    cancelled: 'cancelled',
  };
  return {
    id: Number(t.id),
    name: t.name,
    gameType: 'Texas Hold\'em',
    startTime: new Date(t.startsAt).toISOString(),
    buyIn: t.entryFee,
    prizePool: '0.00',
    players: t.players || [],
    maxPlayers: t.maxPlayers || 0,
    status: statusMap[t.status],
    durationHours: 8,
    dynamicStatus: statusMap[t.status],
    parsedStartTime: new Date(t.startsAt),
    lateRegEndDate: new Date(new Date(t.startsAt).getTime() + (t.lateRegMin * 60000)),
  };
};

const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig<TournamentSortKey> | null>(null);

  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiTournaments = await adminAPI.getAllTournaments();
      const uiTournaments = apiTournaments.map(mapApiToUi);
      setTournaments(uiTournaments);
    } catch (error: any) {
      setError(error.message || 'Failed to load tournaments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTournamentCreated = useCallback(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    let filtered = tournaments;

    if (searchTerm) {
      filtered = filtered.filter(tournament =>
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.dynamicStatus === statusFilter);
    }

    setFilteredTournaments(filtered);
  }, [tournaments, searchTerm, statusFilter]);

  const handleSort = (key: TournamentSortKey) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary">Tournaments</h1>
        <p className="text-muted-foreground">Manage poker tournaments</p>
      </div>

      <Toaster />

      <div className="flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-sm text-muted-foreground">
          Total: {filteredTournaments.length} tournaments
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournaments Table - Using shared component */}
      <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>All Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          <TournamentList
            tournaments={filteredTournaments}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </CardContent>
      </Card>

      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTournamentCreated={handleTournamentCreated}
      />
    </div>
  );
};

export default TournamentsPage; 