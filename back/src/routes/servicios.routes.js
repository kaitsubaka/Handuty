const express = require("express");
const Servicio = require("../models/servicio.model");
const Reserva = require("../models/reserva.model");
const Trabajador = require("../models/trabajador.model");
const servicio = require("../models/servicio.model");
const router = express.Router();
const {Categorias} = require("../models/validator.model");


router.get('/', function (req, res) {
    Servicio.find({}).then(servicios => {
        res.send(servicios);
    }).catch(err => {
        res.status(400).send(err)
    });
});

router.get('/detalle', function (req, res) {
    Servicio.find({}).populate({path: "trabajador"}).then(servicios => {
        res.send(servicios);
    }).catch(err => {
        res.status(400).send(err);
    });
});

router.get('/categorias', function (req, res) {
    res.send(Categorias);
});

router.get('/:id', function (req, res) {
    Servicio.findById(req.params.id).then(servicio => {
        if (!servicio) return res.status(404).send("Servicio no encontrado");
        res.send(servicio);
    }).catch(err => res.status(400).send(err));
});


router.put("/:id", function (req, res, next) {
    Servicio.replaceOne({"_id": req.params.id}, req.body, {runValidators: true}).then((result) => {
        if (result.nModified === 0)
            return res.sendStatus(404);
        res.sendStatus(200);
    }).catch((err) => res.status(400).send(err));
});

router.patch("/:id", function (req, res, next) {
    Servicio.findOneAndUpdate({"_id": req.params.id}, {$set: req.body}, {runValidators: true}).then((result) => {
        res.sendStatus(200);
    }).catch((err) => res.status(400).send(err));
});

router.post("/", (req, res) => {
    Trabajador.findById(req.body.trabajador).then(trabajador => {
        if (!trabajador) return res.status(404).send("Trabajador no encontrado");
        Servicio.findOne({trabajador: trabajador._id, categoria: req.body.categoria}).then(servicio => {
            console.log("servicio ", servicio);
            if (servicio) return res.status(400).send("El trabajador ya ofrece este servicio.");
            Servicio.create(req.body).then(servicio => {
                res.status(201).send(servicio);
            }).catch(err => {
                res.status(400).send(err)
            });
        }).catch(err => {
            res.status(400).send(err)
        });

    }).catch(err => {
        res.status(400).send(err)
    });

});

router.delete("/:id", (req, res) => {
    Servicio.deleteOne({_id: req.params.id}).then(resp => {
        resp.n === 0 ? res.sendStatus(404) : res.sendStatus(204);
    }).catch(err => res.status(400).send(err));
});

router.get("/:id/reservas", (req, res) => {
    Reserva.find({servicio: req.params.id}).then(reservas => {
        res.send(reservas);
    }).catch(err => {
        res.status(400).send(err)
    });
});

router.get("/:id/reservas/next", (req, res) => {
    Reserva.find({servicio: req.params.id}).then(reservas => {
        const now = new Date();
        const reservasFinal = reservas.filter(reserva => reserva.fechaInicio > now);
        res.send(reservasFinal);
    }).catch(err => {
        res.status(400).send(err)
    });
});

router.get('/categorias/:categoria', function (req, res) {
    Servicio.find({categoria: req.params.categoria}).populate({path: "trabajador"}).then(servicios => {
        res.send(servicios);
    }).catch(err => {
        res.status(400).send(err)
    });
});


module.exports = router;
  