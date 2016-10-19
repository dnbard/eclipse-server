const expect = require('chai').expect;
const sinon = require('sinon');

const settings = require('../../db/settings');

describe('Settings Model', () => {
    describe('#createOne', () => {
        it('should validate empty arguments', (done) => {
            const spy = sinon.spy();
            settings.createOne().catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });

        it('should validate wrong arguments', (done) => {
            const spy = sinon.spy();
            settings.createOne(1, 2).catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });

        it('should resolve', (done) => {
            const key = 'eclipse.my.setting';
            const value = 1;

            settings.createOne(key, value).then(s => {
                expect(s._id).to.be.equal(key);
                done();
            }).catch(done);
        });
    });
});
