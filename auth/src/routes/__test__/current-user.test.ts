import request from 'supertest';
import { app } from '../../app';


it('responds with detail about user', async () => {
    const cookie = await global.signin()
    const response = await request(app)
            .get('/api/users/current-user')
            .set('Cookie', cookie)
            .send()
            .expect(200)
    expect(response.body.currentUser.email).toEqual('test@test.com')
})