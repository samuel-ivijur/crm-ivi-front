export enum LitigationStatus {
    ACTIVE = 1,
    ARCHIVED = 2,
  }
  export enum LitigationLinkStatus {
    REGISTERED = 1,
    REGISTER_PENDING = 2,
    DELETE_PENDING = 3,
    DELETED = 4,
    NOT_REGISTERED = 5,
    ERROR = 6,
    ARCHIVED = 7,
    JUDICIAL_SECRECY = 8,
    VALIDATING = 9,
  }
  
  export const LitigationStatusLabels: { [k: number]: string } = {
    [LitigationStatus.ACTIVE]: 'Ativo',
    [LitigationStatus.ARCHIVED]: 'Arquivado/Baixado',
  };
  
  export const LitigationLinkStatusLabels: { [k: number]: string } = {
    [LitigationLinkStatus.REGISTERED]: 'Registrado',
    [LitigationLinkStatus.REGISTER_PENDING]: 'Registro Pendente',
    [LitigationLinkStatus.DELETE_PENDING]: 'Exclusão Pendente',
    [LitigationLinkStatus.DELETED]: 'Excluído',
    [LitigationLinkStatus.NOT_REGISTERED]: 'Não Registrado',
    [LitigationLinkStatus.ERROR]: 'Erro',
    [LitigationLinkStatus.ARCHIVED]: 'Arquivado',
    [LitigationLinkStatus.JUDICIAL_SECRECY]: 'Segredo de Justiça',
    [LitigationLinkStatus.VALIDATING]: 'Validando',
  };
  
  export const LitigationLinkStatusColor: { [k: number]: string } = {
    [LitigationLinkStatus.ARCHIVED]: 'orange',
    [LitigationLinkStatus.DELETED]: 'gray',
    [LitigationLinkStatus.REGISTER_PENDING]: 'orange',
    [LitigationLinkStatus.ERROR]: 'red',
    [LitigationLinkStatus.NOT_REGISTERED]: 'red',
    [LitigationLinkStatus.JUDICIAL_SECRECY]: 'blue',
    [LitigationLinkStatus.REGISTERED]: 'green',
    [LitigationLinkStatus.VALIDATING]: 'yellow',
  };
  
  export enum LitigationMonitoringType {
    PUBLICATIONS = 1,
  }
  
  
  