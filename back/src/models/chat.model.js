/* eslint-disable no-invalid-this */
import {Schema, model} from 'mongoose';
import {MensajeModel} from './mensaje.model';

const chat = new Schema({
  fecha: {
    type: Date,
    required: true,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Persona',
    required: true,
  },
  trabajador: {
    type: Schema.Types.ObjectId,
    ref: 'Persona',
    required: true,
  },
}, {
  versionKey: false,
  collection: 'Chats',
});

chat.pre('deleteOne', {document: false, query: true}, function() {
  const chatId = this.getFilter()['_id'];
  MensajeModel.deleteMany({chat: chatId}).then().catch((err) => {
    console.log('Error eliminación mensajes chat: ', chatId);
  });
});

export const ChatModel = model('Chat', chat);
