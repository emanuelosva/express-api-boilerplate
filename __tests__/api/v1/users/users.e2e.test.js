const { describe } = require('joi')
const { db, request } = require('../../helpers')
const {
  userCreateMock,
  userMock,
  userService,
} = require('./users.mocks')

const BASE_URL = '/api/v1/users'
const contentTypeHeader = 'Content-Type'
const contentTypeValue = 'application/json'

describe('Users', () => {
  beforeAll(async () => {
    await db.connect()
  })
  afterEach(async () => {
    await db.drop('users')
  })
  afterAll(async () => {
    await db.disconnect()
  })

  describe('POST /users/signup/', () => {
    test('Should return 201 - the user info', async () => {
      const { body: { data }, status } = await request
        .post(`${BASE_URL}/signup`)
        .set(contentTypeHeader, contentTypeValue)
        .send(userCreateMock)

      expect(status).toBe(201)
      expect(data.email).toEqual(userCreateMock.email)
    })

    test('Should return 400 - if email is not an email', async () => {
      const { body, status } = await request
        .post(`${BASE_URL}/signup/`)
        .set(contentTypeHeader, contentTypeValue)
        .send({ ...userCreateMock, email: 'fake.mx' })

      expect(status).toBe(400)
      expect(body.message).toBeDefined()
    })
  })

  describe('POST /users/login/', () => {
    test('Should return 200 - the user info, access and reresh tokens', async () => {
      await userService.insert(userMock)
      const { body: { data }, status } = await request
        .post(`${BASE_URL}/login/`)
        .set(contentTypeHeader, contentTypeValue)
        .send({ email: userMock.email, password: userMock.password })

      expect(status).toBe(200)
      expect(data.accessToken).toBeDefined()
      expect(data.refreshToken).toBeDefined()
      expect(data.user.email).toEqual(userMock.email)
    })

    test('Should return 400 - if email is not an email', async () => {
      const { body, status } = await request
        .post(`${BASE_URL}/signup`)
        .set(contentTypeHeader, contentTypeValue)
        .send({ email: 'fake.mx', password: userMock.password })

      expect(status).toBe(400)
      expect(body.message).toBeDefined()
    })

    test('Should return 401 - if invalid', async () => {
      const { body, status } = await request
        .post(`${BASE_URL}/signup`)
        .set(contentTypeHeader, contentTypeValue)
        .send({ email: 'fake@test.mx', password: 'superFake001' })

      expect(status).toBe(401)
      expect(body.message).toBeDefined()
    })
  })
})
