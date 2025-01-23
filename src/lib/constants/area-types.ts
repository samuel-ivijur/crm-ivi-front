export const areaOptions = [
  { value: "civel", label: "CÍVEL" },
  { value: "consumidor", label: "CONSUMIDOR" },
  { value: "criminal", label: "CRIMINAL" },
  { value: "previdenciario", label: "PREVIDENCIÁRIO" },
  { value: "trabalhista", label: "TRABALHISTA" },
  { value: "familia", label: "FAMÍLIA E SUCESSÕES" },
  { value: "saude", label: "SAÚDE/MÉDICO" },
  { value: "estudantil", label: "ESTUDANTIL" },
  { value: "imobiliario", label: "IMOBILIÁRIO" },
  { value: "empresarial", label: "EMPRESARIAL/SOCIETÁRIO" },
  { value: "tributario", label: "TRIBUTÁRIO" },
  { value: "publico", label: "PÚBLICO/ADMINISTRATIVO" },
  { value: "bancario", label: "BANCÁRIO" },
  { value: "constitucional", label: "CONSTITUCIONAL" },
  { value: "propriedade", label: "PROPRIEDADE INTELECTUAL" },
  { value: "digital", label: "DIGITAL" },
  { value: "militar", label: "MILITAR" },
  { value: "condominial", label: "CONDOMINIAL" },
  { value: "ambiental", label: "AMBIENTAL" },
  { value: "eleitoral", label: "ELEITORAL" },
  { value: "desportivo", label: "DESPORTIVO" },
  { value: "notarial", label: "NOTARIAL/REGISTRAL" },
  { value: "sindical", label: "SINDICAL" }
]

export type Area = (typeof areaOptions)[number]["value"] 