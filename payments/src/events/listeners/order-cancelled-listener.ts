import { Listener, Subjects, OrderCancelledEvent, OrderStatus } from '@divaltickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
// import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    //['data'] gets type of data property on event and enforces that type
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!order) {
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();

        msg.ack();
    }
}