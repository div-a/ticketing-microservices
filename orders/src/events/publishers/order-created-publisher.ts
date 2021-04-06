import { Publisher, Subjects, OrderCreatedEvent } from "@divaltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}