const _ = require('lodash')
const {createToken, verifyToken} = require('../../controllers/auth')

describe('Unit', () => {
    describe('Auth Controller', () => {
        let env = null, TOKEN = ''
        beforeAll(() => {
            env = process.env;
            process.env.USER_EMAIL = 'test@test.com'
            process.env.USER_PASSWORD = 'password'
            process.env.TOKEN_SECRET = '!@SEcreaTe3532%(test#4'
            process.env.TOKEN_SECRET = 5
        })
        afterAll(() => {
            process.env = env;
        })
        describe('createToken', () => {
            it('should return token when valid credentials are being passed', () => {
                const req = {
                    body: {
                        email: 'test@test.com',
                        password: 'password'
                    }
                }

                const mockedResponse = {
                    send: (payload) => {
                        TOKEN = payload.token
                        expect(payload).toHaveProperty('token')
                        expect(payload.token).not.toBeFalsy()
                    },
                    sendStatus: (status) => {
                    }
                };
                const mockNext = (error) => {
                    expect(error).toBeFalsy()
                }
                createToken(req, mockedResponse, mockNext)
            })
            it('should throw error when invalid payload are being passed', () => {
                const req = {
                    body: {}
                }

                const mockedResponse = {
                    send: (payload) => {
                    },
                    sendStatus: (status) => {
                    }
                };
                const mockNext = (error) => {
                    expect(error.status).toBe(400)
                    expect(error.message).toBe('Missing parameter')
                }
                createToken(req, mockedResponse, mockNext)
            })
            it('should throw error when invalid credentials are being passed', () => {
                const req = {
                    body: {
                        email: 'invalie@test.com',
                        password: 'invalid'
                    }
                }

                const mockedResponse = {
                    send: (payload) => {
                    },
                    sendStatus: (status) => {
                        expect(status).toBe(401)
                    }
                };
                const mockNext = (error) => {
                }
                createToken(req, mockedResponse, mockNext)
            })
        })
        describe('verifyToken', () => {
            it('should call "next()" without error when valid token is being passed', () => {
                const socket = {
                    handshake: {
                        query: {
                            token: TOKEN,
                        }
                    }
                }
                const mockNext = (error) => {
                    expect(error).toBeFalsy()
                }
                verifyToken(socket, mockNext)
            })
            it('should throw error when invalid token is being passed', () => {
                const socket = {
                    handshake: {
                        query: {
                            token: "invalid token",
                        }
                    }
                }
                const mockNext = (error) => {
                    expect(error.message).toBe('Authentication error')
                }
                verifyToken(socket, mockNext)
            })
        })
    })
})
