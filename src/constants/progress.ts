export enum ProgressStatus {
  PENDING = 1,
  READ = 2,
  UNREAD = 3,
}

export const ProgressStatusLabels: { [k: number]: string } = {
  [ProgressStatus.READ]: 'Lido',
  [ProgressStatus.PENDING]: 'Pendente',
  [ProgressStatus.UNREAD]: 'Não Lido',
};
