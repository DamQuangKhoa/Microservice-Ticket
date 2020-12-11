import { NotFoundError } from '@tedvntickets/common';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();


router.get('/api/tickets', async (req: Request, res: Response) => {
    const ticket = await Ticket.find({});

    if(!ticket){
        throw new NotFoundError();
    }
    res.send(ticket);
})

export {router as showTicketsRouter}