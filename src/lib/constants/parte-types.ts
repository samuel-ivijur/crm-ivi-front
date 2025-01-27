export const tiposParteOptions = [
  { value: 1, label: "Autor/Exequente" },
  { value: 2, label: "Réu/Executado" },
  { value: 3, label: "Terceiro Interessado" },
  { value: 4, label: "Representante legal" },
  { value: 5, label: "Recorrente" },
  { value: 6, label: "Recorrido" }
] as const

export type TipoParte = typeof tiposParteOptions[number]["value"] 