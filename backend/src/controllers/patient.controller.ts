import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createPatient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { dni, firstName, lastName, phone } = req.body;

    const existing = await prisma.patient.findUnique({ where: { dni } });
    if (existing) {
      res.status(400).json({ message: "Ya existe un paciente con ese DNI" });
      return;
    }

    const patient = await prisma.patient.create({
      data: { dni, firstName, lastName, phone, isActive: true },
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar paciente", error });
  }
};

export const getPatients = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      where: { isActive: true },
      orderBy: { lastName: "asc" },
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pacientes", error });
  }
};
