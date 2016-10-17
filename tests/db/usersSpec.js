const expect = require('chai').expect;
const sinon = require('sinon');

const users = require('../../db/users');
// const db = require('../../core/mongo').getDatabase();

describe('Users Model', () => {
    // beforeEach(() => {
    //     sinon.stub(db.collection('users'), 'insertOne');
    // });
    // afterEach(() => {
    //     db.collection('users').insertOne.restore();
    // });

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
    });
});
