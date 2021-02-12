import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@tedvntickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        // find the Order
        const order = await Order.findById(data.orderId);
        // check order
        if(!order) throw new Error('Order not found')
        // update Order status
        order.set({
            status: OrderStatus.Complete
        })
        await order.save();

        

        msg.ack();
    }
}