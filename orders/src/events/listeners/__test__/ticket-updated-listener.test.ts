import { TicketUpdatedEvent } from "@divaltickets/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener";


const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);    

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version+1,
        title: 'new concert',
        price: 999,
        userId: 'fake_user'
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {msg, data, ticket, listener};
}

it('finds, updates and  saves a ticket', async () => {
    const {msg, data, ticket, listener} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(data.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {
    const {msg, data, listener} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})


it('does not call ack if the event has skipped a version number', async () => {
    const {msg, data, listener} = await setup();

    data.version = 10 //set version to incorrect number
    
    try {
        await listener.onMessage(data, msg);
    } catch (err) {}
    
    expect(msg.ack).not.toHaveBeenCalled();
})