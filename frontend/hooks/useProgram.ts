import { useState, useEffect } from "react";
import { makeApiRequest, determineEnv } from "../utils/api";
import type { EnrichmentProgram } from "@/types/program";

const WONDERHOOD_URL = determineEnv();

export function useProgram(programId: string | undefined) {
  const [program, setProgram] = useState<EnrichmentProgram | null>(null);
  const [programs, setPrograms] = useState<EnrichmentProgram[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (programId) {
        const data = await makeApiRequest<{ program: EnrichmentProgram }>(
          `${WONDERHOOD_URL}/program/${programId}`,
          { method: "GET" }
        );
        setProgram(data.program);
        setPrograms(null);
      } else {
        const data = await makeApiRequest<{ programs: EnrichmentProgram[] }>(
          `${WONDERHOOD_URL}/program`,
          { method: "GET" }
        );
        setPrograms(data.programs);
        setProgram(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch program");
      setProgram(null);
      setPrograms(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

  const refetch = () => fetchData();

  return { program, programs, loading, error, refetch };
}
