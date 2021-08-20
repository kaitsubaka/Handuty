/* eslint-disable require-jsdoc */
export const Categorias = [
  'Carpintería',
  'Cerrajería',
  'Electricista',
  'Fumigación',
  'Jardinería',
  'Limpieza',
  'Mascotas',
  'Mantenimiento',
  'Pintura',
  'Plomería',
  'Seguridad',
];


export function categoryValidator(category) {
  return Categorias.includes(category);
}


export function dateValidator(date) {
  return new Date().getFullYear() - date.getFullYear() >= 18;
}


export function verifyDatesService(req, res, callback) {
  const {fechaInicio, fechaFin, servicio} = req.body;
  const fechaI = new Date(fechaInicio);
  const fechaF = new Date(fechaFin);
  ReservaModel.find({servicio: servicio}).then((reservas) => {
    reservas.filter((reserva) => reserva.fechaInicio >= new Date())
        .forEach((reserva) => {
          const from = reserva.fechaInicio;
          const to = reserva.fechaFin;
          if ((from <= fechaI && fechaI < to) ||
           (from < fechaF && fechaF <= to)) {
            return res.status(400).send('Fecha ya ocupada');
          }
        });
    callback();
  }).catch((err) => {
    res.status(400).send(err);
  });
};
