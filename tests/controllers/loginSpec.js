const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const server = require('../../server');
const LoginController = require('../../controllers/loginController');
const Tokens = require('../../db/tokens');

chai.use(chaiHttp);
const expect = chai.expect;

server.then(s => {
    describe('Login Smoke', () => {
        describe('POST /login', () => {
            it('should return 400 no login', done => {
                chai.request(s)
                    .post('/login')
                    .send({ password: "asdasdasd", login: "" })
                    .catch(res => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it('should return 400 no password', done => {
                chai.request(s)
                    .post('/login')
                    .send({ login: "asdasd" })
                    .then(() => done('Resolve promise should not be called'))
                    .catch(res => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it('should return 404 on non-existing user', done => {
                chai.request(s)
                    .post('/login')
                    .send({ login: "asdasd", password: "1232132" })
                    .catch(res => {
                        expect(res).to.have.status(404);
                        done();
                    });
            });

            it('should return 200', done => {
                let user = null;

                chai.request(s)
                    .post('/users')
                    .send({ password: "asdasdasd", login: faker.name.findName() })
                    .then(res => {
                        user = res.body;

                        return chai.request(s)
                            .post('/login')
                            .send({ login: user.login, password: "asdasdasd" });
                    }).then(res => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body._id).to.be.string;
                        expect(res.body.userId).to.be.string;
                        expect(res.body.token).to.be.string;

                        done();
                    }).catch(err => done);
            });
        });
    });
});
