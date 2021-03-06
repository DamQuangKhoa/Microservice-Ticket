import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post request', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .post(`/api/tickets/${id}`)
    .send({})
    .expect(404)

})
it('can only be accessed if the user is signed in ', async () => {
    await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401) 
})
it('returns an status other than 401 if the user is signed in', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

    expect(response.status).not.toEqual(401)
})
it('returns an error if an invalid title is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: '',
        price: 10
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        price: 10
    })
    .expect(400)
})
it('returns an error if an invalid price is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
        price: -10
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
    })
    .expect(400)
})
it('creates a ticket with valid inputs', async () => {
    // Add in a check to make sure a ticket was saved
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
        price: 20
    })
    .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    
})
it('returns the ticket if the ticket is found', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
        price: 20
    })
    .expect(201)

    await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)
})

it('publishes an event', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
        price: 20
    })
    .expect(201)

    await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})