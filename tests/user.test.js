const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')

const userOne ={
    name: 'Richa',
    email: 'richa@example.com',
    password: 'MyPass777!'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
});

test('user create should be successful', async () => {
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(200)
})

test('user login', async () => {
    await request(app).post('/users').send({
        email: userOne.email,
        password: 'MyPass77!'
    }).expect(200)
})
