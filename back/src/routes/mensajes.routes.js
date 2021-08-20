import {Router} from 'express';
import {
  createMessage,
  deleteMessage,
  getMessageById,
  getMessages,
  patchMessage,
  updateMessage,
} from '../controllers/mensajes.ctl';
const router = new Router();
// obtener mensajes de un chat
router.get('/', getMessages);

// obtener un mensaje de un chat
router.get('/:mensajeId', getMessageById);

// crear un nuevo mensaje en un chat
router.post('/', createMessage);

// borrar un mensaje de un chat
router.delete('/:mensajeId', deleteMessage);

router.patch('/:mensajeId', patchMessage);

router.put('/:mensajeId', updateMessage);

export const MensajeRouter = router;
