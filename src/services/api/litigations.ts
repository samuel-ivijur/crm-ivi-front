import { API_URL } from '@/config/api'
import { LitigationStatus } from '@/constants';
import { AdversyParty } from '@/types/adversy-party';
import { Task } from '@/types/tasks';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
}

export const litigationsService = {
  getLitigations: async ({ids, ...params}: GetLitigations.Params): Promise<GetLitigations.Result["data"]> => {
    let queryParams = new URLSearchParams(params as any).toString();
    if (Array.isArray(ids) && ids.length > 0) {
      let newQueryParams = ids.map( id => 'ids[]=' + id).join('&')
      queryParams += queryParams ? `&${newQueryParams}` : newQueryParams
    }
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
  saveLitigation: async (params: SaveLitigation.Params): Promise<{ id: string }> => {
    const response = await fetch(`${API_URL}/litigations/save`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar processo');
    }

    const data: SaveLitigation.Result = await response.json()
    return data
  },
  saveLitigationBulk: async (params: SaveLitigationBulk.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar processo');
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
  deleteLitigationBulk: async (params: DeleteLitigationBulk.Params): Promise<void> => {
    await fetch(`${API_URL}/litigations/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
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
  },
  saveLitigationBeneficiary: async ({ idLitigation, ...params }: SaveLitigationBeneficiary.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations/${idLitigation}/beneficiary`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
  },
  findLitigationBeneficiary: async ({ idLitigation, idOrganization }: FindLitigationBeneficiary.Params): Promise<FindLitigationBeneficiary.Result> => {
    const response = await fetch(`${API_URL}/litigations/${idLitigation}/beneficiary?idOrganization=${idOrganization}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao encontrar beneficiário do processo');
    }

    return await response.json()
  },
  updateBeneficiaryCommunication: async ({ idOrganization, idLitigation, idBeneficiary, communicate }: UpdateBeneficiaryCommunication.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations/${idLitigation}/beneficiary/${idBeneficiary}/communicate/${communicate}?idOrganization=${idOrganization}`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar comunicação do beneficiário do processo');
    }
  },
  updateLitigationMonitoring: async ({ idOrganization, idLitigation, monitore, idType }: UpdateLitigationMonitoring.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations/${idLitigation}/monitoring`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ idOrganization, monitore, idType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar monitoramento do processo');
    }
  },
  deleteLitigationBeneficiary: async ({ idOrganization, idLitigation, idBeneficiary }: DeleteLitigationBeneficiary.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/litigations/${idLitigation}/beneficiary/${idBeneficiary}?idOrganization=${idOrganization}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir beneficiário do processo');
    }
  }
}

export namespace GetLitigations {
  export type Params = {
    idOrganization: string
    limit?: number
    page?: number
    noPagination?: boolean
    ids?: string[]
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
  export type LitigationMonitoring = {
    id: string;
    monitoring: boolean;
    type: {
      id: number;
      description: string;
    };
  }

  interface Organization {
    id: string;
    name: string;
    status: Status;
  }
  
  interface Status {
    id: number;
    description: string;
  }
  
  interface ErrorStatus {
    id: number;
    description: string;
  }
  
  interface Uf {
    id: number | null;
    description: string | null;
  }
  
  interface CaseCover {
    id: number;
    distributionType: string | null;
    subject: string | null;
    extraSubject: string | null;
    area: string | null;
    nature: string | null;
    forum: string | null;
    court: string | null;
    courtSystem: string | null;
    causeValue: number;
    alternativeNumber: string | null;
    distributionDate: string | null;
  }
  
  interface ExternalStatus {
    description: string;
    id: number;
  }
  
  interface Monitoring {
    id: number;
    type: MonitoringType;
    monitoring: boolean;
  }
  
  interface MonitoringType {
    id: number;
    description: string;
  }
  
  interface Cadaster {
    id: number;
    description: string;
  }

  export type LitigationInfo = {
    id: string;
    processnumber: string;
    instance: number;
    court: string | null;
    obs: string | null;
    amountprogress: number;
    organization: Organization;
    status: Status;
    error: ErrorStatus;
    uf: Uf;
    caseCover: CaseCover;
    externalStatus: ExternalStatus;
    createdAt: string;
    monitoring: Monitoring[];
    cadaster: Cadaster;
    adverseParties: AdverseParty[];
    tasks: Task[];
    idRelatedProcessesGroup: number | null;
    relatedProcesses: {
      id: number;
      processnumber: string;
      instance: string;
    }[]
    beneficiaries: {
      id: string;
      name: string;
      communicate: boolean;
      phone?: string;
      nick?: string;
      qualification: {
        id: number;
        description: string;
      };
    }[]
  }
}

export namespace SaveLitigation {
  export type Params = LitigationParams & {
    idOrganization: string;
  }
  export type Result = {
    id: string;
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
export type LitigationParamsTask = {
  title: string;
  deadline: string;
  idResponsible?: string;
  idPriority: number;
}

export type LitigationParamsClient = {
  name: string;
  phone: string;
  idQualification: number;
}
export interface LitigationParams {
  processNumber: string;
  instance: number;
  uf?: number;
  idStatus?: LitigationStatus;
  idClient?: string;
  nick?: string;
  obs?: string;
  adverseParty?: Omit<AdversyParty, 'id'>[];
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
  tasks?: LitigationParamsTask[];
  relatedProcesses?: {
    processNumber: string;
    instance: number;
  }[];
  client?: LitigationParamsClient;

}
export interface CreateLitigationParams {
  idOrganization: string;
  litigations: LitigationParams[];
}

export namespace SaveLitigationBeneficiary {
  export type Params = {
    idOrganization: string;
    idLitigation: string;
    idBeneficiary: string;
    idQualification: number;
    communicate: boolean;
    nick?: string;
  }
}

export namespace UpdateBeneficiaryCommunication {
  export type Params = {
    idOrganization: string;
    idLitigation: string;
    idBeneficiary: string;
    communicate: boolean;
  }
}

export namespace UpdateLitigationMonitoring {
  export type Params = {
    idOrganization: string;
    idLitigation: string;
    monitore: boolean;
    idType: number;
  }
}

export namespace DeleteLitigationBeneficiary {
  export type Params = {
    idOrganization: string;
    idLitigation: string;
    idBeneficiary: string;
  }
}

export namespace FindLitigationBeneficiary {
  export type Params = {
    idOrganization: string;
    idLitigation: string;
  }
  export type Result = {
    data: {
      id: string;
      beneficiary: {
        id: string;
        name: string;
      };
    }[]
    total: number;
  }
}

export namespace DeleteLitigationBulk {
  export type Params = {
    idOrganization: string;
    ids: string[];
  }
}

export namespace SaveLitigationBulk {
  export type Params = {
    idOrganization: string;
    litigations: LitigationParams[];
  }
}