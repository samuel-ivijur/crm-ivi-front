import { API_URL } from '@/config/api';
import { Beneficiary } from '@/types/beneficiarie';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const beneficiariesService = {
  getBeneficiaries: async (params: GetBeneficiariesParams): Promise<ListBeneficiariesResult> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/beneficiaries?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const { data }: { data: ListBeneficiariesResult } = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar beneficiários');
    }
    return data;
  },
  getBeneficiary: async ({ idbeneficiary, idOrganization }: { idOrganization: string; idbeneficiary: string; }): Promise<Beneficiary> => {
    const response = await fetch(`${API_URL}/beneficiaries/${idbeneficiary}?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    const { data }: { data: Beneficiary } = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar beneficiário');
    }

    return data;
  },
  editBeneficiary: async ({ idOrganization, data }: { idOrganization: string; data: Beneficiary; }) => {
    const { id, ...others } = data;

    const response = await fetch(`${API_URL}/beneficiaries/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        idOrganization,
        ...others,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao editar beneficiário');
    }
  },
};

export interface GetBeneficiariesParams {
  idOrganization: string;
  searchTerm?: string;
}

interface ListBeneficiariesResult {
  beneficiaries: Omit<Beneficiary, 'idQualification'>[];
  total: number;
  message?: string;
}

type ValueOf<T> = T[keyof T];
