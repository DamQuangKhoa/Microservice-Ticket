import { OrderCancelledEvent } from "@tedvntickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from 'mongoose'

const setUp = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // Create and save a ticket
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'abc',
        price: 99,
        userId: 'abc'
    });
    ticket.set({ orderId })
    await ticket.save();
    // Create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: 'abc',
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }
    // Create the fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener , ticket, data, msg};
}
it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
})

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setUp();

    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async () => {
    const { listener , ticket, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})