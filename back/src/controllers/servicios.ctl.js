
import {PersonaModel} from '../models/persona.model';
import {ReservaModel} from '../models/reserva.model';
import {ServicioModel} from '../models/servicio.model';
import {Categorias} from '../constants/categories.const';


export const getServices = (req, res) => {
  ServicioModel.find({}).then((servicios) => {
    res.send(servicios);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getServicesDetail = (req, res) => {
  ServicioModel.find({}).populate({path: 'trabajador'}).then((servicios) => {
    res.send(servicios);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getCategorias = (req, res) => {
  res.send(Categorias);
};

export const getService = (req, res) => {
  ServicioModel.find(req.params.id).then((servicio) => {
    if (!servicio) return res.status(404).send('ServicioModel no encontrado');
    res.send(servicio);
  }).catch((err) => res.status(400).send(err));
};


export const updateService = (req, res) => {
  ServicioModel.replaceOne(
      {'_id': req.params.id}, req.body, {runValidators: true})
      .then((result) => {
        if (result.nModified === 0) {
          return res.sendStatus(404);
        }
        res.sendStatus(200);
      }).catch((err) => res.status(400).send(err));
};

export const patchService = (req, res) => {
  ServicioModel.findOneAndUpdate(
      {'_id': req.params.id}, {$set: req.body}, {runValidators: true}).
      then((result) => {
        res.sendStatus(200);
      }).catch((err) => res.status(400).send(err));
};

export const createService = (req, res) => {
  PersonaModel.find(req.body.trabajador).then((trabajador) => {
    if (!trabajador) return res.status(404).send('PersonaModel no encontrado');
    ServicioModel.findOne(
        {trabajador: trabajador._id, categoria: req.body.categoria})
        .then((servicio) => {
          console.log('servicio ', servicio);
          if (servicio) {
            return res.status(400)
                .send('El trabajador ya ofrece este servicio.');
          }
          ServicioModel.create(req.body).then((servicio) => {
            res.status(201).send(servicio);
          }).catch((err) => {
            res.status(400).send(err);
          });
        }).catch((err) => {
          res.status(400).send(err);
        });
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const deleteService = (req, res) => {
  ServicioModel.deleteOne({_id: req.params.id}).then((resp) => {
        resp.n === 0 ? res.sendStatus(404) : res.sendStatus(204);
  }).catch((err) => res.status(400).send(err));
};

export const getServiceReservas = (req, res) => {
  ReservaModel.find({servicio: req.params.id}).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getServiceReservasNext = (req, res) => {
  ReservaModel.find({servicio: req.params.id}).then((reservas) => {
    const now = new Date();
    const reservasFinal = reservas.filter(
        (reserva) => reserva.fechaInicio > now);
    res.send(reservasFinal);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getCategoria = (req, res) => {
  ServicioModel.find({
    categoria: req.params.categoria}).
      populate({path: 'trabajador'}).then((servicios) => {
        res.send(servicios);
      }).catch((err) => {
        res.status(400).send(err);
      });
};
