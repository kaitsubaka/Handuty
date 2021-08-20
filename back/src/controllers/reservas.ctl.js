import {ReservaModel} from '../models/reserva.model';
import {PersonaModel} from '../models/persona.model';
import {ServicioModel} from '../models/servicio.model';
import {verifyDatesService} from '../utils/validator';


export const getReservas = (req, res) => {
  ReservaModel.find({}).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getReservaById = (req, res) => {
  ReservaModel.findById(req.params.id).then((reserva) => {
    if (!reserva) return res.sendStatus(404);
    res.send(reserva);
  }).catch((err) => res.status(400).send(err));
};

export const updateReserva = (req, res) => {
  ReservaModel.replaceOne(
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
};


export const patchReserva = (req, res) => {
  ReservaModel.findOneAndUpdate(
      {'_id': req.params.id},
      {$set: req.body},
      {runValidators: true}).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    return res.status(400).send(err);
  });
};


export const createReserva = (req, res) => {
  verifyDatesService(req, res, () => {
    PersonaModel.findById(req.body.cliente).then((cliente) => {
      if (!cliente) return res.status(404).send('PersonaModel no encontrado');
      ServicioModel.findById(req.body.servicio).then((servicio) => {
        if (!servicio) {
          return res.status(404).send('ServicioModel no encontrado');
        };
        ReservaModel.create(req.body).then((trabajador) => {
          res.status(201).send(trabajador);
        }).catch((err) => res.status(400).send(err));
      }).catch((err) => res.status(400).send(err));
    }).catch((err) => res.status(400).send(err));
  });
};


export const deleteReserva = (req, res) => {
  ReservaModel.deleteOne({_id: req.params.id}).then((resp) => {
        resp.n === 0 ? res.sendStatus(404) : res.sendStatus(204);
  }).catch((err) => res.status(400).send(err));
};


