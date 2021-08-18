/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';
import {dateValidator} from '../utils/validator.model';
import {ReservaModel} from './reserva.model';
import {ChatModel} from './chat.model';
import {ROLES} from '../constants/rol.const';

const persona = new Schema({
  ciudad: {
    type: String,
    required: true,
    minlength: 1,
  },
  direccion: {
    type: String,
    required: true,
    minlength: 1,
  },
  nombre: {
    type: String,
    required: true,
    minlength: 1,
  },
  contrasena: {
    type: String,
    required: true,
    minlength: 6,
  },
  rol: {
    type: String,
    required: true,
    enum: Object.values(ROLES),
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'],
  },
  telefono: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
    validate: [dateValidator, 'Debe ser mayor de edad'],
  },
  cedula: {
    type: String,
    required: true,
    minlength: 7,
  },
}, {
  versionKey: false,
  collection: 'Clientes',
});

persona.pre('deleteOne', {document: false, query: true}, function() {
  const personaId = this.getFilter()['_id'];
  ReservaModel.deleteMany({persona: personaId}).then().catch((err) => {
    console.log('Error eliminación reservas persona: ', personaId);
  });
  ChatModel.deleteMany({persona: personaId}).then().catch((err) => {
    console.log('Error eliminación chats persona: ', personaId);
  });
});

export const PersonaModel = model('Persona', persona);
