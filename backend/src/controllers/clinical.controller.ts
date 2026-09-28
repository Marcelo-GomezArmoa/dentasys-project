import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const createAttention = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const professionalId = req.user!.id;
    const { patientId, diagnosis, treatment, notes, odontogramEntries } =
      req.body;

    const attention = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const createdAttention = await tx.clinicalAttention.create({
          data: {
            patientId,
            professionalId,
            diagnosis,
            treatment,
            notes,
          },
        });

        if (
          odontogramEntries &&
          Array.isArray(odontogramEntries) &&
          odontogramEntries.length > 0
        ) {
          await tx.odontogramEntry.createMany({
            data: odontogramEntries.map(
              (entry: { tooth: number; surface: string; state: string }) => ({
                clinicalAttentionId: createdAttention.id,
                tooth: entry.tooth,
                surface: entry.surface,
                state: entry.state,
              }),
            ),
          });
        }

        return createdAttention;
      },
    );

    res.status(201).json(attention);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar atención clínica", error });
  }
};

export const auditOdontogramEntry = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { entryId } = req.params;
    const { newState, reason } = req.body;

    if (!reason || reason.trim() === "") {
      res
        .status(400)
        .json({ message: "El motivo de la corrección clínica es obligatorio" });
      return;
    }

    const existingEntry = await prisma.odontogramEntry.findUnique({
      where: { id: entryId },
    });

    if (!existingEntry) {
      res.status(404).json({ message: "Entrada de odontograma no encontrada" });
      return;
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const audit = await tx.odontogramAudit.create({
          data: {
            odontogramEntryId: entryId,
            userId,
            previousState: existingEntry.state,
            newState,
            reason,
          },
        });

        const updated = await tx.odontogramEntry.update({
          where: { id: entryId },
          data: { state: newState },
        });

        return { updated, audit };
      },
    );

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al auditar entrada odontológica", error });
  }
};

export const getPatientHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { patientId } = req.params;

    const history = await prisma.clinicalAttention.findMany({
      where: { patientId },
      include: {
        professional: { select: { firstName: true, lastName: true } },
        odontogram: {
          include: {
            audits: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
      orderBy: { attendedAt: "desc" },
    });

    res.json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener historial clínico", error });
  }
};
