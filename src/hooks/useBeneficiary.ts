"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/cache";
import { useCallback } from "react";
import { useSearchParamsPersist } from "./useSearchParamsPersist";
import { beneficiariesService, GetBeneficiariesParams } from "@/services/api/beneficiaries";

export function useBeneficiary() {
    const queryClient = useQueryClient();
    const { paramsPersisted, setSearchParamsPersist, resetParams } =
        useSearchParamsPersist<GetBeneficiariesParams>({
            prefix: 'beneficiary',
        });

    const changeFilter = (params: Partial<GetBeneficiariesParams>): void => {
        setSearchParamsPersist(params);
    };

    const getBeneficiariesQuery = useQuery({
        queryKey: [QUERY_KEYS.BENEFICIARIES_LIST, paramsPersisted],
        queryFn: async () => {
            const data = await beneficiariesService.getBeneficiaries(paramsPersisted);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 3,
    });

    const invalidateBeneficiariesQuery = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BENEFICIARIES_LIST] });
    }, [queryClient]);

    return {
        getBeneficiariesQuery,
        invalidateBeneficiariesQuery,
        filter: paramsPersisted,
        changeFilter,
        resetParams,
    }
}