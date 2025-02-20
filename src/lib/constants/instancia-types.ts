export const instanciaOptions = [
  { value: "1", label: "1ª Instância" },
  { value: "2", label: "2ª Instância" },
  { value: "3", label: "Instância Superior" }
] as const

export type Instancia = typeof instanciaOptions[number]["value"] 