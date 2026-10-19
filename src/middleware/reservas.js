const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const estudiante = (req.body.estudiante || "").trim();
  const email = (req.body.email || "").trim();
  const sala = (req.body.sala || "").trim();
  const fecha = (req.body.fecha || "").trim();
  const turno = (req.body.turno || "").trim();
  const personas = Number(req.body.personas);

  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    !Number.isInteger(personas)
  ) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "Todos los campos son obligatorios y los datos deben ser válidos.",
      datos: req.body,
    });
  }

  if (!email.includes("@")) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "El email debe contener @.",
      datos: req.body,
    });
  }

  if (!salasPermitidas.includes(sala)) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "La sala seleccionada no es válida.",
      datos: req.body,
    });
  }

  if (!["Mañana", "Tarde", "Noche"].includes(turno)) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "El turno seleccionado no es válido.",
      datos: req.body,
    });
  }

  if (personas < 1 || personas > 6) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error: "La cantidad de personas debe estar entre 1 y 6.",
      datos: req.body,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
};
