import request from "supertest"
import { app } from "../../app";
import mongoose from "mongoose";


it('returns 404 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'test_title',
        price: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test_title',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user doesn\'t own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'test_title',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'other_title',
            price: 178
        })
        .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test_title',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);
});

it('updates the ticket provided valid values', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test_title',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Valid Title',
            price: 40
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual('Valid Title')
    expect(ticketResponse.body.price).toEqual(40)
});