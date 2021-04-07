import request from "supertest"
import { app } from "../../app";
import { natsWrapper } from '../../nats-wrapper'
import mongoose from "mongoose";
import { OrderStatus } from "@divaltickets/common";
import { Order } from "../../models/order";

it('returns 404 when purchasing an order that does not exist', async () => {
    const response =  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'fake',
        orderId:  new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
});

it('returns 401 when purchasing an order that doesn\'t belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    
    const response =  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: order.id,
        orderId:  new mongoose.Types.ObjectId().toHexString()
    })
    .expect(401)
});

it('returns 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })

    const response =  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        orderId: order.id,
        token: 'asd'
    })
    .expect(400);
});

