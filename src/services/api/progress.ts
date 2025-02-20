import { API_URL } from '@/config/api';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const progressService = {
  getProgress: async (params: ListProgressParams): Promise<ApiResponse<ListProgressResult>> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/Progress?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar andamentos');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  createProgress: async (params: CreateProgressParams): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_URL}/Progress`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao salvar andamento');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  getLitigationProgressAmount: async (
    params: GetLitigationProgressAmountParams,
  ): Promise<ApiResponse<GetLitigationProgressAmountResult>> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/Progress/Quantity?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar quantidade de andamentos');
    }

    return {
      error: false,
      data: data?.data,
    };
  },
};

interface ListProgressParams {
  idOrganization: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
  noPagination?: boolean;
  ids?: string[];
}

export interface ProgressParams {
  litigation: string; // Assuming LitigationParams is a string identifier
  text?: string;
  translate?: string;
  idStatus: number;
}

interface CreateProgressParams {
  idOrganization: string;
  data: ProgressParams[];
}

export interface ListProgressResult {
  progress: {
    id: string;
    beneficiary: {
      name: string;
      id: string;
    };
    litigationNumber: string;
    translate: string;
    createdAt: string;
    status: {
      value: string;
      id: string;
    };
  }[];
  total: number;
}

interface GetLitigationProgressAmountParams {
  idOrganization: string;
  ids: string[];
}

interface GetLitigationProgressAmountResult {
  [k: string]: number;
}

type ApiResponse<T> = {
  error: boolean;
  data: T;
};
