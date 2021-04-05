import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from '@divaltickets/common'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('event data !', data)
        msg.ack();
    }
}