import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import {initMongoose} from './mongoose';
import path from 'path';
import {MensajeRouter} from '../routes/mensajes.routes';
import {ChatRouter} from '../routes/chat.routes';
import {PersonaRouter} from '../routes/personas.routes';
import {ReservaRouter} from '../routes/reservas.routes';
import {ServicioRouter} from '../routes/servicios.routes';


initMongoose();
// Express
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/personas', PersonaRouter);
app.use('/reservas', ReservaRouter);
app.use('/chats', ChatRouter);
app.use('/mensajes', MensajeRouter);
app.use('/servicios', ServicioRouter);

// express app configured
export default app;
