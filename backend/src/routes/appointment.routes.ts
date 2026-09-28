import { Router } from "express";
import {
  createAppointment,
  getAppointments,
} from "../controllers/appointment.controller";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";
import { Role } from "../types";

const router = Router();
router.use(authenticateToken);

router.post(
  "/",
  requireRole([Role.RECEPTION, Role.DENTIST]),
  createAppointment,
);
router.get(
  "/",
  requireRole([Role.ADMIN, Role.RECEPTION, Role.DENTIST]),
  getAppointments,
);

export default router;
