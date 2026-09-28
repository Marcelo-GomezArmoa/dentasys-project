import { Role, AppStatus } from '@prisma/client';

// Re-exportamos los enums oficiales de la base de datos
export { Role, AppStatus };

// Interfaces para Autenticación y Contexto
export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

// DTOs (Data Transfer Objects) para las peticiones
export interface CreatePatientDTO {
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CreateAppointmentDTO {
  patientId: string;
  professionalId: string;
  chairId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface OdontogramEntryDTO {
  tooth: number;
  surface: string;
  state: string;
}

export interface CreateClinicalAttentionDTO {
  patientId: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  odontogramEntries?: OdontogramEntryDTO[];
}

export interface AuditOdontogramDTO {
  newState: string;
  reason: string;
}