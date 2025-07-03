import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import type { Transaction } from '../lib/types';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Trophy,
  DollarSign,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Mock data for demonstration
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            userId: 'user1',
            type: 'deposit',
            amount: 1000,
            status: 'completed',
            description: 'Initial deposit',
            createdAt: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            userId: 'user2',
            type: 'tournament_buyin',
            amount: 100,
            status: 'completed',
            description: 'Tournament buy-in',
            createdAt: '2024-01-15T09:00:00Z',
          },
          {
            id: '3',
            userId: 'user3',
            type: 'withdrawal',
            amount: 500,
            status: 'pending',
            description: 'Withdrawal request',
            createdAt: '2024-01-15T08:00:00Z',
          },
          {
            id: '4',
            userId: 'user4',
            type: 'tournament_prize',
            amount: 2500,
            status: 'completed',
            description: 'Tournament prize',
            createdAt: '2024-01-15T07:00:00Z',
          },
          {
            id: '5',
            userId: 'user5',
            type: 'deposit',
            amount: 200,
            status: 'failed',
            description: 'Failed deposit',
            createdAt: '2024-01-15T06:00:00Z',
          },
        ];
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (error: any) {
        setError(error.message || 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'tournament_buyin':
        return <Trophy className="h-4 w-4 text-blue-600" />;
      case 'tournament_prize':
        return <DollarSign className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getCompletedAmount = () => {
    return filteredTransactions
      .filter(transaction => transaction.status === 'completed')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
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
        <h1 className="text-4xl font-bold text-primary">Transactions</h1>
        <p className="text-muted-foreground">Manage financial transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalAmount().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getCompletedAmount().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="tournament_buyin">Tournament Buy-in</SelectItem>
                  <SelectItem value="tournament_prize">Tournament Prize</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTransactionTypeIcon(transaction.type)}
                      <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{transaction.description}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{transaction.userId}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${transaction.amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage; 