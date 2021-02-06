import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@tedvntickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { showTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';
const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // if test > false
    })
); 
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketsRouter)
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app };