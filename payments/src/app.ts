import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@tedvntickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false // if test > false
    })
); 
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app };