"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/cache";
import { litigationsService } from "@/services/api/litigations";
import { useAuth } from "./useAuth";
import { useCallback } from "react";

export function useLitigation() {
    const { getSelectedOrganization } = useAuth();
    const queryclient = useQueryClient();

    const getAllLitigationsQuery = useQuery({
        queryKey: [
            QUERY_KEYS.LITIGATIONS_LIST,
            {},
        ],
        queryFn: async () => {
            const { data } = await litigationsService.getLitigations({
                idOrganization: getSelectedOrganization(),
                limit: 20,
                page: 1,
            });
            return data;
        },
        staleTime: 1000 * 60 * 5,
        // placeholderData: keepPreviousData,
    });

    const invalidateQuery = useCallback(() => {
        queryclient.invalidateQueries({ queryKey: [QUERY_KEYS.LITIGATIONS_LIST] });
    }, [getAllLitigationsQuery]);

    return {
        getAllLitigationsQuery,
        invalidateQuery
    }
} 