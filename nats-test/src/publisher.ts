import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

//stan is client (nats convention)
const stan = nats.connect('ticketing', 'publisher_client_id', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);

    await publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    });
});