export type BaseTournament = {
  id: number;
  name: string;
  gameType: string;
  buyIn: string;
  prizePool: string;
  startTime: string;
  status: string;
  durationHours: number;
  players: string[];
  maxPlayers: number;
};

export type Tournament = BaseTournament & {
  parsedStartTime: Date | null;
  dynamicStatus: string;
  lateRegEndDate: Date | null;
};

export type User = {
  id: string;
  username: string;
  firstName: string;
  country: string;
  email: string;
  role: 'player' | 'admin' | 'staff';
  walletBalance: number;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'tournament_buyin' | 'tournament_prize';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
};

export type HandHistory = {
  id: string;
  date: string;
  gameType: string;
  stakes: string;
  result: number;
  myHand: string[];
  winningHand?: string[];
  potSize: number;
};

export type HandHistorySortKey = "date" | "gameType" | "stakes" | "result";

export type CashGame = {
  id: number;
  name: string;
  stakes: string;
  players: string;
  type: string;
  gameType: string;
};

export type SortDirection = "asc" | "desc";

export type TournamentSortKey = 'name' | 'gameType' | 'buyIn' | 'prizePool' | 'startTime' | 'status' | 'players';

export type CashGameSortKey = keyof CashGame;

export interface SortConfig<T> {
  key: T;
  direction: SortDirection;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalTournaments: number;
    totalTransactions: number;
    totalRevenue: number;
    activeUsers: number;
    pendingTransactions: number;
  };
  recentTournaments: Tournament[];
  recentTransactions: Transaction[];
  monthlyRevenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  total: number;
}
