import request from 'supertest';
import { app } from '../../app';


it('Returns a 201 on successful sign up', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'abcs'
            })
            .expect(201);
})

it('Returns a 400 with invalid Email', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test',
                password: 'abcs'
            })
            .expect(400);
})

it('Returns a 400 with invalid Password', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@gmail.com',
                password: 'c'
            })
            .expect(400);
})

it('Returns a 400 with missing Email and Password', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'abc@gmail.com'
            })
            .expect(400);
    await request(app)
            .post('/api/users/signup')
            .send({
                password: 'abcd'
            })
            .expect(400);
})


it('Dis Allow dupplicate emails', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'abcs'
            })
            .expect(201);;
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'abcs'
            })
            .expect(400);
})

it('It set cookie after successful sign up', async () => {
    const response = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'abcs'
            })
            .expect(201);;
    expect(response.get('Set-Cookie')).toBeDefined();
})