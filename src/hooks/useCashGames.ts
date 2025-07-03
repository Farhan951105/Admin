
import { useState, useMemo } from "react";
import { mockCashGames } from "../lib/mockData";
import type{ CashGame, CashGameSortKey, SortConfig, SortDirection } from "../lib/types";

export const useCashGames = (searchTerm: string, gameFilter: string) => {
  const [cashGameSortConfig, setCashGameSortConfig] = useState<SortConfig<CashGameSortKey> | null>(null);

  const handleCashGameSort = (key: CashGameSortKey) => {
    let direction: SortDirection = 'asc';
    if (cashGameSortConfig && cashGameSortConfig.key === key && cashGameSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setCashGameSortConfig({ key, direction });
  };
  
  const filteredCashGames = useMemo(() => 
    mockCashGames.filter((game) => {
        const searchMatch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
        const gameFilterMatch = gameFilter === 'all' || game.gameType === gameFilter;
        return searchMatch && gameFilterMatch;
    }).filter((g): g is CashGame => true),
    [searchTerm, gameFilter]
  );

  const sortedCashGames = useMemo(() => {
    let sortableItems: CashGame[] = [...filteredCashGames];
    if (cashGameSortConfig !== null) {
      sortableItems.sort((a, b) => {
        const key = cashGameSortConfig.key;
        let aVal, bVal;

        switch (key) {
          case 'players': {
            const [aCurrent, aMax] = a.players.split('/').map(Number);
            aVal = aMax > 0 ? aCurrent / aMax : 0;
            const [bCurrent, bMax] = b.players.split('/').map(Number);
            bVal = bMax > 0 ? bCurrent / bMax : 0;
            break;
          }
          case 'stakes': {
            const parseStakes = (stakes: string) => parseFloat(stakes.split('/')[1]?.replace('$', '')) || 0;
            aVal = parseStakes(a.stakes);
            bVal = parseStakes(b.stakes);
            break;
          }
          default:
            aVal = a[key as keyof typeof a];
            bVal = b[key as keyof typeof b];
        }

        if (aVal < bVal) {
          return cashGameSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return cashGameSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredCashGames, cashGameSortConfig]);

  return {
    sortedCashGames,
    cashGameSortConfig,
    handleCashGameSort
  };
};
