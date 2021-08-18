import {Schema, model} from 'mongoose';

const mensaje = new Schema({
  contenido: {
    type: String,
    required: true,
    minlength: 1,
  },
  remitente: {
    type: Schema.Types.ObjectId, ref: 'Persona',
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },

}, {
  timestamps: true,
  versionKey: false,
  collection: 'Mensajes',
});


export const MensajeModel = model('Mensaje', mensaje);
