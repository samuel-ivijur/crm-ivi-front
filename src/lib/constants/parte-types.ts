export const tiposParteOptions = [
  { value: "autor", label: "Autor/Exequente" },
  { value: "reu", label: "Réu/Executado" },
  { value: "terceiro", label: "Terceiro Interessado" },
  { value: "representante", label: "Representante legal" },
  { value: "recorrente", label: "Recorrente" },
  { value: "recorrido", label: "Recorrido" }
] as const

export type TipoParte = typeof tiposParteOptions[number]["value"] 