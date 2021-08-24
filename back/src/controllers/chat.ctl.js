import {ChatModel} from '../models/chat.model';
import {MensajeModel} from '../models/mensaje.model';
import {PersonaModel} from '../models/persona.model';

export const getChats = (req, res) => {
  ChatModel.find({}, (err, chats) => {
        err ? res.status(400).send(err) : res.send(chats);
  });
};

export const getChat = (req, res) => {
  ChatModel.find(req.params.chatId, (err, chat) => {
    if (err) return res.status(400).send(err);
    else if (!chat) return res.sendStatus(404);
    res.send(chat);
  });
};

export const createChat = (req, res) => {
  PersonaModel.find(req.body.cliente, (err, cliente) => {
    if (err) return res.status(400).send(err);
    if (cliente != null) {
      PersonaModel.find(req.body.trabajador, (err, trabajador) => {
        if (err) return res.status(400).send(err);
        if (trabajador != null) {
          ChatModel.create(req.body, (err, chat) => {
                        err ?
                        res.status(400).send(err) :
                        res.status(201).send(chat);
          });
        } else {
          res.status(404).send('Trabajador no encontrado.');
        }
      });
    } else {
      res.status(404).send('Cliente no encontrado.');
    }
  });
};

export const deleteChat = (req, res) => {
  ChatModel.deleteOne({_id: req.params.chatId}, (err, resp) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (resp.n === 0) return res.sendStatus(404);
      res.sendStatus(204);
    }
  });
};

export const patchChat = (req, res) => {
  ChatModel.findOneAndUpdate(
      {_id: req.params.chatId},
      {$set: req.body},
      {runValidators: true},
      (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.sendStatus(200);
        }
      });
};


export const updateChat = (req, res) => {
  ChatModel.replaceOne(
      {_id: req.params.chatId}, req.body,
      {runValidators: true},
      (err, resp) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (resp.nModified === 0) return res.sendStatus(404);
          res.sendStatus(200);
        }
      });
};


export const getChatMessages = (req, res) => {
  MensajeModel.find({chat: req.params.id}).then((mensajes) => {
    res.send(mensajes);
  }).catch((err) => {
    res.status(400).send(err);
  });
};
