import { API_URL } from '@/config/api';
import { Beneficiary } from '@/types/beneficiarie';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const beneficiariesService = {
  findAll: async ({ ids, ...params }: GetBeneficiariesParams): Promise<ListBeneficiariesResult> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const idsParams = Array.isArray(ids) && ids.length > 0 ? ids.map(id => `ids[]=${id}`).join('&') : '';
    let url = `${API_URL}/beneficiaries?${queryParams}`
    if (idsParams) {
      const prefix = url.at(-1) === '?' ? '' : '&';
      url += `${prefix}${idsParams}`
    }
    const response = await fetch(url, {
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
  save: async (params: SaveBeneficiaryParams): Promise<SaveBeneficiaryResult> => {
    const response = await fetch(`${API_URL}/beneficiaries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar beneficiário');
    }

    const data: SaveBeneficiaryResult = await response.json();

    return data;
  },
  saveBulk: async (params: SaveBeneficiaryBulkParams): Promise<void> => {
    const response = await fetch(`${API_URL}/beneficiaries/bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar beneficiário');
    }
  },
  update: async ({ id, ...params }: SaveBeneficiaryParams & { id: string }) => {
    console.log("params", params)
    const response = await fetch(`${API_URL}/beneficiaries/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(params),
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
  report: async ({ idOrganization }: { idOrganization?: string; }): Promise<ReportBeneficiaryResult> => {
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
  idOrganization?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  ids?: string[];
  idStatus?: number;
  idType?: number;
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
}

interface BeneficiaryParams {
  name: string;
  idType: number;
  document?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
}

export interface SaveBeneficiaryParams extends BeneficiaryParams {
  idOrganization: string;
}

export interface SaveBeneficiaryBulkParams {
  idOrganization: string;
  beneficiaries: BeneficiaryParams[];
}

interface SaveBeneficiaryResult {
  id: string;
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

