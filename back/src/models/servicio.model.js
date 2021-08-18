/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';
import {categoryValidator} from '../utils/validator.model';

const servicio = new Schema({
  categoria: {
    type: String,
    required: true,
    validate: [categoryValidator, 'No es una categoría valida.'],
  },
  calificacion: {
    min: 0,
    max: 5,
    type: Number,
  },
  precio: {
    type: Number,
    required: true,
    min: 1000,
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 160,
    minlength: 10,
  },
  trabajador: {
    type: Schema.Types.ObjectId,
    ref: 'Trabajador',
    required: true,
  },

}, {collection: 'Servicios'});

servicio.pre('deleteOne', {document: false, query: true}, function() {
  const servicioId = this.getFilter()['_id'];
  Reserva.deleteMany({servicio: servicioId}).then().catch((err) => {
    console.log('Error eliminación servicios trabajador: ', servicioId);
  });
});

export const ServicioModel = model('Servicio', servicio);
