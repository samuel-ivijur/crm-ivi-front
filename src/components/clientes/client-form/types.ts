export type LitigationClient = {
    id: string
    processNumber: string
    instance: number
}

export interface FormData {
    name: string
    type?: number
    document?: string
    email?: string
    phone?: string
    birthDate?: string
    status: boolean
    communicate: boolean
    nick?: string
    address: {
        cep: string
        street: string
        number: string
        complement: string
        neighborhood: string
        city: string
        state: string
    }
    litigations: LitigationClient[]
}
export type StepId = "step-1" | "step-2"

export interface Step {
    id: StepId
    name: string
    fields: string[]
}

export const steps: Step[] = [
    {
        id: "step-1",
        name: "Dados do Cliente",
        fields: ["name", "document", "email", "phone", "birthDate", "type", "address"]
    },
    {
        id: "step-2",
        name: "Vincular Processo",
        fields: ["processNumber", "instance"]
    }
]


