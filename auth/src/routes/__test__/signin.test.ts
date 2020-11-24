import request from 'supertest';
import { app } from '../../app';

it('fail when a email that does exist is supplied', async () => {
    await request(app)
            .post('/api/users/sign-in')
            .send({
                email: 'test@test.com',
                password: 'abcs'
            })
            .expect(400)
})

it('fail when an incorrect password is supplied', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'cc@test.com',
                password: 'abcsdf'
            })
            .expect(201)
    await request(app)
            .post('/api/users/sign-in')
            .send({
                email: 'cc@test.com',
                password: 'abcs'
            })
            .expect(400)
})

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'abcsdf'
            })
            .expect(201)
    const response = await request(app)
            .post('/api/users/sign-in')
            .send({
                email: 'test@test.com',
                password: 'abcsdf'
            })
            .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();
})