import { API_URL } from '@/config/api';
import { CampaignItem } from '@/types/campaign-item';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const campaignService = {
  getCampaignItems: async ({ idCampaign, idOrganization }: CampaignParams): Promise<CampaignItem[]> => {
    const response = await fetch(`${API_URL}/Campaign/${idCampaign}/items?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar itens da campanha');
    }

    return data.data;
  },

  drawCampaign: async ({ idCampaign, idOrganization }: CampaignParams): Promise<DrawCampaignResponse> => {
    const response = await fetch(`${API_URL}/Campaign/${idCampaign}/draw`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ idOrganization }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao sortear item da campanha');
    }

    return data.data;
  },

  checkCampaignDisponibility: async ({ idCampaign, idOrganization }: CampaignParams): Promise<CheckCampaignDisponibilityResponse> => {
    const response = await fetch(`${API_URL}/Campaign/${idCampaign}/disponibility?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao verificar disponibilidade');
    }

    return data;
  },

  getCampaignHistory: async ({ idCampaign, idOrganization }: CampaignParams): Promise<GetHistoryCampaignResponse> => {
    const response = await fetch(`${API_URL}/Campaign/${idCampaign}/history?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao verificar disponibilidade');
    }

    return data.data;
  },
};

interface CampaignParams {
  idOrganization: string;
  idCampaign: string;
}

interface DrawCampaignResponse {
  id: string;
  name: string;
  description: string;
  isAward: boolean;
}

interface GetHistoryCampaignResponse {
  campaign: {
    id: string;
    name: string;
  };
  item: {
    id: string;
    name: string;
    description: string;
  };
  redemptionDate: string;
}

interface CheckCampaignDisponibilityResponse {
  available: boolean;
}
