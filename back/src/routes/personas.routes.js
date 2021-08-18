import express from 'express';
import PersonaModel from '../models/persona.model';
import ChatModel from '../models/chat.model';
import ReservaModel from '../models/reserva.model';
const router = new express.Router();

router.get('/', (req, res) => {
  PersonaModel.find({}, (err, clientes) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(clientes);
    }
  });
});

router.post('/', (req, res) => {
  PersonaModel.create(req.body, (err, cliente) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(cliente);
    }
  });
});

router.get('/:personaId', (req, res) => {
  PersonaModel.findOne({_id: req.params.personaId}, (err, cliente) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (!cliente) return res.sendStatus(404);
      res.send(cliente);
    }
  });
});

router.delete('/:personaId', (req, res) => {
  PersonaModel.deleteOne({_id: req.params.personaId}, (err, resp) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (resp.n === 0) return res.sendStatus(404);
      res.sendStatus(204);
    }
  });
});

router.patch('/:personaId', (req, res) => {
  PersonaModel.findOneAndUpdate(
      {'_id': req.params.personaId},
      {$set: req.body},
      {runValidators: true}).then((result) => {
    if (result.nModified === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  }).catch((err) => res.status(400).send(err));
});

router.put('/:personaId', (req, res) => {
  PersonaModel.replaceOne({
    _id: req.params.personaId}
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
  ChatModel.find({cliente: req.params.id}).then((chats) => {
    res.send(chats);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/reservas', (req, res) => {
  ReservaModel.find({cliente: req.params.id}).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/reservas/detalle', (req, res) => {
  ReservaModel.find({cliente: req.params.id}).populate({
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
  ReservaModel.find({cliente: req.params.id}).populate({
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
  ReservaModel.find({cliente: req.params.id}).populate({
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
  PersonaModel.findOne({correo: req.body.correo}).then((cliente) => {
    if (!cliente || cliente.contrasena !== req.body.contrasena) {
      return res.sendStatus(404);
    }
    res.status(202).send(cliente);
  }).catch((err) => res.status(400).send(err));
});

export const PersonaRouter = router;
