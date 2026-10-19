const obtenerConfiguracion = require("./config/entorno");
const crearApp = require("./app");
const crearServicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const crearRouterReservas = require("./rutas/reservas");
const middlewareReservas = require("./middleware/reservas");

const reservasIniciales = [
  {
    id: 1,
    estudiante: "Florencia Ramos",
    email: "florencia@example.com",
    sala: "Sala Norte",
    fecha: "2026-10-01",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Juan Pérez",
    email: "juan@example.com",
    sala: "Sala Sur",
    fecha: "2026-10-02",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "María López",
    email: "maria@example.com",
    sala: "Sala Multimedia",
    fecha: "2026-10-03",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Carlos Gómez",
    email: "carlos@example.com",
    sala: "Sala Norte",
    fecha: "2026-10-04",
    turno: "Mañana",
    personas: 1,
  },
];

function iniciarServidor() {
  let configuracion;

  try {
    configuracion = obtenerConfiguracion();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const servicioReservas = crearServicioReservas(reservasIniciales);

  const controladorReservas = crearControladorReservas(servicioReservas);

  const routerReservas = crearRouterReservas(
    controladorReservas,
    middlewareReservas,
  );

  const app = crearApp(servicioReservas, configuracion, routerReservas);

  app.listen(configuracion.port, () => {
    console.log(`Servidor iniciado en http://localhost:${configuracion.port}`);
  });
}

iniciarServidor();
