import mongoose from 'mongoose'
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from '@tedvntickets/common';

const setUp = async () => {
    // create an instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save the ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'abc',
        price: 15,
    })

    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'abc',
        price: 15,
        userId: mongoose.Types.ObjectId().toHexString(),
        version: ticket.version + 1
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket};

}

it('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setUp();
    // call the onMessage function with the data object + message object 
    await listener.onMessage(data, msg);
    // write assertions to make sure a ticket was created 
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setUp();
    // call the onMessage function with the data object + message object 
    await listener.onMessage(data, msg);
    // write assertions to make sure a ack function is call 
    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if the event has a skipped version', async () => {
    const { msg, data, listener, ticket } = await setUp();
    
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        
    }
    expect(msg.ack).not.toHaveBeenCalled();
    
})