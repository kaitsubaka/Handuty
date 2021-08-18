import express from 'express';
import MensajeModel from '../models/mensaje.model';
import ChatModel from '../models/chat.model';
const router = new express.Router();
// obtener mensajes de un chat
router.get('/', (req, res) => {
  MensajeModel.find({}, (err, mensajes) => {
        err ? res.status(400).send(err) : res.send(mensajes);
  });
});

// obtener un mensaje de un chat
router.get('/:mensajeId', (req, res) => {
  MensajeModel.findById(req.params.mensajeId, (err, mensaje) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (!mensaje) return res.sendStatus(404);
      res.send(mensaje);
    }
  });
});

// crear un nuevo mensaje en un chat
router.post('/', (req, res) => {
  ChatModel.findById(req.body.chat, (err, chat) => {
    if (err) return res.status(400).send(err);
    if (chat != null) {
      MensajeModel.create(req.body, (err, mensaje) => {
                err ? res.status(400).send(err) : res.status(201).send(mensaje);
      });
    } else {
      res.status(404).send('Chat no encontrado');
    }
  });
});

// borrar un mensaje de un chat
router.delete('/:mensajeId', (req, res) => {
  MensajeModel.deleteOne({_id: req.params.mensajeId}, (err, resp) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (resp.n === 0) return res.sendStatus(404);
      res.sendStatus(204);
    }
  }).catch(console.log);
});


router.patch('/:mensajeId', (req, res) => {
  MensajeModel.findOneAndUpdate(
      {_id: req.params.mensajeId},
      {$set: req.body}, {runValidators: true},
      (err, resp) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (resp.nModified === 0) return res.sendStatus(404);
          res.sendStatus(200);
        }
      });
});

router.put('/:mensajeId', (req, res) => {
  MensajeModel.replaceOne(
      {_id: req.params.mensajeId},
      req.body,
      {runValidators: true},
      (err, resp) => {
        if (err) {
          res.status(400).send(err);
        } else {
          if (resp.nModified === 0) return res.sendStatus(404);
          res.sendStatus(200);
        }
      });
});

export const MensajeRouter = router;
