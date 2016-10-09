const expect = require('chai').expect;
const Angle = require('../../physics/angle');

describe('Physics - Angle', () => {
    describe('#getAngleBetweenTwoPoints', () => {
        it('should return angle', () => {
            expect(Angle.getAngleBetweenTwoPoints(0, 0, 100, 100).toFixed(2))
                .to.be.equal('0.79');
        });

        it('should throw an error on invalid arguments', () => {
            expect(Angle.getAngleBetweenTwoPoints).to.throw(/invalid arguments/i);
        });
    });
});
