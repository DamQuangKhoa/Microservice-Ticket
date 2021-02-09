import { Listener, Subjects, OrderCreatedEvent } from "@tedvntickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        // Find the Ticket
        const ticket = await Ticket.findById(data.ticket.id);
        // If no ticket found, throw an error
        if(!ticket) throw new Error('Ticket not found')
        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({
            orderId: data.id
        });

        // Save the ticket
        await ticket.save();

        // Ack the message
        msg.ack();
    }
}