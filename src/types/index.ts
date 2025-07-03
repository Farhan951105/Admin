export interface User {
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
}

export interface AdminUser extends User {
  role: 'admin';
}

export interface Tournament {
  id: number;
  name: string;
  theme?: string;
  status: 'scheduled' | 'registering' | 'running' | 'completed' | 'cancelled';
  startsAt: string;
  entryFee: string;
  currency: 'USDT' | 'USDC' | 'BTC' | 'ETH';
  startingStack: number;
  blindspeed: number;
  minPlayers: number;
  maxPlayers?: number;
  prizePlaces: number;
  lateRegMin: number;
  prizeStructure: any;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  players?: any[];
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'tournament_buyin' | 'tournament_prize';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  country: string;
} 