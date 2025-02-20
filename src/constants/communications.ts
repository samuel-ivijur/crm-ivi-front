export const CommunicationStatus = {
  ACCEPTED: 1,
  REFUSED: 2,
  SILENCE: 3,
  DOES_NOT_RECOGNIZE_SERVICE: 4,
  INVALID_PHONE: 5,
  NO_PHONE_NUMBER: 6,
  VALIDATING: 7,
  WHATSAPP_NOT_FOUND: 8,
};

export const CommunicationStatusLabel: { [k: number]: string } = {
  [CommunicationStatus.ACCEPTED]: 'Aceito',
  [CommunicationStatus.REFUSED]: 'Recusado',
  [CommunicationStatus.SILENCE]: 'Silêncio',
  [CommunicationStatus.DOES_NOT_RECOGNIZE_SERVICE]: 'Não reconhece serviço',
  [CommunicationStatus.INVALID_PHONE]: 'Telefone inválido',
  [CommunicationStatus.NO_PHONE_NUMBER]: 'Sem número de telefone',
  [CommunicationStatus.VALIDATING]: 'Validando',
  [CommunicationStatus.WHATSAPP_NOT_FOUND]: 'Whatsapp não encontrado',
};

export const CommunicationStatusColorTable: { [k: number]: string } = {
  [CommunicationStatus.ACCEPTED]: 'green',
  [CommunicationStatus.REFUSED]: 'red',
  [CommunicationStatus.SILENCE]: 'gray',
  [CommunicationStatus.DOES_NOT_RECOGNIZE_SERVICE]: 'yellow',
  [CommunicationStatus.INVALID_PHONE]: 'orange',
  [CommunicationStatus.NO_PHONE_NUMBER]: '#cfcfcf',
  [CommunicationStatus.VALIDATING]: '#ba920d',
  [CommunicationStatus.WHATSAPP_NOT_FOUND]: '#ff5454',
};

export const CommunicationStatusColor: { [k: number]: string } = {
  [-1]: '#403f3e',
  [CommunicationStatus.ACCEPTED]: '#b7eb8f',
  [CommunicationStatus.REFUSED]: '#fa6c61',
  [CommunicationStatus.SILENCE]: 'gray',
  [CommunicationStatus.DOES_NOT_RECOGNIZE_SERVICE]: '#fffb8f',
  [CommunicationStatus.INVALID_PHONE]: '#ffd591',
  [CommunicationStatus.NO_PHONE_NUMBER]: '#cfcfcf',
  [CommunicationStatus.VALIDATING]: '#ba920d',
  [CommunicationStatus.WHATSAPP_NOT_FOUND]: '#ff5454',
};
