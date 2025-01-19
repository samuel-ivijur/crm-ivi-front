import { API_URL } from '@/config/api';
import { BeneficairyQualification, CommunicationStatus } from '@/constants';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const beneficiariesService = {
  getBeneficiaries: async (params: ListBeneficiariesParams): Promise<ListBeneficiariesResult> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/beneficiaries?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data: ListBeneficiariesResult = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar beneficiários');
    }

    return data;
  },
  getBeneficiary: async ({ idbeneficiary, idOrganization }: { idOrganization: string; idbeneficiary: string; }): Promise<IBeneficiary> => {
    const response = await fetch(`${API_URL}/beneficiaries/${idbeneficiary}?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    const data: IBeneficiary = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar beneficiário');
    }

    return data;
  },
  editBeneficiary: async ({ idOrganization, data }: { idOrganization: string; data: IBeneficiary; }) => {
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

interface ListBeneficiariesParams {
  idOrganization: string;
  searchTerm?: string;
}

interface ListBeneficiariesResult {
  beneficiaries: Omit<IBeneficiary, 'idQualification'>[];
  total: number;
  message?: string;
}

type ValueOf<T> = T[keyof T];

export interface IBeneficiary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  idQualification: ValueOf<typeof BeneficairyQualification>;
  idCommunicationStatus?: ValueOf<typeof CommunicationStatus>;
  message?: string;
}
