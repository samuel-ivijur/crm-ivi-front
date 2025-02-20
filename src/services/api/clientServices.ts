import { API_URL } from '@/config/api';
import { Communication } from '@/types/communication';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const clientServices = {
  getCommunications: async (params: GetCommunications.Params): Promise<GetCommunications.Result["data"]> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/communications?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data: GetCommunications.Result = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao recuperar comunicações');
    }

    return data.data;
  },

  getCommunicationsReport: async ({ organizationId, endDate, startDate, searchTerm }: GetCommunicationsReport.Params): Promise<void> => {
    const queryParams = new URLSearchParams({
      idOrganization: organizationId,
      startDate,
      endDate,
      searchTerm,
    } as any).toString();

    const response = await fetch(`${API_URL}/communications/report?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao recuperar relatório de comunicações');
    }

    // return communicationAdapter(data);
  }
};

export namespace GetCommunications {
  export type Params = {
    noPagination?: boolean;
    ids?: string[];
  } & BaseParams;

  export type Result = {
    data: {
      communications: Communication[];
      total: number;
    };
    message?: string;
  };
}

export namespace GetCommunicationsReport {
  export type Params = {
    organizationId?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  };

  export type Result = CommunicationsReport[];
}

interface BaseParams {
  limit?: number;
  page?: number;
  idOrganization?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

interface CommunicationsReport {
  label: string;
  value: number;
}