import {Router} from 'express';
import {
  createChat,
  deleteChat,
  getChatById,
  getChatMessages,
  getChats,
  patchChat,
  updateChat,
} from '../controllers/chat.ctl';

const router = new Router();

router.get('/', getChats);

router.get('/:chatId', getChatById);

router.post('/', createChat);

router.delete('/:chatId', deleteChat);

router.patch('/:chatId', patchChat);

router.put('/:chatId', updateChat);

router.get('/:id/mensajes', getChatMessages);

export const ChatRouter = router;
