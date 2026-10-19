function crearServicioReservas(datosIniciales) {
  const reservas = [...datosIniciales];

  function listar() {
    return reservas;
  }

  function buscarPorId(id) {
    return reservas.find((reserva) => reserva.id === id);
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const nuevoId =
      reservas.length > 0
        ? Math.max(...reservas.map((reserva) => reserva.id)) + 1
        : 1;

    const nuevaReserva = {
      id: nuevoId,
      ...datos,
    };

    reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = crearServicioReservas;
