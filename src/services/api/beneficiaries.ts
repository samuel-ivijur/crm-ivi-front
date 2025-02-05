import { API_URL } from '@/config/api';
import { Beneficiary } from '@/types/beneficiarie';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const beneficiariesService = {
  findAll: async (params: GetBeneficiariesParams): Promise<ListBeneficiariesResult> => {
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
  find: async ({ idbeneficiary, idOrganization }: { idOrganization: string; idbeneficiary: string; }): Promise<Beneficiary> => {
    const response = await fetch(`${API_URL}/beneficiaries/${idbeneficiary}?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    const { data, message }: { data: Beneficiary, message?: string } = await response.json();

    if (!response.ok) {
      throw new Error(message || 'Erro ao buscar beneficiário');
    }

    return data;
  },
  save: async ({ idOrganization, data }: { idOrganization: string; data: Beneficiary; }) => {
    const response = await fetch(`${API_URL}/beneficiaries`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        idOrganization,
        ...data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar beneficiário');
    }
    
  },
  update: async ({ idOrganization, data }: { idOrganization: string; data: Beneficiary; }) => {
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
  delete: async ({ idOrganization, idBeneficiary }: { idOrganization: string; idBeneficiary: string; }) => {
    const response = await fetch(`${API_URL}/beneficiaries/${idBeneficiary}?idOrganization=${idOrganization}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir beneficiário');
    }
  },
  report: async ({ idOrganization }: { idOrganization: string; }): Promise<ReportBeneficiaryResult> => {
    const response = await fetch(`${API_URL}/beneficiaries/report?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao gerar relatório');
    }

    const { data }: { data: ReportBeneficiaryResult } = await response.json();

    return data;
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

export interface ReportBeneficiaryResult {
  total: {
    actives: number;
    inactives: number;
  };
  communication: {
    actives: number;
    inactives: number;
  };
  accepts: {
    accepted: number;
    notAccepted: number;
  };
}
