import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import Countdown from "../components/Countdown";
import { getTournamentStatusVariant } from "../lib/tournamentUtils";
import { ArrowLeft, Calendar, Trophy, DollarSign, Users, Puzzle, Clock, Palette, Coins, Layers, Timer, UserMinus, Award, Clock8, List, UserCheck } from "lucide-react";
import { adminAPI } from '../utils/api';
import { toast } from "sonner";
import type { Tournament } from '../lib/types';
import TournamentStatusChange from "../components/TournamentStatusChange";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (id) {
          console.log('🔍 Frontend: Fetching tournament with ID:', id);
          const data = await adminAPI.getTournamentById(id);
          console.log('🔍 Frontend: Tournament data received:', data);
          console.log('🔍 Frontend: Players data:', data.players);
          console.log('🔍 Frontend: Players length:', data.players?.length);
          setTournament(data);
        } else {
          setError('No tournament ID provided');
        }
      } catch (err: any) {
        console.error('🔍 Frontend: Error fetching tournament:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load tournament');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handleRemove = async (registrationId: string) => {
    if (!id) return;
    if (!window.confirm('Remove this player from the tournament?')) return;
    setRemovingId(registrationId);
    try {
      await adminAPI.removeTournamentRegistration(id, registrationId);
      toast.success('Player removed from tournament');
      // Refresh tournament data to get updated player list
      const data = await adminAPI.getTournamentById(id);
      setTournament(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to remove player');
    } finally {
      setRemovingId(null);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setTournament((prev: any) => prev ? { ...prev, status: newStatus } : null);
  };

  // Debug authentication status
  const adminToken = localStorage.getItem('adminToken');
  console.log('🔍 Debug: Admin token exists:', !!adminToken);
  console.log('🔍 Debug: Tournament data:', tournament);
  console.log('🔍 Debug: Players array:', tournament?.players);
  console.log('🔍 Debug: Players type:', typeof tournament?.players);
  console.log('🔍 Debug: Is players array?', Array.isArray(tournament?.players));

  function renderPrizeStructure(prizeStructure: any) {
    if (!Array.isArray(prizeStructure) || prizeStructure.length === 0) return <span>None</span>;
    return (
      <ul className="list-disc ml-6">
        {prizeStructure.map((p: any, idx: number) => (
          <li key={idx}>Place {p.place}: {p.pct}%</li>
        ))}
      </ul>
    );
  }

  // Prepare display values
  const displayBuyIn = tournament?.entryFee
    ? (tournament.entryFee === 'free' ? 'Free' : `$${parseFloat(tournament.entryFee).toLocaleString()}`)
    : (tournament?.buyIn || '');
  const displayPrizePool = tournament?.prizePool ? `$${parseFloat(tournament.prizePool).toLocaleString()}` : '';
  const dynamicStatus = tournament?.dynamicStatus || tournament?.status || '';
  const parsedStartTime = tournament?.startsAt ? new Date(tournament.startsAt) : (tournament?.parsedStartTime ? new Date(tournament.parsedStartTime) : null);
  const lateRegEndDate = tournament?.lateRegEndDate ? new Date(tournament.lateRegEndDate) : null;

  // Ensure players is always an array
  const players = Array.isArray(tournament?.players) ? tournament.players : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading tournament...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/tournaments">Tournaments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tournament ? tournament.name : id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">{tournament?.name || 'Tournament'}</CardTitle>
              <div className="flex items-center flex-wrap gap-4 mt-2">
                <Badge variant={getTournamentStatusVariant(dynamicStatus)}>{dynamicStatus}</Badge>
                <span className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {parsedStartTime && (
                    <Countdown targetDate={parsedStartTime} status={dynamicStatus} lateRegEndDate={lateRegEndDate} />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tournament && (
                <TournamentStatusChange
                  tournamentId={tournament.id.toString()}
                  currentStatus={tournament.status}
                  onStatusChange={handleStatusChange}
                />
              )}
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tournaments
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Tournament Details</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Prize Pool</p>
                  <p className="font-bold text-lg">{displayPrizePool}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Buy-in</p>
                  <p className="font-bold text-lg">{displayBuyIn}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Players</p>
                  <p className="font-bold text-lg">{players.length} / {tournament?.maxPlayers}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Puzzle className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Game</p>
                  <p className="font-bold text-lg">{tournament?.gameType}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-bold text-lg">{tournament?.durationHours} hours</p>
                </div>
              </div>
              <div className="flex items-center">
                <Palette className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Theme</p>
                  <p className="font-bold text-lg">{tournament?.theme || '—'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Coins className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-bold text-lg">{tournament?.currency}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Starting Stack</p>
                  <p className="font-bold text-lg">{tournament?.startingStack}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Timer className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Blind Speed</p>
                  <p className="font-bold text-lg">{tournament?.blindspeed} sec</p>
                </div>
              </div>
              <div className="flex items-center">
                <UserMinus className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Min Players</p>
                  <p className="font-bold text-lg">{tournament?.minPlayers}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Prize Places</p>
                  <p className="font-bold text-lg">{tournament?.prizePlaces}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock8 className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Late Reg (min)</p>
                  <p className="font-bold text-lg">{tournament?.lateRegMin}</p>
                </div>
              </div>
              <div className="flex items-center">
                <List className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Prize Structure</p>
                  <div className="font-bold text-lg">{renderPrizeStructure(tournament?.prizeStructure)}</div>
                </div>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Created By (admin id)</p>
                  <p className="font-bold text-lg">{tournament?.createdBy}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-3 text-primary" />
              Registered Players ({players.length})
            </h3>
            <Card className="rounded-lg border bg-background max-h-96 overflow-y-auto">
              <CardContent className="p-0">
                {players.length === 0 ? (
                  <div className="p-4 text-muted-foreground">No players registered for this tournament.</div>
                ) : (
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-2 py-1 border">Username</th>
                        <th className="px-2 py-1 border">Avatar</th>
                        <th className="px-2 py-1 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player: any, index: number) => (
                        <tr key={player.id || index}>
                          <td className="px-2 py-1 border">{player.username || 'Unknown'}</td>
                          <td className="px-2 py-1 border">
                            <img 
                              src={player.avatar || '/placeholder.svg'} 
                              alt={player.username || 'Player'} 
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </td>
                          <td className="px-2 py-1 border">
                            {player.id && (
                              <Link
                                to={`/admin/users/${player.id}`}
                                className="text-blue-600 underline"
                              >
                                View Profile
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TournamentDetailPage; 