const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const server = require('../../server');
const UsersController = require('../../controllers/usersController');
const Tokens = require('../../db/tokens');

chai.use(chaiHttp);
const expect = chai.expect;

server.then(s => {
    describe('Users Smoke', () => {
        describe('GET /users', () => {
            it('should return current user', done => {
                let user = null;

                chai.request(s)
                    .post('/users')
                    .send({ password: "asdasdasd", login: faker.name.findName() })
                    .then(res => {
                        user = res.body;

                        return chai.request(s)
                            .get('/users')
                            .set('Authorization', `Bearer ${user.token}`);
                    }).then((res) => {
                        expect(res.body._id).to.equal(user._id);
                        done();
                    });
            });
        });

        describe('POST /users', () => {
            it('should create new user', done => {
                chai.request(s)
                    .post('/users')
                    .send({ password: "asdasdasd", login: faker.name.findName() })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        done(err);
                    });
            });

            it('should not create user with same name', done => {
                chai.request(s)
                    .post('/users')
                    .send({ password: "asdasdasd", login: 'asdasdasd' })
                    .then(() => {
                        return chai.request(s)
                            .post('/users')
                            .send({ password: "asdasdasd", login: 'asdasdasd' })
                    }).catch(res => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it('should do validation', done => {
                chai.request(s)
                    .post('/users')
                    .send({ password: "asd", login: "qwe" })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res).to.be.html;

                        done();
                    });
            });
        });

        describe('#getUserByTokenInternal', () => {
            it('should handle wrong token', done => {
                UsersController.getUserByTokenInternal('abc').catch(err => {
                    expect(err).to.be.equal('Token not found');
                    done();
                });
            });

            it('should return user by existing token', done => {
                let userId = null;

                chai.request(s)
                    .post('/users')
                    .send({ password: "12asdddda23", login: faker.name.findName() })
                    .then((res) => {
                        userId = res.body.id;
                        return UsersController.getUserByTokenInternal(res.body.token);
                    }).then((user) => {
                        expect(userId).to.be.equal(user._id);
                        done();
                    });
            });

            it('should reject promise for expired tokens', done => {
                let user = null;

                chai.request(s)
                    .post('/users')
                    .send({ password: "12312312312312", login: faker.name.findName() })
                    .then((res) => {
                        user = res.body;
                        return Tokens.findOne({ token: user.token }).exec();
                    }).then(token => {
                        token.expiresAt = new Date(0);
                        return token.save();
                    }).then(() => {
                        return UsersController.getUserByTokenInternal(user.token);
                    }).catch(err => {
                        expect(err).to.match(/has been expired/);
                        done();
                    });
            });
        });
    });
});
