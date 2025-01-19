import { API_URL } from '@/config/api';
import { Organization } from '@/types/auth';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

type ApiResponse<T> = {
  error: boolean;
  data: T;
};

export const organizationsService = {
  createOrganization: async (params: CreateParams): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao registrar organização');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  editOrganization: async (params: EditParams): Promise<ApiResponse<void>> => {
    const { id, ...others } = params;
    const response = await fetch(`${API_URL}/organizations/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(others),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao editar organização');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  organizationReport: async (params: ReportParams): Promise<ApiResponse<ReportResult>> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/organizations/${params.idOrganization}/report?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar informações do relatório');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  organizationReportByDay: async (params: OrganizationReportByDayParams): Promise<ApiResponse<ReportByDayResult>> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/organizations/${params.idOrganization}/reportByDay?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar informações do relatório');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  findAllOrganizations: async (params: FindAllOrgParams): Promise<ApiResponse<OrgResult>> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/organizations?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar organizações');
    }

    return {
      error: false,
      data: data,
    };
  },

  getOrganizationQuantity: async (params: GetOrgQuantityParams): Promise<ApiResponse<GetOrgQuantityResponse>> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/organizations/quantity?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar informações');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  organizationReportQuantity: async (params: BaseParams): Promise<ApiResponse<ReportQuantityResult>> => {
    const { idOrganization, ...others } = params;
    const queryParams = new URLSearchParams(others as any).toString();
    const response = await fetch(`${API_URL}/organizations/${idOrganization}/reportQuantity?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar informações do relatório');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  organizationReportClient: async (params: BaseParams): Promise<ApiResponse<ReportClientsResult>> => {
    const { idOrganization, ...others } = params;
    const queryParams = new URLSearchParams(others as any).toString();
    const response = await fetch(`${API_URL}/organizations/${idOrganization}/reportClients?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar informações do relatório');
    }

    return {
      error: false,
      data: data?.data,
    };
  },

  organizationUsageReport: async (params: OrganizationUsageReportParams): Promise<ApiResponse<UsageReportResult>> => {
    const { idOrganization } = params;
    const response = await fetch(`${API_URL}/organizations/${idOrganization}/usage`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar informações de uso');
    }

    return {
      error: false,
      data: data?.data,
    };
  },
};

export interface BaseParams {
  limit?: number;
  page?: number;
  idOrganization?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

interface CreateParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  celphone: string;
  limitCadasters?: number;
}

interface EditParams {
  id: string;
  name?: string;
  idStatus?: number;
  email?: string;
  password?: string;
  phone?: string;
  celphone?: string;
  limitCadasters?: number;
}

interface OrganizationReportByDayParams {
  idOrganization: string;
  type: OrgDaysTypes;
  startDate?: string;
  endDate?: string;
}

interface OrganizationUsageReportParams {
  idOrganization: string;
}

interface FindAllOrgParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  noPagination?: boolean;
  ids?: string[];
}

interface GetOrgQuantityParams {
  startDate?: string;
  endDate?: string;
}

interface GetOrgQuantityResponse {
  report: {
    active: number;
    canceled: number;
    suspended: number;
  };
}

export interface ReportParams {
  [key: string]: any;
  idOrganization?: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  exportData?: boolean;
  ids?: string[];
  beneficiary?: string;
  idStatusLitgation?: number[];
  idStatusCadaster?: number[];
  idStatusCommunication?: number[];
  idStatusLitigation?: number[];
  litigation?: string;
}

export interface BeneficiaryReport {
  id: string;
  beneficiary: {
    id: string;
    name: string;
    phone: string;
    created_at: string;
    status: {
      id: number;
      description: string;
    };
    cadaster: {
      id: number;
      description: string;
    };
  };
  litigations: {
    id: string;
    litigation: string;
    status: string;
    id_status: number;
    external_status: string;
    id_external_status: number;
    amount: number;
    created_at: string;
    error_description: string;
    id_error: number;
  }[];
  communication: {
    id: number;
    description: string;
  };
}

interface ReportResult {
  beneficiaryReport: {
    data: BeneficiaryReport[];
    total: number;
  };
  communicationDaysReport: {
    date: string;
    total: number;
  }[];
}

export interface ReportByDayResult {
  report: {
    date: string;
    total: number;
  }[];
  consolidated: {
    label: string;
    total: number;
  }[];
}

export interface OrgResult {
  organizations: Organization[];
  total: number;
}

export interface ReportQuantityResult {
  communications: number;
}

export interface ReportClientsResult {
  total: number;
  accepted: number;
}

export interface UsageReportResult {
  limitCadasters: number;
  usage: number;
}

export enum OrgDaysTypes {
  COMMUNICATIONS = 1,
  LITIGATIONS = 2,
  BENEFICIARIES = 3,
}

export const OrgDaysTypesLabel: { [k: number]: string } = {
  [OrgDaysTypes.COMMUNICATIONS]: 'Comunicações',
  [OrgDaysTypes.LITIGATIONS]: 'Cadastros',
  [OrgDaysTypes.BENEFICIARIES]: 'Clientes',
};

export const OrgDaysStatusTypesLabel: { [k: number]: string } = {
  [OrgDaysTypes.COMMUNICATIONS]: 'Novidades processuais',
  [OrgDaysTypes.LITIGATIONS]: 'Status dos Cadastros',
  [OrgDaysTypes.BENEFICIARIES]: 'Status dos Clientes',
};
