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
}

export namespace GetLitigations {
  export type Params = {
    idOrganization: string
    limit: number
    page: number
    startDate?: string
    endDate?: string
    nick?: string
    litigation?: number
    instance?: number
    court?: string
    uf?: number
    adverseParty?: string
    idAdverseParty?: number
    idQualification?: number
    qualification?: string
    beneficiary?: string
    idBeneficiary?: string
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
    instance: number;
    court: string | null;
    obs: string | null;
    organizationid: string;
    organizationname: string;
    nick: string;
    idstatus: number;
    statusdescription: string;
    createdat: string; // ISO date string
    qualification: string;
    idqualification: number;
    idclient: string;
    clientname: string;
    clientphone: string;
    clientidstatus: number;
    clientstatus: string;
    idstatuserror: number;
    statuserrordescription: string;
    idorganization: string;
    idorganizationstatus: number;
    organizationstatus: string;
    uf: string | null;
    iduf: string | null;
    case_cover: {
      id: number;
      distribution_type: string | null;
      subject: string | null;
      extra_subject: string | null;
      area: string | null;
      nature: string | null;
      forum: string | null;
      court: string | null;
      court_system: string | null;
      cause_value: number;
      alternative_number: string;
    };
    amountprogress: number;
    externalstatusdescription: string | null;
    externalstatusid: number | null;
    tasks: any[]; // Define a more specific type if available
    adverseParties: {
      id: number;
      name: string;
      type: {
        id: number;
        description: string;
      };
    }[];
    cadaster: {
      id: number;
      description: string;
    };
  }
}

/*
idOrganization:01J7C7EZD342605P37P677X674
limit:10
page:1
//startDate:2024-10-01
//endDate:2024-10-10
//nick:ANILDO
//litigation:5000504
//instance:2
//court:ASDSA
//uf:1
//adverseParty:TE
//idAdverseParty[]:889
//idQualification[]:4
//qualification:autor
//beneficiary:igor
//idBeneficiary:01JA41TFJWRZEBHFXA32XVNPXH
*/