const expect = require('chai').expect;
const sinon = require('sinon');

const users = require('../../db/users');

describe('Users Model', () => {
    const login = 'test-user';
    const password = 'qwerty444';

    describe('#createOne', () => {
        it('should validate empty argument', (done) => {
            const spy = sinon.spy();
            users.createOne().catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });

        it('should validate empty arguments', (done) => {
            const spy = sinon.spy();
            users.createOne({ }).catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });

        it('should validate login with wrong characters', (done) => {
            const spy = sinon.spy();
            users.createOne({ login: '!@#$!@$@!#!@', password: '123' }).catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });

        it('should validate password with wrong characters', (done) => {
            const spy = sinon.spy();
            users.createOne({ login: 'asd', password: '!@#$#%%&*()' }).catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });

        it('should resolve', function(done){
            users.createOne({
                login: login,
                password: password
            }).then((result) => {
                expect(result.login).to.be.equal(login);
                expect(result.password).to.not.be.undefined;
                expect(result.salt).to.not.be.undefined;
                done();
            }).catch(err => done);
        });
    });
});
