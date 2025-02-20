export type LitigationTableAction = {
  id: string
  action: 'changeMonitoring' | 'deleteLitigation' | 'archiveLitigation'
}