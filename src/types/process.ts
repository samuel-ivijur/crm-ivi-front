export interface ProcessFormData {
  processData: {
    status: boolean
    cnjNumber: string
    instance: string
    value: string
    alternativeNumber: string
    distributionDate: string
    distributionType: string
    area: string
    subject: string
    extraSubject: string
    state: string
    county: string
    court: string
    courtSystem: string
  }
  parties: Party[]
  deadlines: Deadline[]
  relatedProcesses: RelatedProcess[]
  client: ClientData
}

export interface Party {
  id: number
  name: string
  cnpj: string
  personType: string
  partyType: string
}

export interface Deadline {
  id: number
  name: string
  responsible: string
  date: string
  time: string
  priority: string
  status: "Pendente" | "Concluído" | "Cancelado"
}

export interface RelatedProcess {
  id: number
  number: string
  instance: string
}

export interface ClientData {
  isNewClient: boolean
  name?: string
  phone?: string
  email?: string
  qualification: string
  identification?: string
  selectedClientId?: string
} 