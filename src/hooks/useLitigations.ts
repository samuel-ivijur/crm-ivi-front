"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/cache";
import { GetLitigations, litigationsService } from "@/services/api/litigations";
import { useAuth } from "./useAuth";
import { useCallback } from "react";
import { useSearchParamsPersist } from "./useSearchParamsPersist";

export type GetLitigationParams = Omit<GetLitigations.Params, "idOrganization">;
const INITIAL_PARAMS: GetLitigationParams = {
    limit: 20,
    page: 1,
};

export function useLitigation() {
    const { getSelectedOrganization } = useAuth();
    const queryclient = useQueryClient();
    const { paramsPersisted, setSearchParamsPersist, resetParams } =
        useSearchParamsPersist<GetLitigationParams>({
            prefix: 'ltable',
            initialParams: INITIAL_PARAMS,
        });

    const changeFilter = (params: Partial<GetLitigationParams>): void => {
        const isFilterChanged = Object.keys(params).some(
            (key) => key !== 'page' && paramsPersisted[key as keyof typeof paramsPersisted] !== undefined,
        );

        if (isFilterChanged) {
            params.page = 1;
        }

        setSearchParamsPersist(params)
    }
    const getAllLitigationsQuery = useQuery({
        queryKey: [QUERY_KEYS.LITIGATIONS_LIST, { idOrganization: getSelectedOrganization(), ...paramsPersisted }],
        queryFn: async () => {
            const data = await litigationsService.getLitigations({
                idOrganization: getSelectedOrganization(),
                ...paramsPersisted
            });
            return data;
        },
        staleTime: 1000 * 60 * 5,
        
    });

    const invalidateQuery = useCallback(() => {
        queryclient.invalidateQueries({ queryKey: [QUERY_KEYS.LITIGATIONS_LIST] });
    }, [getAllLitigationsQuery]);

    return {
        getAllLitigationsQuery,
        invalidateQuery, resetParams,
        filter: paramsPersisted, changeFilter
    }
} 