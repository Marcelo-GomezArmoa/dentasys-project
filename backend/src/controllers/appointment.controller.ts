import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppStatus, CreateAppointmentDTO } from "../types";

export const createAppointment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data: CreateAppointmentDTO = req.body;

    const appointmentDate = new Date(data.date);
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    const chair = await prisma.chair.findFirst({
      where: { id: data.chairId, isActive: true },
    });

    if (!chair) {
      res
        .status(400)
        .json({ message: "El sillón seleccionado no está operativo" });
      return;
    }

    const [overlappingChair, overlappingProfessional] = await Promise.all([
      prisma.appointment.findFirst({
        where: {
          date: appointmentDate,
          chairId: data.chairId,
          status: { not: AppStatus.CANCELADO },
          AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
        },
      }),
      prisma.appointment.findFirst({
        where: {
          date: appointmentDate,
          professionalId: data.professionalId,
          status: { not: AppStatus.CANCELADO },
          AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
        },
      }),
    ]);

    if (overlappingChair && overlappingProfessional) {
      res.status(409).json({
        message:
          "Conflicto de agenda: tanto el sillón como el profesional ya se encuentran ocupados en ese horario.",
      });
      return;
    }

    if (overlappingChair) {
      res.status(409).json({
        message:
          "Conflicto de agenda: el sillón seleccionado ya se encuentra ocupado en ese horario.",
      });
      return;
    }

    if (overlappingProfessional) {
      res.status(409).json({
        message:
          "Conflicto de agenda: el profesional ya tiene asignado otro turno en ese horario.",
      });
      return;
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        professionalId: data.professionalId,
        chairId: data.chairId,
        date: appointmentDate,
        startTime: start,
        endTime: end,
        status: AppStatus.PROGRAMADO,
      },
      include: {
        patient: true,
        chair: true,
        professional: { select: { firstName: true, lastName: true } },
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar turno", error });
  }
};

export const getAppointments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { date } = req.query;
    const whereClause: any = {};
    if (date) {
      whereClause.date = new Date(date as string);
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: true,
        chair: true,
        professional: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { startTime: "asc" },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error al listar turnos", error });
  }
};
