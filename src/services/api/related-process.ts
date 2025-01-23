import { API_URL } from '@/config/api';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const RelatedProcessService = {
  save: async (params: RelatedProcessService.Save.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/relatedProcesses/group`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },
  add: async (params: RelatedProcessService.Add.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/relatedProcesses/group/${params.idGroup}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },
  delete: async (params: RelatedProcessService.Delete.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/relatedProcesses/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
};

export namespace RelatedProcessService {
  export type Relation = {
    idLitigationLink?: string;
    processNumber?: string;
    instance?: number;
    isMainLitigation?: boolean;
  }
  export namespace Save {
    export type Params = {
      idOrganization: string;
      relations: Relation[];
    }
  }
  export namespace Add {
    export type Params = {
      idOrganization: string;
      idGroup: number;
      relations: Relation[];
    }
  }
  export namespace Delete {
    export type Params = {
      idOrganization: string;
      idRelatedProcess: number;
    }
  }
}