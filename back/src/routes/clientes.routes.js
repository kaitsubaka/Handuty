import express from 'express';
import ClienteModel from '../models/persona.model';
import Chat from '../models/chat.model';
import Reserva from '../models/reserva.model';
const router = new express.Router();

router.get('/', (req, res) => {
  ClienteModel.find({}, (err, clientes) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(clientes);
    }
  });
});

router.post('/', (req, res) => {
  ClienteModel.create(req.body, (err, cliente) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(cliente);
    }
  });
});

router.get('/:clienteId', (req, res) => {
  ClienteModel.findOne({_id: req.params.clienteId}, (err, cliente) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (!cliente) return res.sendStatus(404);
      res.send(cliente);
    }
  });
});

router.delete('/:clienteId', (req, res) => {
  ClienteModel.deleteOne({_id: req.params.clienteId}, (err, resp) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (resp.n === 0) return res.sendStatus(404);
      res.sendStatus(204);
    }
  });
});

router.patch('/:clienteId', (req, res) => {
  ClienteModel.findOneAndUpdate(
      {'_id': req.params.clienteId},
      {$set: req.body},
      {runValidators: true}).then((result) => {
    if (result.nModified === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  }).catch((err) => res.status(400).send(err));
});

router.put('/:clienteId', (req, res) => {
  ClienteModel.replaceOne({
    _id: req.params.clienteId}
  , req.body
  , {runValidators: true}
  , (err, resp) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (resp.nModified === 0) return res.sendStatus(404);
      res.sendStatus(200);
    }
  });
});

router.get('/:id/chats', (req, res) => {
  Chat.find({cliente: req.params.id}).then((chats) => {
    res.send(chats);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/reservas', (req, res) => {
  Reserva.find({cliente: req.params.id}).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/reservas/detalle', (req, res) => {
  Reserva.find({cliente: req.params.id}).populate({
    path: 'servicio', populate: {
      path: 'trabajador',
      model: 'Trabajador',
    },
  }).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/reservas/detalle/next', (req, res) => {
  Reserva.find({cliente: req.params.id}).populate({
    path: 'servicio', populate: {
      path: 'trabajador',
      model: 'Trabajador',
    },
  }).then((reservas) => {
    const now = new Date();
    const reservasFinal = reservas.filter(
        (reserva) => {
          reserva.fechaInicio > now;
        },
    );
    res.send(reservasFinal);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/reservas/detalle/past', (req, res) => {
  Reserva.find({cliente: req.params.id}).populate({
    path: 'servicio', populate: {
      path: 'trabajador',
      model: 'Trabajador',
    },
  }).then((reservas) => {
    const now = new Date();
    const reservasFinal = reservas.filter((reserva) => {
      reserva.fechaInicio < now;
    });
    res.send(reservasFinal);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.post('/login', (req, res) => {
  ClienteModel.findOne({correo: req.body.correo}).then((cliente) => {
    if (!cliente || cliente.contrasena !== req.body.contrasena) {
      return res.sendStatus(404);
    }
    res.status(202).send(cliente);
  }).catch((err) => res.status(400).send(err));
});

module.exports = router;
