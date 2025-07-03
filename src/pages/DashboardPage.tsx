import React from 'react';
import { Users, Trophy, DollarSign, Activity, TrendingUp, TrendingDown, Users2, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { DashboardStats, Tournament, Transaction, MonthlyRevenue } from '../lib/types';

const mockDashboardData: DashboardStats = {
  stats: {
    totalUsers: 1250,
    activeUsers: 89,
    totalTournaments: 45,
    totalRevenue: 125000,
    pendingTransactions: 23,
    totalTransactions: 892,
  },
  recentTournaments: [
    { id: 1, name: 'Summer Series #1', buyIn: '100', prizePool: '10000', gameType: 'NLH', status: 'completed', players: [], maxPlayers: 100, startTime: new Date().toISOString(), durationHours: 5, parsedStartTime: new Date(), dynamicStatus: 'completed', lateRegEndDate: new Date() },
    { id: 2, name: 'Weekly Deepstack', buyIn: '50', prizePool: '5000', gameType: 'NLH', status: 'active', players: [], maxPlayers: 100, startTime: new Date().toISOString(), durationHours: 5, parsedStartTime: new Date(), dynamicStatus: 'active', lateRegEndDate: new Date() },
    { id: 3, name: 'Morning Turbo', buyIn: '20', prizePool: '1000', gameType: 'PLO', status: 'upcoming', players: [], maxPlayers: 100, startTime: new Date().toISOString(), durationHours: 5, parsedStartTime: new Date(), dynamicStatus: 'upcoming', lateRegEndDate: new Date() },
  ],
  recentTransactions: [
    { id: '1', userId: 'user1', type: 'deposit', amount: 500, status: 'completed', description: 'User deposit', createdAt: new Date().toISOString() },
    { id: '2', userId: 'user2', type: 'withdrawal', amount: 200, status: 'completed', description: 'User withdrawal', createdAt: new Date().toISOString() },
    { id: '3', userId: 'user3', type: 'tournament_buyin', amount: 100, status: 'completed', description: 'Tournament Entry', createdAt: new Date().toISOString() },
  ],
  monthlyRevenue: [
    { month: '2023-01-01T00:00:00Z', total: 15000 },
    { month: '2023-02-01T00:00:00Z', total: 22000 },
    { month: '2023-03-01T00:00:00Z', total: 18000 },
    { month: '2023-04-01T00:00:00Z', total: 25000 },
    { month: '2023-05-01T00:00:00Z', total: 31000 },
    { month: '2023-06-01T00:00:00Z', total: 28000 },
  ],
};
// let remove=localStorage.removeItem('adminToken');
const DashboardPage: React.FC = () => {
  const { stats, recentTournaments, recentTransactions, monthlyRevenue } = mockDashboardData;
  const { totalUsers, activeUsers, totalTournaments, totalRevenue, pendingTransactions, totalTransactions } = stats;

  const formattedRevenueData = monthlyRevenue.map((item: MonthlyRevenue) => ({
    name: new Date(item.month).toLocaleString('default', { month: 'short' }),
    revenue: item.total,
  }));

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your platform's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+20.1%", changeType: "increase" },
          { title: "Total Users", value: totalUsers.toLocaleString(), icon: Users, change: `+${activeUsers} active`, changeType: "increase" },
          { title: "Total Tournaments", value: totalTournaments.toLocaleString(), icon: Trophy, change: "+12 this month", changeType: "increase" },
          { title: "Total Transactions", value: totalTransactions.toLocaleString(), icon: Activity, change: `${pendingTransactions} pending`, changeType: "neutral" },
          { title: "Active Users", value: activeUsers.toLocaleString(), icon: Users2, change: "currently online", changeType: "neutral" },
          { title: "Pending Transactions", value: pendingTransactions.toLocaleString(), icon: TrendingDown, change: "awaiting approval", changeType: "decrease" },
        ].map((item, index) => (
          <Card key={item.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className={`text-xs ${item.changeType === 'increase' ? 'text-green-500' : item.changeType === 'decrease' ? 'text-red-500' : 'text-muted-foreground'}`}>
                {item.changeType === 'increase' ? <TrendingUp className="inline mr-1 h-3 w-3" /> : item.changeType === 'decrease' ? <TrendingDown className="inline mr-1 h-3 w-3" /> : null}
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="col-span-1 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formattedRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle>Recent Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTournaments.slice(0, 3).map((t: Tournament) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">${t.buyIn} Buy-in</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${t.prizePool}</p>
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.slice(0, 3).map((tx: Transaction) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {tx.type === 'deposit' ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold text-sm ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                      ${tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 