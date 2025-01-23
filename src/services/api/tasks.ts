import { API_URL } from '@/config/api';
import { authCookies } from '@/utils/auth-cookies';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authCookies.getToken(),
};

export const TaskService = {
  save: async (params: TaskService.Save.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },

  delete: async ({ id, idOrganization }: TaskService.Delete.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/tasks/${id}?idOrganization=${idOrganization}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },

  changeStatus: async ({ idOrganization, idStatus, idTask }: TaskService.ChangeStatus.Params): Promise<void> => {
    const response = await fetch(`${API_URL}/tasks/${idTask}/status/${idStatus}?idOrganization=${idOrganization}`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },
};

export namespace TaskService {
    export namespace Save {
        export type Params = {
            idLitigationLink: string;
            idOrganization: string;
            title: string;
            deadline: string;
            idPriority: number;
            idResponsible?: number;
        }
        export type Result = {
            id: number;
        }
    }

    export namespace Delete {
        export type Params = {
            id: number;
            idOrganization: string;
        }
    }

    export namespace ChangeStatus {
        export type Params = {
            idTask: number;
            idStatus: number;
            idOrganization: string;
        }
    }
}