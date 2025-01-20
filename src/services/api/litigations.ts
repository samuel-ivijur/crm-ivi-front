import { API_URL } from '@/config/api'
import { LitigationStatus } from '@/constants';
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
  },
  createLitigation: async (params: CreateLitigationParams): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar processo');
    }
  },
  editLitigation: async (
    params: {
      id: string;
      idOrganization: CreateLitigationParams['idOrganization'];
    } & Partial<LitigationParams>
  ): Promise<void> => {
    const { id, ...data } = params;
    const response = await fetch(`${API_URL}/litigations/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao editar processo');
    }
  },
  addAdverseParty: async ({ idLitigation, idOrganization, adverseParty }: AddAdverseParty.Params): Promise<AddAdverseParty.Result> => {
    const response = await fetch(`${API_URL}/litigations/${idLitigation}/adverseParty`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ idOrganization, adverseParty }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao adicionar parte adversa');
    }

    const data: AddAdverseParty.Result = await response.json()
    return data
  },
  removeAdverseParty: async ({ id, idAdverseParty, idOrganization }: RemoveAdverseParty.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations/${id}/adverseParty/${idAdverseParty}?idOrganization=${idOrganization}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao remover parte adversa');
    }
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
  export type AdverseParty = {
    id: number;
    name: string;
    document?: string;
    type: {
      id: number;
      description: string;
    };
    personType?: {
      id: number;
      description: string;
    };
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
    organizationid: string;
    organizationname: string;
    idorganizationstatus: number;
    organizationstatus: string;
    iduf: number;
    uf: string;
    adverseParties: AdverseParty[]
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

export namespace AddAdverseParty {
  export type Params = {
    idLitigation: string;
    idOrganization: string;
    adverseParty: {
      name: string;
      document?: string;
      idType: number;
      idPersonType: number;
    }
  }
  export type Result = {
    id: number;
  }
}

export namespace RemoveAdverseParty {
  export type Params = {
    id: string;
    idAdverseParty: number;
    idOrganization: string;
  }
}
export interface LitigationParams {
  processNumber: string;
  instance: number;
  uf?: number;
  idStatus?: LitigationStatus;
  idClient?: string;
  nick?: string;
  obs?: string;
  adverseParty?: {
    name: string;
    idType: number;
    idPersonType: number;
    document?: string;
  }[];
  caseCover: {
    distributionDate?: string;
    distributionType?: string;
    area?: string;
    nature?: string;
    forum?: string;
    idCourt?: number;
    idCounty?: number;
    claimValue?: string;
    classes?: string[];
    idCourtSystem?: number;
    subject?: string;
    extraSubject?: string;
    alternativeNumber?: string;
  }
  tasks?: {
    title: string;
    deadline: string;
    idResponsible?: string;
    idPriority?: number;
  }[];
  relatedProcesses?: {
    processNumber: string;
    instance: number;
  }[];
  client?: {
    name: string;
    phone: string;
    idQualification?: number;
  };

}
export interface CreateLitigationParams {
  idOrganization: string;
  litigations: LitigationParams[];
}

