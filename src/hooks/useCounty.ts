"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/cache";
import { countyService, GetCountiesParams } from "@/services/api/county";
import { useCallback } from "react";
import { useSearchParamsPersist } from "./useSearchParamsPersist";

const INITIAL_PARAMS: GetCountiesParams = {
    limit: 10,
    page: 1,
};

export function useCounty() {
    const queryClient = useQueryClient();
    const { paramsPersisted, setSearchParamsPersist, resetParams } =
        useSearchParamsPersist<GetCountiesParams>({
            prefix: 'county',
            initialParams: INITIAL_PARAMS,
        });

    const changeFilter = (params: Partial<GetCountiesParams>): void => {
        const isFilterChanged = Object.keys(params).some(
            (key) => key !== 'page' && paramsPersisted[key as keyof typeof paramsPersisted] !== undefined,
        );

        if (isFilterChanged) {
            params.page = 1;
        }

        setSearchParamsPersist(params);
    };

    const getCountiesQuery = useQuery({
        queryKey: [QUERY_KEYS.COUNTIES_LIST, paramsPersisted],
        queryFn: async () => {
            const data = await countyService.getCounties(paramsPersisted);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 3,
    });

    const invalidateCountiesQuery = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUNTIES_LIST] });
    }, [queryClient]);

    return {
        getCountiesQuery,
        invalidateCountiesQuery,
        filter: paramsPersisted,
        changeFilter,
        resetParams,
    }
}