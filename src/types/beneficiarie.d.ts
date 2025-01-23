import { BeneficairyQualification, CommunicationStatus } from "@/constants";

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  idQualification: ValueOf<typeof BeneficairyQualification>;
  idCommunicationStatus?: ValueOf<typeof CommunicationStatus>;
  message?: string;
}
