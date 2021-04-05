import nats from 'node-nats-streaming';

console.clear();

//stan is client (nats convention)
const stan = nats.connect('ticketing', 'publisher_client_id', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    stan.publish('ticket:created', data, () => {
        console.log('event published');
    });
});