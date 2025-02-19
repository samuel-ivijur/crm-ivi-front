export const addressService = {
    getCep: async (cep: string): Promise<GetCep.Response> => {
        if (cep.length < 8) return null

        const cleanCep = cep.replace(/\D/g, '')
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data: GetCep.ResponseAPI = await response.json()

        return {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
        }

    }
}

export namespace GetCep {
    export type ResponseAPI = {
        logradouro: string
        bairro: string
        localidade: string
        uf: string
    }

    export type Response = {
        street: string
        neighborhood: string
        city: string
        state: string
    } | null
}