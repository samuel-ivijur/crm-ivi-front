export interface Process {
  id: string
  number: string
  instance: string
}

export interface Client {
  id: string
  name: string
  document: string // CPF ou CNPJ
  phone: string
  email: string
  date: string // Alterado de createdAt para date
  status: "Ativo" | "Inativo"
  communication: "Ativa" | "Inativa"
  enabled: "Aceite" | "Não aceite"
  processes: Process[]
} 