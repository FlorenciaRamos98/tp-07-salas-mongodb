const express = require("express");

function crearRouterReservas(controladorReservas, middlewareReservas) {
  const router = express.Router();

  router.use(middlewareReservas.prepararAreaReservas);

  router.get("/", controladorReservas.listar);

  router.get("/nueva", controladorReservas.mostrarFormulario);

  router.get("/:id", controladorReservas.detalle);

  router.post(
    "/",
    middlewareReservas.validarReserva,
    controladorReservas.crear,
  );

  return router;
}

module.exports = crearRouterReservas;
