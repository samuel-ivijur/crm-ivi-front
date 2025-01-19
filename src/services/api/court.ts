import { API_URL } from '@/config/api';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const courtService = {
  getCourts: async (params: GetCourtsParams): Promise<GetCourtsResult> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/courts?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data: { data: GetCourtsResult } = await response.json();

    if (!response.ok) {
      throw new Error(data.data.message || 'Erro ao buscar tribunais');
    }

    return data?.data;
  },
};

interface Court {
  id: number;
  name: string;
  acronym: string;
}

export interface GetCourtsParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
}

interface GetCourtsResult {
  total: number;
  courts: Court[];
  message?: string;
}
