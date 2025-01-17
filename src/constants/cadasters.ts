export enum CadasterStatus {
  Included = 1,
  Excluded = 2,
}

export const CadasterStatusLabels: { [k: number]: string } = {
  [CadasterStatus.Included]: 'Incluído no plano',
  [CadasterStatus.Excluded]: 'Excluído do plano',
};

export const CadasterStatusColor: { [k: number]: string } = {
  [CadasterStatus.Included]: 'green',
  [CadasterStatus.Excluded]: 'orange',
};
