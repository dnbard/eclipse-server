const expect = require('chai').expect;
const sinon = require('sinon');

const settings = require('../../db/settings');

describe('Settings Model', () => {
    describe('#createOne', () => {
        it('should validate empty argument', (done) => {
            const spy = sinon.spy();
            settings.createOne().catch(spy).then(() => {
                expect(spy.called).to.be.true;
                done();
            });
        });
    });
});
