"use client"

import { QUERY_KEYS } from "@/constants/cache";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import { useAuth } from "./useAuth";
import { GetLitigation, litigationsService } from "@/services/api/litigations";

export function useProcessDetails() {
  const [activeTab, setActiveTab] = useState("dados")
  const queryclient = useQueryClient();
  const { getSelectedOrganization } = useAuth();
  const [id, setId] = useState<string | null>(null);

  const tabs = [
    { id: "dados", label: "Dados" },
    { id: "partes", label: "Partes" },
    { id: "prazos", label: "Prazos" },
    { id: "relacionados", label: "Relacionados" },
    { id: "historico", label: "Histórico" },
    { id: "cliente", label: "Cliente" },
  ]

  const getLitigationQuery = useQuery({
    queryKey: [QUERY_KEYS.LITIGATION, { idOrganization: getSelectedOrganization(), id }],
    queryFn: async () => {
      if (!id) return null;
      const data = await litigationsService.getLitigation({ id, idOrganization: getSelectedOrganization() });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const getLitigation = async (id: string): Promise<GetLitigation.Result["data"] | null> => {
    setId(id);
    await getLitigationQuery.refetch();
    return getLitigationQuery.data as GetLitigation.Result["data"] | null;
  }

  const invalidateAllLitigations = () => {
    queryclient.invalidateQueries({ queryKey: [QUERY_KEYS.LITIGATION,] });
  }

  const invalidateLitigation = (id: string) => {
    queryclient.invalidateQueries({ queryKey: [QUERY_KEYS.LITIGATION, { idOrganization: getSelectedOrganization(), id }] });
  }

  return {
    activeTab,
    setActiveTab,
    tabs,
    getLitigation,
    getLitigationQuery,
    invalidateLitigation,
    invalidateAllLitigations
  }
} 