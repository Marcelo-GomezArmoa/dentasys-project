import { Router } from "express";
import {
  createAttention,
  auditOdontogramEntry,
  getPatientHistory,
} from "../controllers/clinical.controller";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";
import { Role } from "../types";

const router = Router();
router.use(authenticateToken);

router.post("/attentions", requireRole([Role.DENTIST]), createAttention);
router.post(
  "/odontogram/:entryId/audit",
  requireRole([Role.DENTIST]),
  auditOdontogramEntry,
);
router.get(
  "/patients/:patientId/history",
  requireRole([Role.DENTIST]),
  getPatientHistory,
);

export default router;
