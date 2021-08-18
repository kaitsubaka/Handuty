/* eslint-disable require-jsdoc */
const express = require('express');
const Reserva = require('../models/reserva.model');
const Cliente = require('../models/persona.model');
const Servicio = require('../models/servicio.model');
const router = new express.Router();

router.get('/', function(req, res, next) {
  Reserva.find({}).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

router.get('/:id', function(req, res, next) {
  Reserva.findById(req.params.id).then((reserva) => {
    if (!reserva) return res.sendStatus(404);
    res.send(reserva);
  }).catch((err) => res.status(400).send(err));
});

router.put('/:id', function(req, res, next) {
  Reserva.replaceOne(
      {'_id': req.params.id},
      req.body,
      {runValidators: true}).then((result) => {
    if (result.nModified === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  }).catch((err) => {
    return res.status(400).send(err);
  });
});


router.patch('/:id', function(req, res, next) {
  Reserva.findOneAndUpdate(
      {'_id': req.params.id},
      {$set: req.body},
      {runValidators: true}).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    return res.status(400).send(err);
  });
});


router.post('/', function(req, res, next) {
  verifyDatesService(req, res, () => {
    Cliente.findById(req.body.cliente).then((cliente) => {
      if (!cliente) return res.status(404).send('Cliente no encontrado');
      Servicio.findById(req.body.servicio).then((servicio) => {
        if (!servicio) return res.status(404).send('Servicio no encontrado');
        Reserva.create(req.body).then((trabajador) => {
          res.status(201).send(trabajador);
        }).catch((err) => res.status(400).send(err));
      }).catch((err) => res.status(400).send(err));
    }).catch((err) => res.status(400).send(err));
  });
});


router.delete('/:id', (req, res) => {
  Reserva.deleteOne({_id: req.params.id}).then((resp) => {
        resp.n === 0 ? res.sendStatus(404) : res.sendStatus(204);
  }).catch((err) => res.status(400).send(err));
});


function verifyDatesService(req, res, callback) {
  const {fechaInicio, fechaFin, servicio} = req.body;
  const fechaI = new Date(fechaInicio);
  const fechaF = new Date(fechaFin);
  Reserva.find({servicio: servicio}).then((reservas) => {
    reservas.filter((reserva) => reserva.fechaInicio >= new Date())
        .forEach((reserva) => {
          const from = reserva.fechaInicio;
          const to = reserva.fechaFin;
          if ((from <= fechaI && fechaI < to) ||
           (from < fechaF && fechaF <= to)) {
            return res.status(400).send('Fecha ya ocupada');
          }
        });
    callback();
  }).catch((err) => {
    res.status(400).send(err);
  });
}
