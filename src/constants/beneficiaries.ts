export const BeneficairyQualification: { [k: string]: number } = {
  resorted: 1,
  recurrent: 2,
  defendant_executed: 3,
  author_executed: 4, 
  defendant: 5,
  author: 6,
};

export const BeneficiaryQualificationLabels: { [k: number]: string } = {
  1: 'Recorrido',
  2: 'Recorrente',
  3: 'Réu/Executado',
  4: 'Autor/Exequente',
  5: 'Réu',
  6: 'Autor',
};

export const BeneficiaryStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
};