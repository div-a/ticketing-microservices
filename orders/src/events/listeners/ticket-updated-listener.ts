import { Listener, Subjects, TicketUpdatedEvent } from '@divaltickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    //['data'] gets type of data property on event and enforces that type
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const{ id, title, price } = data;

        // compare events ticket version to most recent ticket version in database
        // helps prevent processing events out of sync!
        const ticket = await Ticket.findByEvent(data)

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({
            title, 
            price
        })
        await ticket.save();

        msg.ack();
    }
}