import { API_URL } from '@/config/api'
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
}
export const litigationsService = {
  getLitigations: async (params: GetLitigations.Params): Promise<GetLitigations.Result["data"]> => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/litigations?${queryParams}`, {
      method: 'GET',
      headers,
    })

    const data: GetLitigations.Result = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao recuperar processos')
    }

    return data.data
  },
  getLitigation: async ({ id, idOrganization }: GetLitigation.Params): Promise<GetLitigation.Result["data"]> => {
    const response = await fetch(`${API_URL}/litigations/${id}?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    })

    const data: GetLitigation.Result = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao recuperar processo')
    }

    return data.data
  }
}

export namespace GetLitigations {
  export type Params = {
    idOrganization: string
    limit: number
    page: number
    startDate?: string
    endDate?: string
    nick?: string
    litigation?: string
    instance?: string
    court?: string
    uf?: number
    adverseParty?: string
    qualification?: string
    beneficiary?: string
    idAdverseParty?: number[]
    idQualification?: number[]
    idStatusLitigation?: number[]
    idBeneficiary?: string[]
  }
  export type Result = {
    data: {
      total: number;
      data: LitigationInfo[];
    }
    message?: string
  }
  export type LitigationInfo = {
    id: string;
    processnumber: string;
    instance: string | null;
    court: string;
    obs: string;
    nick: string;
    idstatus: number;
    clientidstatus: number;
    clientstatus: string;
    statuserrordescription: string;
    idstatuserror: number;
    statusdescription: string;
    createdat: string;
    idclient: string;
    clientname: string;
    clientphone: string;
    qualification: string;
    amountprogress: number;
    externalstatusdescription: string;
    externalstatusid: string;
    adversepartyname?: string;
    organizationid: string;
    organizationname: string;
    idorganizationstatus: number;
    organizationstatus: string;
    iduf: number;
    uf: string;
    tasks: {
      id: number;
      title: string;
      deadline: string;
      createdat: string;
      status: {
        id: number;
        description: string;
      };
      priority: {
        id: number;
        description: string;
      };
    }[]
    case_cover: {
      id?: number,
      distribution_type?: string,
      distribution_date?: string,
      subject?: string,
      extra_subject?: string,
      area?: string,
      nature?: string,
      forum?: string,
      court?: string,
      court_system?: string
      cause_value?: string,
      alternative_number?: string,
    },
    relatedProcesses: {
      id: number;
      processnumber: string;
      instance: string;
    }[]
    cadaster: {
      id: number;
      description: string;
    };
  }
}

export namespace GetLitigation {
  export type Params = {
    id: string
    idOrganization: string
  }
  export type Result = {
    data: GetLitigations.LitigationInfo
    message?: string
  }
}