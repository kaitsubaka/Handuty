import {PersonaModel} from '../models/persona.model';
import {ChatModel} from '../models/chat.model';
import {ReservaModel} from '../models/reserva.model';
import {ServicioModel} from '../models/servicio.model';

export const getPersonas = (req, res) => {
  PersonaModel.find({}, (err, personas) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(personas);
    }
  });
};

export const createPersona = (req, res) => {
  PersonaModel.create(req.body, (err, cliente) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(cliente);
    }
  });
};

export const getPersona = (req, res) => {
  PersonaModel.findOne({_id: req.params.personaId}, (err, cliente) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (!cliente) return res.sendStatus(404);
      res.send(cliente);
    }
  });
};

export const deletePersona = (req, res) => {
  PersonaModel.deleteOne({_id: req.params.personaId}, (err, resp) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (resp.n === 0) return res.sendStatus(404);
      res.sendStatus(204);
    }
  });
};

export const patchPersona = (req, res) => {
  PersonaModel.findOneAndUpdate(
      {'_id': req.params.personaId},
      {$set: req.body},
      {runValidators: true}).then((result) => {
    if (result.nModified === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  }).catch((err) => res.status(400).send(err));
};

export const updatePersona = (req, res) => {
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
};

export const getPersonaChats = (req, res) => {
  ChatModel.find({cliente: req.params.id}).then((chats) => {
    res.send(chats);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getPersonaReservas = (req, res) => {
  ReservaModel.find({cliente: req.params.id}).then((reservas) => {
    res.send(reservas);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getPersonaReservaseDetail = (req, res) => {
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
};

export const getPersonaReservasDetailNext = (req, res) => {
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
};

export const getPersonaReservasDetailPast = (req, res) => {
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
};

export const login = (req, res) => {
  PersonaModel.findOne({correo: req.body.correo}).then((persona) => {
    if (!persona || persona.contrasena !== req.body.contrasena) {
      return res.sendStatus(404);
    }
    res.status(202).send(persona);
  }).catch((err) => res.status(400).send(err));
};


export const getPersonaServicios = (req, res) => {
  ServicioModel.find({trabajador: req.params.id}).then((servicios) => {
    res.send(servicios);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getPersonaServiciosReservas = (req, res) => {
  ServicioModel.find({trabajador: req.params.id}).then((servicios) => {
    const idsServicios = servicios.map((servicio) => servicio._id);
    ReservaModel.find({servicio: {$in: idsServicios}}).then((reservas) => {
      res.send(reservas);
    }).catch((err) => {
      res.status(400).send(err);
    });
  }).catch((err) => {
    res.status(400).send(err);
  });
};


export const getPersonaServiciosReservasDetalle = (req, res) => {
  ServicioModel.find({trabajador: req.params.id}).then((servicios) => {
    const idsServicios = servicios.map((servicio) => servicio._id);
    ReservaModel.find({
      servicio: {$in: idsServicios}})
        .populate({path: 'cliente servicio'})
        .then((reservas) => {
          res.send(reservas);
        }).catch((err) => {
          res.status(400).send(err);
        });
  }).catch((err) => {
    res.status(400).send(err);
  });
};

export const getPersonaServiciosReservasDetalleNext = (req, res) => {
  ServicioModel.find({trabajador: req.params.id}).then((servicios) => {
    const idsServicios = servicios.map((servicio) => servicio._id);
    ReservaModel.find({servicio: {$in: idsServicios}})
        .populate({path: 'cliente servicio'}).then((reservas) => {
          const now = new Date();
          const finalReservas = reservas.filter(
              (reserva) => reserva.fechaInicio > now);
          res.send(finalReservas);
        }).catch((err) => {
          res.status(400).send(err);
        });
  }).catch((err) => {
    res.status(400).send(err);
  });
};
