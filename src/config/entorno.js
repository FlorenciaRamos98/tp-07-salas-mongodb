function obtenerConfiguracion() {
  const puerto = process.env.PORT || "3000";
  const port = Number(puerto);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "Configuración inválida: PORT debe ser un número entero entre 1 y 65535.",
    );
  }

  const nodeEnv = process.env.NODE_ENV || "development";
  const mongodbUri = process.env.MONGODB_URI || "";

  return {
    port,
    nodeEnv,
    mongodbUri,
  };
}

module.exports = obtenerConfiguracion;
