import { Listener, Subjects, OrderCreatedEvent } from '@divaltickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
// import { Ticket } from '../../models/ticket';
// import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher.';
// import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    //['data'] gets type of data property on event and enforces that type
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order =  Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })
        await order.save();
        msg.ack();
    }
}