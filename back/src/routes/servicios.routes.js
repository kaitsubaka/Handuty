import {Router} from 'express';
import {
  getServicesDetail,
  getServices,
  getCategorias,
  getService,
  updateService,
  patchService,
  createService,
  deleteService,
  getServiceReservas,
  getServiceReservasNext,
  getCategoria,
} from '../controllers/servicios.ctl';
const router = new Router();


router.get('/', getServices);

router.get('/detalle', getServicesDetail);

router.get('/categorias', getCategorias);

router.get('/:id', getService);

router.put('/:id', updateService);

router.patch('/:id', patchService);

router.post('/', createService);

router.delete('/:id', deleteService);

router.get('/:id/reservas', getServiceReservas);

router.get('/:id/reservas/next', getServiceReservasNext);

router.get('/categorias/:categoria', getCategoria);


export const ServicioRouter = router;
