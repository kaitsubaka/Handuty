import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import {initMongoose} from './mongoose';
import path from 'path';
import {MensajeRouter} from '../routes/mensajes.routes';


initMongoose();
// Express
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/clientes', clientesRouter);
app.use('/reservas', reservasRouter);
app.use('/chats', chatsRouter);
app.use('/mensajes', MensajeRouter);
app.use('/servicios', serviciosRouter);

// express app configured
export default app;
