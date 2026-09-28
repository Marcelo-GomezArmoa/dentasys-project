import { Router } from "express";
import { createPatient, getPatients } from "../controllers/patient.controller";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";
import { Role } from "../types";

const router = Router();
router.use(authenticateToken);

router.post(
  "/",
  requireRole([Role.ADMIN, Role.RECEPTION, Role.DENTIST]),
  createPatient,
);
router.get(
  "/",
  requireRole([Role.ADMIN, Role.RECEPTION, Role.DENTIST]),
  getPatients,
);

export default router;
