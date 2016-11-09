const expect = require('chai').expect;
const UpdateLoop = require('../../core/updateLoop');

describe('UpdateLoop', () => {
    describe('#getTime', () => {
        it('should return time', () => {
            expect(UpdateLoop.getTime()).to.be.number;
        });
    });
});
