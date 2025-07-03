
import { useMemo } from "react";
import { parseTournamentStartTime } from "../lib/dateUtils";
import { useNow } from "./useNow";
import { useTournamentsData } from "../contexts/TournamentsContext";
import { calculateTournamentDynamicState } from "../lib/tournamentUtils";

export const useTournament = (tournamentId: string | undefined) => {
  const now = useNow();
  const { tournaments } = useTournamentsData();

  const tournamentWithParsedTime = useMemo(() => {
    if (!tournamentId) return null;

    const baseTournament = tournaments.find((t) => t.id === Number(tournamentId));
    if (!baseTournament) return null;

    return {
      ...baseTournament,
      parsedStartTime: parseTournamentStartTime(baseTournament.startTime),
    };
  }, [tournamentId, tournaments]);

  const tournament = useMemo(() => {
    if (!tournamentWithParsedTime) return null;

    // The 'now' dependency triggers re-calculation every second.
    // calculateTournamentDynamicState will use the pre-parsed time.
    return calculateTournamentDynamicState(tournamentWithParsedTime, now);
  }, [tournamentWithParsedTime, now]);

  return tournament;
};
