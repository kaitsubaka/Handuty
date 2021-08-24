import {Router} from 'express';
import {
  createPersona,
  deletePersona,
  getPersona,
  getPersonaChats,
  getPersonaReservas,
  getPersonaReservasDetailNext,
  getPersonaReservasDetailPast,
  getPersonaReservaseDetail,
  getPersonas,
  getPersonaServicios,
  getPersonaServiciosReservas,
  getPersonaServiciosReservasDetalle,
  getPersonaServiciosReservasDetalleNext,
  login,
  patchPersona,
  updatePersona,
} from '../controllers/persona.ctl';

const router = new Router();

router.get('/', getPersonas);

router.post('/', createPersona);

router.get('/:personaId', getPersona);

router.delete('/:personaId', deletePersona);

router.patch('/:personaId', patchPersona);

router.put('/:personaId', updatePersona);

router.get('/:id/chats', getPersonaChats);

router.get('/:id/reservas', getPersonaReservas);

router.get('/:id/reservas/detalle', getPersonaReservaseDetail);

router.get('/:id/reservas/detalle/next', getPersonaReservasDetailNext);

router.get('/:id/reservas/detalle/past', getPersonaReservasDetailPast);

router.post('/login', login);

router.get('/:id/servicios', getPersonaServicios);

router.get('/:id/servicios/reservas', getPersonaServiciosReservas);


router.get('/:id/servicios/reservas/detalle',
    getPersonaServiciosReservasDetalle);

router.get('/:id/servicios/reservas/detalle/next',
    getPersonaServiciosReservasDetalleNext);

export const PersonaRouter = router;
