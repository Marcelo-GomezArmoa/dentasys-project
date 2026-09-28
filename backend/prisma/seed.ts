import process from "process";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando carga de datos iniciales en Neon...");

  // Limpieza inicial para evitar duplicados en ejecuciones repetidas
  await prisma.odontogramAudit.deleteMany();
  await prisma.odontogramEntry.deleteMany();
  await prisma.clinicalAttention.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.chair.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);

  // 1. Usuarios por rol (HU-1.1)
  const admin = await prisma.user.create({
    data: {
      email: "admin@dentasys.com",
      firstName: "Admin",
      lastName: "Principal",
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const dentist = await prisma.user.create({
    data: {
      email: "dentist@dentasys.com",
      firstName: "Dra. María",
      lastName: "González",
      passwordHash,
      role: Role.DENTIST,
      isActive: true,
    },
  });

  const reception = await prisma.user.create({
    data: {
      email: "reception@dentasys.com",
      firstName: "Lucas",
      lastName: "Recepcionista",
      passwordHash,
      role: Role.RECEPTION,
      isActive: true,
    },
  });

  // 2. Sillones de atención (HU-3.1)
  const chair1 = await prisma.chair.create({
    data: { name: "Sillón Principal 1", isActive: true },
  });

  const chair2 = await prisma.chair.create({
    data: { name: "Sillón Quirúrgico 2", isActive: true },
  });

  // 3. Paciente testigo para pruebas inmediatas (HU-2.1)
  const patient = await prisma.patient.create({
    data: {
      dni: "35123456",
      firstName: "Carlos",
      lastName: "Pérez",
      phone: "3515551234",
      isActive: true,
    },
  });

  console.log("--- Seed completado con éxito ---");
  console.log(`- Administrador: ${admin.email}`);
  console.log(`- Odontólogo: ${dentist.email}`);
  console.log(`- Recepción: ${reception.email}`);
  console.log(`- Clave común para todos: admin123`);
  console.log(
    `- Sillones creados: ${chair1.name} (ID: ${chair1.id}), ${chair2.name} (ID: ${chair2.id})`,
  );
  console.log(
    `- Paciente testigo: ${patient.firstName} ${patient.lastName} (ID: ${patient.id}, DNI: ${patient.dni})`,
  );
}

main()
  .catch((e) => {
    console.error("Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
