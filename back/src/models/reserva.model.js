/* eslint-disable no-invalid-this */

import {Schema, model} from 'mongoose';
const reservaSchema = new Schema({
  fechaInicio: {type: Date, required: true},
  fechaFin: {
    type: Date, required: true, validate: [function(value) {
      return this.fechaInicio < value;
    }, 'End date must be after start date'],
  },
  qr: {type: String},
  calificacion: {type: Number, min: 0, max: 5},
  precio: {type: Number, required: true, min: 1000},
  servicio: {type: Schema.Types.ObjectId, ref: 'Servicio', required: true},
  cliente: {type: Schema.Types.ObjectId, ref: 'Persona', required: true},
}, {collection: 'Reservas'});


export const ReservaModel = model('Reserva', reservaSchema);
