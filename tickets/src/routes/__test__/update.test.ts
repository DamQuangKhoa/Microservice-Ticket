import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`api/tickets/1asdas`)
    .set('Cookie', global.signin())
    .send({
        title: 'aasddssd',
        price: 20
    })
    .expect(404);

})
it('return a 401 if the user is not authenticated', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
        price: 20
    })
    .expect(201)
    
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .send({
        title: 'aasddssd',
        price: 20
    })
    .expect(401);
})
it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abacs',
        price: 20
    })
    .expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'aasddssd',
        price: 20
    })
    .expect(401);
})

it('return a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'abacs',
            price: 20
        })
        .expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 20
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        price: 20
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'abacs',
        price: -10
    })
    .expect(400);
})
it('updates the ticket provided valid inputs', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'abac',
        price: 20
    })
    .expect(201)
    
    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual('abac')

})