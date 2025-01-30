import { BeneficairyQualification, CommunicationStatus } from "@/constants";

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  type: {
    id: number;
    description: string;
  }
  status: {
    id: number;
    description: string;
  }
  communicationStatus: {
    id: number;
    description: string;
  }
  createdAt: Date;
  communicate: boolean;
  idCommunicationStatus: number;
  document?: string;
  email?: string;
}
