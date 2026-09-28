import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role, JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "dentasys_super_secret_key_2026";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Token inválido o expirado" });
      return;
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Acceso denegado: permisos insuficientes para esta operación",
      });
      return;
    }
    next();
  };
};
