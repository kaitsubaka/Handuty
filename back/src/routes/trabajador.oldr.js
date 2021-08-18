/* eslint-disable max-len */
const express = require('express');
const router = new express.Router();
const Trabajador = require('../models/trabajador.model');
const Chat = require('../models/chat.model');
const Servicio = require('../models/servicio.model');
const Reserva = require('../models/reserva.model');

router.get('/', function(req, res, next) {
  Trabajador.find({}).then((trabajadores) => {
    res.send(trabajadores);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id', function(req, res, next) {
  Trabajador.findById(req.params.id).then((trabajador) => {
    if (!trabajador) return res.sendStatus(404);
    res.send(trabajador);
  }).catch((err) => res.status(400).send(err));
});

router.put('/:id', function(req, res, next) {
  Trabajador.replaceOne({'_id': req.params.id}, req.body, {runValidators: true}).then((result) => {
    if (result.nModified === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  }).catch((err) => res.status(400).send(err));
});

router.patch('/:id', function(req, res, next) {
  Trabajador.findOneAndUpdate({'_id': req.params.id}, {$set: req.body}, {runValidators: true}).then((result) => {
    res.sendStatus(200);
  }).catch((err) => res.status(400).send(err));
});

router.post('/', (req, res) => {
  Trabajador.create(req.body).then((trabajador) => {
    res.status(201).send(trabajador);
  }).catch((err) => res.status(400).send(err));
});

router.delete('/:id', (req, res) => {
  Trabajador.deleteOne({_id: req.params.id}).then((resp) => {
        resp.n === 0 ? res.sendStatus(404) : res.sendStatus(204);
  }).catch((err) => res.status(400).send(err));
});


router.get('/:id/chats', (req, res) => {
  Chat.find({trabajador: req.params.id}).then((chats) => {
    res.send(chats);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


router.get('/:id/servicios', (req, res) => {
  Servicio.find({trabajador: req.params.id}).then((servicios) => {
    res.send(servicios);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.post('/login', (req, res) => {
  Trabajador.findOne({correo: req.body.correo}).then((trabajador) => {
    if (!trabajador || trabajador.contrasena !== req.body.contrasena) return res.sendStatus(404);
    res.status(202).send(trabajador);
  }).catch((err) => res.status(400).send(err));
});


router.get('/:id/servicios/reservas', (req, res) => {
  Servicio.find({trabajador: req.params.id}).then((servicios) => {
    const idsServicios = servicios.map((servicio) => servicio._id);
    Reserva.find({servicio: {$in: idsServicios}}).then((reservas) => {
      res.send(reservas);
    }).catch((err) => {
      res.status(400).send(err);
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/servicios/reservas/detalle', (req, res) => {
  Servicio.find({trabajador: req.params.id}).then((servicios) => {
    const idsServicios = servicios.map((servicio) => servicio._id);
    Reserva.find({servicio: {$in: idsServicios}}).populate({path: 'cliente servicio'}).then((reservas) => {
      res.send(reservas);
    }).catch((err) => {
      res.status(400).send(err);
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id/servicios/reservas/detalle/next', (req, res) => {
  Servicio.find({trabajador: req.params.id}).then((servicios) => {
    const idsServicios = servicios.map((servicio) => servicio._id);
    Reserva.find({servicio: {$in: idsServicios}}).populate({path: 'cliente servicio'}).then((reservas) => {
      const now = new Date();
      const finalReservas = reservas.filter((reserva) => reserva.fechaInicio > now);
      res.send(finalReservas);
    }).catch((err) => {
      res.status(400).send(err);
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

module.exports = router;
