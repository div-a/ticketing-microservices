import { Listener, Subjects, PaymentCreatedEvent, OrderStatus } from '@divaltickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    //['data'] gets type of data property on event and enforces that type
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Complete
        })
        await order.save();

        msg.ack();
    }
}