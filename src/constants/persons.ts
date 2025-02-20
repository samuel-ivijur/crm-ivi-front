export enum PersonType {
  PERSON = 1,
  COMPANY = 2,
};

export enum AdversePartyType {
  NOT_INFORMED = 1,
  PLAINTIFF = 2,
  COPLAINTIFF = 3,
  DEFENDANT = 4,
  THIRD_PARTY_INTERESTED = 5,
}

export const personTypeOptions = [
  { value: PersonType.PERSON, label: 'Pessoa Física' },
  { value: PersonType.COMPANY, label: 'Pessoa Jurídica' },
] 

export const adversePartyTypeOptions = [
  { value: AdversePartyType.NOT_INFORMED, label: 'Não informado' },
  { value: AdversePartyType.PLAINTIFF, label: 'Autor' },
  { value: AdversePartyType.COPLAINTIFF, label: 'Co-autor' },
  { value: AdversePartyType.DEFENDANT, label: 'Parte contrária' },
  { value: AdversePartyType.THIRD_PARTY_INTERESTED, label: 'Terceiro interessado' },
]
