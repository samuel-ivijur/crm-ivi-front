"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/cache";
import { litigationsService } from "@/services/api/litigations";
import { useAuth } from "./useAuth";
import { useCallback } from "react";

export function useLitigationReport() {
    const { getSelectedOrganization } = useAuth();
    const queryclient = useQueryClient();

    const getLitigationReportQuery = useQuery({
        queryKey: [QUERY_KEYS.LITIGATION_REPORT, { idOrganization: getSelectedOrganization() }],
        queryFn: async () => {
            const data = await litigationsService.reportLitigations({
                idOrganization: getSelectedOrganization(),
            });
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const invalidateQuery = useCallback(() => {
        queryclient.invalidateQueries({ queryKey: [QUERY_KEYS.LITIGATION_REPORT] });
    }, [getLitigationReportQuery]);

    return {
        getLitigationReportQuery,
        invalidateQuery,
    }
} 