import { createContext, useContext, useState } from 'react';
import type { ReactNode} from 'react'
import { mockTournaments as initialTournaments } from '../lib/mockData';
import { toast } from 'sonner';
import type{ BaseTournament } from '../lib/types';

type TournamentData = (typeof initialTournaments)[number];

interface TournamentsContextType {
  tournaments: BaseTournament[];
  registerPlayer: (tournamentId: number, playerName: string) => void;
  unregisterPlayer: (tournamentId: number, playerName: string) => void;
}

const TournamentsContext = createContext<TournamentsContextType | undefined>(undefined);

export const TournamentsProvider = ({ children }: { children: ReactNode }) => {
  const [tournaments, setTournaments] = useState<BaseTournament[]>(initialTournaments as unknown as BaseTournament[]);

  const registerPlayer = (tournamentId: number, playerName: string) => {
    let registrationSuccessful = false;
    let tournamentName = '';
    setTournaments(currentTournaments =>
      currentTournaments.map(t => {
        if (t.id === tournamentId) {
          tournamentName = t.name;
          if (t.players.includes(playerName)) {
            return t;
          }
          if (t.players.length >= t.maxPlayers) {
            toast.error(`Registration failed: ${t.name} is full.`);
            return t;
          }
          registrationSuccessful = true;
          return { ...t, players: [...t.players, playerName] };
        }
        return t;
      })
    );
    if (registrationSuccessful && tournamentName) {
         toast.success(`Successfully registered for ${tournamentName}!`);
    }
  };

  const unregisterPlayer = (tournamentId: number, playerName: string) => {
    let unregistrationSuccessful = false;
    let tournamentName = '';
    setTournaments(currentTournaments =>
      currentTournaments.map(t => {
        if (t.id === tournamentId && t.players.includes(playerName)) {
          tournamentName = t.name;
          unregistrationSuccessful = true;
          return { ...t, players: t.players.filter(p => p !== playerName) };
        }
        return t;
      })
    );
    if (unregistrationSuccessful && tournamentName) {
      toast.success(`Successfully unregistered from ${tournamentName}.`);
    }
  };

  return (
    <TournamentsContext.Provider value={{ tournaments, registerPlayer, unregisterPlayer }}>
      {children}
    </TournamentsContext.Provider>
  );
};

export const useTournamentsData = () => {
  const context = useContext(TournamentsContext);
  if (context === undefined) {
    throw new Error('useTournamentsData must be used within a TournamentsProvider');
  }
  return context;
};
