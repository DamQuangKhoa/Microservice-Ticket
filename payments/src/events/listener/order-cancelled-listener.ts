import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@tedvntickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";


export class OrderCancelledListner extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        // find the order
        const order = await Order.findOne({
            _id: data.id,
            version: data.version -1
        })

        if(!order){
            throw new Error('Order not found');
        }

        // mark as cancel
        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save();

        msg.ack();

    }
}