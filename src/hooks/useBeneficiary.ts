"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { QUERY_KEYS } from "@/constants/cache";
import { useSearchParamsPersist } from "./useSearchParamsPersist";
import { beneficiariesService, GetBeneficiariesParams } from "@/services/api/beneficiaries";

export function useBeneficiary(idOrganization: string) {
    const INITIAL_PARAMS = useRef<GetBeneficiariesParams>({
        page: 1,
        limit: 10,
        idOrganization,
    });
    const queryClient = useQueryClient();
    const { paramsPersisted, setSearchParamsPersist, resetParams } =
        useSearchParamsPersist<GetBeneficiariesParams>({
            prefix: 'beneficiary',
            initialParams: INITIAL_PARAMS.current,
        });

    const changeFilter = (params: Partial<GetBeneficiariesParams>): void => {
        setSearchParamsPersist(params);
    };

    const getBeneficiariesQuery = useQuery({
        queryKey: [QUERY_KEYS.BENEFICIARIES_LIST, paramsPersisted],
        queryFn: async () => {
            const data = await beneficiariesService.findAll(paramsPersisted);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 3,
    });

    const reportBeneficiaryQuery = useQuery({
        queryKey: [QUERY_KEYS.BENEFICIARIES_REPORT, idOrganization],
        queryFn: async () => {
            const data = await beneficiariesService.report({ idOrganization });
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 3,
    });

    const invalidateBeneficiariesQuery = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BENEFICIARIES_LIST] });
    }, [queryClient]);

    const invalidateReportBeneficiaryQuery = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BENEFICIARIES_REPORT] });
    }, [queryClient]);

    return {
        getBeneficiariesQuery,
        invalidateBeneficiariesQuery,
        filter: paramsPersisted,
        changeFilter,
        resetParams,
        reportBeneficiaryQuery,
        invalidateReportBeneficiaryQuery,
    }
}