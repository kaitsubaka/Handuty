
import {Router} from 'express';
import {
  createReserva,
  deleteReserva,
  getReserva,
  getReservas,
  patchReserva,
  updateReserva,
} from '../controllers/reservas.ctl';
const router = new Router();

router.get('/', getReservas);

router.get('/:id', getReserva);

router.put('/:id', updateReserva);

router.patch('/:id', patchReserva);

router.post('/', createReserva);

router.delete('/:id', deleteReserva);

export const ReservaRouter = router;
