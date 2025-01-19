"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/cache";
import { courtService } from "@/services/api/court";
import { useCallback } from "react";

export function useCourt() {
    const queryClient = useQueryClient();

    const getCourtsQuery = useQuery({
        queryKey: [QUERY_KEYS.COURTS_LIST],
        queryFn: async () => {
            const data = await courtService.getCourts({
                limit: 100,
                page: 1,
            });
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 3,
    });

    const invalidateCourtsQuery = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COURTS_LIST] });
    }, [queryClient]);

    return {
        getCourtsQuery,
        invalidateCourtsQuery,
    }
}