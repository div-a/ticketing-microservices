import { Publisher, Subjects, TicketCreatedEvent } from "@divaltickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}