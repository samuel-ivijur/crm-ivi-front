import { API_URL } from '@/config/api';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const cadasterService = {
  getCadastersStatus: async (): Promise<{ id: number; name: string }[]> => {
    const response = await fetch(`${API_URL}/cadasters/status`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao recuperar status dos cadastros');
    }

    return data;
  },
};
