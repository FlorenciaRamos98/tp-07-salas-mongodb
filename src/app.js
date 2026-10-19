const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");

const middlewareSolicitudes = require("./middleware/solicitudes");

function crearApp(servicioReservas, configuracion, routerReservas) {
  const app = express();

  const formatoMorgan =
    configuracion.nodeEnv === "production" ? "combined" : "dev";

  app.use(morgan(formatoMorgan));
  app.use(middlewareSolicitudes.identificarSolicitud);
  app.use(middlewareSolicitudes.medirDuracion);

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", {
      title: "Reservas de salas de estudio",
    });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      reservas: servicioReservas.contar(),
      solicitudId: res.locals.solicitudId,
    });
  });

  app.use("/reservas", routerReservas);

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = crearApp;
