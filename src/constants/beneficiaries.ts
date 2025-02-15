export const BeneficairyQualification: { [k: string]: number } = {
  resorted: 1,
  recurrent: 2,
  defendant_executed: 3,
  author_executed: 4, 
  defendant: 5,
  author: 6,
  third_interested: 7,
  legal_representative: 8,
};

export const BeneficiaryQualificationLabels: { [k: number]: string } = {
  1: 'Recorrido',
  2: 'Recorrente',
  3: 'Réu/Executado',
  4: 'Autor/Exequente',
  5: 'Réu',
  6: 'Autor',
  7: 'Terceiro Interessado',
  8: 'Representante Legal',
};

export const BeneficiaryStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const BeneficiaryStatusLabels: { [k: number]: string } = {
  1: 'Ativo',
  2: 'Inativo',
};

const blackList = [
  BeneficairyQualification.defendant,
  BeneficairyQualification.author,
]

export const BeneficiaryQualificationOptions = Object.values(BeneficairyQualification)
  .filter(qualification => !blackList.includes(qualification))
  .map(qualification => ({
    value: qualification,
    label: BeneficiaryQualificationLabels[qualification],
  }))