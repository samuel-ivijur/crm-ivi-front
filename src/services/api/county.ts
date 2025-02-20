import { API_URL } from '@/config/api';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const countyService = {
  getCounties: async (params: GetCountiesParams): Promise<GetCountiesResult> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/counties?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data: { data: GetCountiesResult, message?: string; } = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar comarcas');
    }

    return data.data;
  },
};

interface County {
  id: number;
  name: string;
  uf: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}

export interface GetCountiesParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
  idUf?: number;
  idCity?: number;
  uf?: string;
  city?: string;
  county?: string;
}

interface GetCountiesResult {
  total: number;
  counties: County[];
  
}