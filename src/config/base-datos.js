const dns = require("node:dns");
const mongoose = require("mongoose");
const obtenerConfiguracion = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  const { mongodbUri } = obtenerConfiguracion();

  if (!mongodbUri) {
    throw new Error("Configuración inválida: falta la variable MONGODB_URI.");
  }

  if (!mongodbUri.startsWith("mongodb+srv://")) {
    throw new Error(
      "Configuración inválida: MONGODB_URI no tiene un prefijo válido.",
    );
  }

  await mongoose.connect(mongodbUri);
  console.log("Conexión con MongoDB establecida.");
}

async function desconectarBaseDatos() {
  await mongoose.disconnect();
}

module.exports = {
  conectarBaseDatos,
  desconectarBaseDatos,
};
