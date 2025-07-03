
export const mockTournaments = [
  { id: 1, name: 'Daily Freeroll', gameType: 'NLH', buyIn: 'Free', prizePool: '$50', startTime: 'Today, 8:00 PM EST', status: 'Registering', durationHours: 2, players: ['player1', 'player2', 'player3', 'player4', 'player5'], maxPlayers: 1000 },
  { id: 2, name: 'Wild West Bounty', gameType: 'NLH', buyIn: '$10', prizePool: '$1,000 GTD', startTime: 'Today, 9:00 PM EST', status: 'Registering', durationHours: 3, players: ['cowboy_dan', 'lucky_luke'], maxPlayers: 250 },
  { id: 3, name: 'Sunday Major', gameType: 'NLH', buyIn: '$100', prizePool: '$10,000 GTD', startTime: 'Sunday, 2:00 PM EST', status: 'Registering', durationHours: 8, players: ['pro_player_1', 'fish_on_a_heater'], maxPlayers: 500 },
  { id: 4, name: 'PLO Nightly Turbo', gameType: 'PLO', buyIn: '$5', prizePool: '$500 GTD', startTime: 'Tomorrow, 10:00 PM EST', status: 'Upcoming', durationHours: 1.5, players: [], maxPlayers: 150 },
  { id: 5, name: 'High Roller Club', gameType: 'NLH', buyIn: '$500', prizePool: '$50,000 GTD', startTime: 'Friday, 7:00 PM EST', status: 'Upcoming', durationHours: 6, players: ['whale_spotted'], maxPlayers: 100 },
  { id: 6, name: 'Morning Turbo', gameType: 'NLH', buyIn: '$1', prizePool: '$100 GTD', startTime: 'Today, 9:00 AM EST', status: 'Registering', durationHours: 1, players: ['early_riser', 'coffee_lover'], maxPlayers: 200 },
];

export const mockCashGames = [
  { id: 1, name: 'No-Limit Hold\'em', stakes: '$0.05/$0.10', players: '4/6', type: '6-Max', gameType: 'NLH' },
  { id: 2, name: 'No-Limit Hold\'em', stakes: '$0.10/$0.25', players: '7/9', type: 'Full Ring', gameType: 'NLH' },
  { id: 3, name: 'Pot-Limit Omaha', stakes: '$0.25/$0.50', players: '3/6', type: '6-Max', gameType: 'PLO' },
  { id: 4, name: 'No-Limit Hold\'em', stakes: '$1/$2', players: '5/9', type: 'Full Ring', gameType: 'NLH' },
  { id: 5, name: 'Pot-Limit Omaha', stakes: '$2/$5', players: '2/6', type: 'Heads-Up', gameType: 'PLO' },
];
