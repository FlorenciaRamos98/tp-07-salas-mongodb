const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

async function main() {
  try {
    await conectarBaseDatos();
  } finally {
    await desconectarBaseDatos();
  }
}

main().catch((error) => {
  console.error("No se pudo conectar con MongoDB:", error.name);
  console.error("Detalle:", error.message);

  if (error.code) {
    console.error("Código del error:", error.code);
  }

  if (error.syscall) {
    console.error("Operación:", error.syscall);
  }

  console.error(
    "Revisar la configuración, la red y el acceso a MongoDB Atlas.",
  );

  process.exitCode = 1;
});
