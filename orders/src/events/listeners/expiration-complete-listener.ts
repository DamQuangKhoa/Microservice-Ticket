import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@tedvntickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message){
        // Find the Order
        const order = await Order.findById(data.orderId).populate('ticket');
        // Check if order exist
        if(!order) throw new Error('Order not found');
        
        if(order.status === OrderStatus.Complete){
            return msg.ack();
        }
        // Set order status to Cancelled
        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save();

        // publishs an event cancelled order
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();
    }
}