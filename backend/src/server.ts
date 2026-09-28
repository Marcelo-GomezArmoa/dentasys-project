import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(` Servidor DentaSys activo en puerto ${PORT}`);
  console.log(` Healthcheck: http://localhost:${PORT}/health`);
  console.log(`==========================================`);
});
